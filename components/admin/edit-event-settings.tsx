
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateEventSettings } from '@/app/actions/event-settings';
import { toast } from 'sonner';
import { RichTextEditor } from './rich-text-editor';
import { EVENT_THEME_CONFIG } from '@/lib/themes-config';
import { ThemeSelector } from '@/components/admin/theme-selector';
import { Palette } from 'lucide-react';

export function EditEventSettings({ event }: { event: any }) {
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState(event.description || '');
    const [rules, setRules] = useState(event.rules || '');
    const [theme, setTheme] = useState(event.theme || 'default');

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const res = await updateEventSettings(event.id, formData);
        setLoading(false);

        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
    }

    // Helper to format Date object to "YYYY-MM-DDTHH:mm" for datetime-local input
    const formatDate = (date: Date | null) => {
        if (!date) return '';
        const d = new Date(date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    };

    return (
        <form action={handleSubmit} className="space-y-4 p-6 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Event Settings</h3>
                <Button type="submit" disabled={loading} size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>Status</Label>
                    <Select name="status" defaultValue={event.status}>
                        <SelectTrigger className="bg-black/20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="live">Live (Active)</SelectItem>
                            <SelectItem value="past">Past (Archived)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Poster URL</Label>
                    <Input name="posterUrl" defaultValue={event.posterUrl} placeholder="https://..." className="bg-black/20" />
                </div>
                <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="datetime-local" name="startDate" defaultValue={formatDate(event.startDate)} className="bg-black/20" />
                </div>
                <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="datetime-local" name="endDate" defaultValue={formatDate(event.endDate)} className="bg-black/20" />
                </div>
                <div className="space-y-2">
                    <Label>Registration Start Date</Label>
                    <Input type="datetime-local" name="registrationStartDate" defaultValue={formatDate(event.registrationStartDate)} className="bg-black/20" />
                </div>
                <div className="space-y-2">
                    <Label>Registration End Date</Label>
                    <Input type="datetime-local" name="registrationEndDate" defaultValue={formatDate(event.registrationEndDate)} className="bg-black/20" />
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="space-y-2">
                    <Label>Event Theme</Label>
                    <label className="text-sm font-medium">Event Theme</label>
                    <ThemeSelector value={theme} onChange={setTheme} name="theme" />
                </div>

                <div className="space-y-2">
                    <RichTextEditor
                        label="Event Description"
                        placeholder="Describe your event..."
                        value={description}
                        onChange={setDescription}
                    />
                    <input type="hidden" name="description" value={description} />
                </div>

                <div className="space-y-2">
                    <RichTextEditor
                        label="Rules of Conduct"
                        placeholder="List the rules and guidelines..."
                        value={rules}
                        onChange={setRules}
                    />
                    <input type="hidden" name="rules" value={rules} />
                </div>
            </div>

        </form >
    );
}
