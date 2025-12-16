
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Lock, Upload, MessageSquare } from 'lucide-react';
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

                            <Card className="bg-slate-950/50 border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group/card">
                                {/* Subtle ice shimmer on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                                <CardHeader className="pb-3 flex flex-row items-center justify-between relative z-10">
                                    <div>
                                        <div className="text-sm text-cyan-400 font-mono mb-1 tracking-widest uppercase">{week.title}</div>
                                        <CardTitle className="text-xl font-bold tracking-tight text-white">{week.tasks.length} Tasks</CardTitle>
                                    </div>
                                    <Badge variant="outline" className={`capitalize border shadow-[0_0_10px_rgba(0,0,0,0.5)] ${isCompleted ? 'border-green-500/50 text-green-400 bg-green-500/10' :
                                        isSubmitted ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' : 'border-slate-700 text-slate-400 bg-slate-800/50'
                                        }`}>
                                        {isCompleted ? 'Completed' : isSubmitted ? 'Under Review' : 'Pending'}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="space-y-6 relative z-10">
                                    <div className="space-y-3">
                                        {week.tasks.map((task) => (
                                            <div key={task.id} className="group p-4 bg-gradient-to-br from-white/5 to-transparent border border-white/5 hover:border-cyan-500/30 transition-all duration-300 rounded-sm relative overflow-hidden">
                                                {/* Decorative corner accent */}
                                                <div className="absolute top-0 left-0 w-0 h-0 border-t-[1px] border-l-[1px] border-cyan-500/0 group-hover:border-cyan-500/50 group-hover:w-2 group-hover:h-2 transition-all duration-300" />

                                                <h4 className="font-bold text-gray-100 mb-1 group-hover:text-cyan-300 transition-colors uppercase tracking-tight text-sm">{task.title}</h4>
                                                <p className="text-sm text-gray-400 font-medium leading-relaxed">{task.description}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {status?.mentorFeedback && (
                                        <div className="my-6 p-4 rounded-sm bg-yellow-500/5 border-l-2 border-yellow-500">
                                            <div className="flex items-center gap-2 text-yellow-500 mb-2 font-bold uppercase text-xs tracking-widest">
                                                <MessageSquare className="size-4" /> Mentor Feedback
                                            </div>
                                            <p className="text-sm text-yellow-100/90 leading-relaxed">
                                                {status.mentorFeedback}
                                            </p>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-white/5">
                                        <Dialog open={open && selectedWeek === week.id} onOpenChange={(isOpen) => {
                                            if (isOpen) setSelectedWeek(week.id);
                                            setOpen(isOpen);
                                        }}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    className={`w-full font-black tracking-widest uppercase py-6 ${!isSubmitted
                                                        ? 'bg-cyan-500 text-black hover:bg-cyan-400 border-none shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all'
                                                        : 'border-white/20 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/40'
                                                        }`}
                                                    variant={isSubmitted ? "outline" : "default"}
                                                >
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
