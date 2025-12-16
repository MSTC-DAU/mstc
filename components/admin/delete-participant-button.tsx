'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { removeParticipant } from '@/app/actions/registrations';
import { toast } from 'sonner';

export function DeleteParticipantButton({ registrationId, name }: { registrationId: string, name: string }) {
    const [loading, setLoading] = useState(false);

    async function handleRemove() {
        if (confirm(`Are you sure you want to remove ${name}? This will delete their registration and submissions.`)) {
            setLoading(true);
            const res = await removeParticipant(registrationId);
            setLoading(false);

            if (res.success) {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
            onClick={handleRemove}
            disabled={loading}
            title="Remove Participant"
        >
            <Trash2 className="size-4" />
        </Button>
    );
}
