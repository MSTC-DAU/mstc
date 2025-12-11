
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Lock, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { submitCheckpoint } from '@/app/actions/checkpoints';
import { toast } from 'sonner';

interface Task {
    id: string;
    title: string;
    description: string;
}

interface Week {
    id: number;
    title: string;
    tasks: Task[];
}

export default function RoadmapViewer({
    roadmapContent,
    eventId,
    submissions
}: {
    roadmapContent: Week[],
    eventId: string,
    submissions: Record<number, any>
}) {
    const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
    const [submissionText, setSubmissionText] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSubmit = async () => {
        if (!selectedWeek) return;
        setLoading(true);
        const res = await submitCheckpoint(eventId, selectedWeek, submissionText);
        setLoading(false);

        if (res.success) {
            toast.success(res.message);
            setOpen(false);
            // Ideally we optimistically update UI or fully refresh page
            window.location.reload();
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="space-y-8">
            <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-12">
                {roadmapContent.map((week, idx) => {
                    const status = submissions[week.id]; // exists? approved?
                    const isCompleted = status?.isApproved;
                    const isSubmitted = !!status;

                    return (
                        <div key={week.id} className="relative pl-8 md:pl-12">
                            {/* Timeline Node */}
                            <div className={`absolute -left-[5px] md:-left-[9px] top-0 size-3 md:size-5 rounded-full border-4 border-black ${isCompleted ? 'bg-green-500' : isSubmitted ? 'bg-yellow-500' : 'bg-gray-600'
                                }`} />

                            <Card className="bg-white/5 border-white/10">
                                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                    <div>
                                        <div className="text-sm text-cyan-400 font-mono mb-1">{week.title}</div>
                                        <CardTitle className="text-xl">{week.tasks.length} Tasks</CardTitle>
                                    </div>
                                    <Badge variant="outline" className={`capitalize ${isCompleted ? 'border-green-500/30 text-green-400' :
                                        isSubmitted ? 'border-yellow-500/30 text-yellow-400' : 'border-gray-500/30 text-gray-500'
                                        }`}>
                                        {isCompleted ? 'Completed' : isSubmitted ? 'Under Review' : 'Pending'}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        {week.tasks.map((task) => (
                                            <div key={task.id} className="p-3 bg-black/20 rounded-lg">
                                                <h4 className="font-semibold text-white mb-1">{task.title}</h4>
                                                <p className="text-sm text-gray-400">{task.description}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-white/10">
                                        <Dialog open={open && selectedWeek === week.id} onOpenChange={(isOpen) => {
                                            if (isOpen) setSelectedWeek(week.id);
                                            setOpen(isOpen);
                                        }}>
                                            <DialogTrigger asChild>
                                                <Button className="w-full" variant={isSubmitted ? "outline" : "default"}>
                                                    {isSubmitted ? 'Update Submission' : 'Submit Checkpoint'}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Submit {week.title}</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <p className="text-sm text-gray-400">
                                                        Provide links to your GitHub PRs, deployed URLs, or a short summary of your work for this week.
                                                    </p>
                                                    <Textarea
                                                        placeholder="https://github.com/my-repo/pr/1 ..."
                                                        className="min-h-[150px] bg-black/20"
                                                        value={submissionText}
                                                        onChange={(e) => setSubmissionText(e.target.value)}
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button onClick={handleSubmit} disabled={loading}>
                                                        {loading ? 'Submitting...' : 'Submit Work'}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
