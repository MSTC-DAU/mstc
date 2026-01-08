
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { approveCheckpoint, rejectCheckpoint } from '@/app/actions/grading';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, ExternalLink, MessageSquare } from 'lucide-react';
import { FormattedText } from '@/components/ui/formatted-text';

export default function CheckpointReviewQueue({ submissions, eventId }: { submissions: any[], eventId: string }) {
    const [loading, setLoading] = useState<string | null>(null); // storing ID of processing item

    const handleApprove = async (id: string) => {
        setLoading(id);
        const res = await approveCheckpoint(id, eventId);
        setLoading(null);
        if (res.success) toast.success(res.message);
        else toast.error(res.message);
    };

    const handleReject = async (id: string) => {
        const feedback = prompt("Enter feedback for the student:");
        if (!feedback) return;

        setLoading(id);
        const res = await rejectCheckpoint(id, feedback, eventId);
        setLoading(null);
        if (res.success) toast.success(res.message);
        else toast.error(res.message);
    };

    if (submissions.length === 0) {
        return (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                <CheckCircle2 className="size-12 mx-auto text-green-500 mb-4 opacity-50" />
                <h3 className="text-xl font-semibold">All Caught Up!</h3>
                <p className="text-gray-400">No pending submissions to review.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {submissions.map((sub) => (
                <Card key={sub.id} className="bg-white/5 border-white/10">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-lg text-white">
                                    {sub.registration.user.name}
                                    <span className="text-gray-500 font-normal ml-2">({sub.registration.user.email})</span>
                                </CardTitle>
                                <CardDescription>Week {sub.weekNumber}</CardDescription>
                            </div>
                            <Badge variant="outline" className="border-yellow-500/30 text-yellow-500">Pending Review</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 bg-black/30 rounded-md font-mono text-sm text-gray-300 break-all">
                            <FormattedText text={sub.submissionContent} />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                variant="destructive"
                                size="sm"
                                disabled={loading === sub.id}
                                onClick={() => handleReject(sub.id)}
                            >
                                <MessageSquare className="size-4 mr-2" /> Request Changes
                            </Button>
                            <Button
                                className="bg-green-600 hover:bg-green-700"
                                size="sm"
                                disabled={loading === sub.id}
                                onClick={() => handleApprove(sub.id)}
                            >
                                <CheckCircle2 className="size-4 mr-2" /> Approve (+XP)
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
