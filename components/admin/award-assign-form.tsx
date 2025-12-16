
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { assignAward } from '@/app/actions/awards';
import { toast } from 'sonner';

export function AwardAssignForm({ eventId, teams, users }: { eventId: string, teams: any[], users: any[] }) {
    const [title, setTitle] = useState('Winner');
    const [category, setCategory] = useState('');
    const [rank, setRank] = useState('1');
    const [recipientType, setRecipientType] = useState<'team' | 'user'>('team');
    const [selectedRecipient, setSelectedRecipient] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRecipient) return toast.error("Please select a recipient");

        setLoading(true);

        const teamId = recipientType === 'team' ? selectedRecipient : undefined;
        const userId = recipientType === 'user' ? selectedRecipient : undefined;

        const res = await assignAward(eventId, title, parseInt(rank), teamId, userId, undefined, category);
        setLoading(false);

        if (res.success) {
            toast.success(res.message);
            setSelectedRecipient('');
            setCategory('');
        } else {
            toast.error(res.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>Award Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. 1st Place, Best Design" />
            </div>

            <div className="space-y-2">
                <Label>Category</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Web Dev, App Dev (Optional)" />
            </div>

            <div className="space-y-2">
                <Label>Rank (Order)</Label>
                <Select value={rank} onValueChange={setRank}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1 (Highest)</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="99">Honorable Mention</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Recipient Type</Label>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant={recipientType === 'team' ? 'default' : 'outline'}
                        onClick={() => { setRecipientType('team'); setSelectedRecipient(''); }}
                        className="flex-1"
                    >
                        Team
                    </Button>
                    <Button
                        type="button"
                        variant={recipientType === 'user' ? 'default' : 'outline'}
                        onClick={() => { setRecipientType('user'); setSelectedRecipient(''); }}
                        className="flex-1"
                    >
                        Individual
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Recipient {recipientType === 'team' ? 'Team' : 'User'}</Label>
                <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                    <SelectTrigger>
                        <SelectValue placeholder={`Select ${recipientType}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {recipientType === 'team' ? (
                            teams.map(t => (
                                <SelectItem key={t.id} value={t.id}>{t.name} (Code: {t.joinCode})</SelectItem>
                            ))
                        ) : (
                            users.map(u => (
                                <SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
            </div>

            <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white" disabled={loading}>
                {loading ? 'Assigning...' : 'Assign Award'}
            </Button>
        </form>
    );
}
