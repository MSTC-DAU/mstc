
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateEventSettings } from '@/app/actions/event-settings';
import { deleteEvent } from '@/app/actions/events';
import { toast } from 'sonner';
import { RichTextEditor } from './rich-text-editor';
import { EVENT_THEME_CONFIG } from '@/lib/themes-config';
import { ThemeSelector } from '@/components/admin/theme-selector';
import { Palette, Clock, Plus, Trash2, GripVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TimelineBuilder } from './timeline-builder';

export function EditEventSettings({ event }: { event: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState(event.description || '');
    const [rules, setRules] = useState(event.rules || '');
    const [theme, setTheme] = useState(event.theme || 'default');
    const [timeline, setTimeline] = useState(event.timeline || []);
    const [config, setConfig] = useState(event.config || { registrationFields: [] });

    const addField = () => {
        setConfig((prev: any) => ({
            ...prev,
            registrationFields: [
                ...(prev.registrationFields || []),
                { name: `field_${Date.now()}`, label: 'New Field', type: 'text' }
            ]
        }));
    };

    const removeField = (index: number) => {
        setConfig((prev: any) => ({
            ...prev,
            registrationFields: prev.registrationFields.filter((_: any, i: number) => i !== index)
        }));
    };

    const updateField = (index: number, key: string, value: string) => {
        setConfig((prev: any) => {
            const newFields = [...(prev.registrationFields || [])];
            newFields[index] = { ...newFields[index], [key]: value };
            // Auto-update name slug if label changes (optional, but good for UX, maybe just leave manual or generated on add)
            if (key === 'label') {
                newFields[index].name = value.toLowerCase().replace(/[^a-z0-9]/g, '_');
            }
            return { ...prev, registrationFields: newFields };
        });
    };

    async function handleSubmit(formData: FormData) {
        setLoading(true);

        // Helper to convert local datetime-local string to UTC ISO string
        const toUTC = (dateStr: string) => {
            if (!dateStr) return '';
            return new Date(dateStr).toISOString();
        };

        // Convert main date fields
        const dateFields = ['startDate', 'endDate', 'registrationStartDate', 'registrationEndDate'];
        dateFields.forEach(field => {
            const val = formData.get(field) as string;
            // Only convert if it doesn't end in Z (which would mean it's already UTC, though inputs usually aren't)
            // Actually, input type='datetime-local' returns YYYY-MM-DDTHH:mm without Z.
            if (val && !val.endsWith('Z')) {
                formData.set(field, toUTC(val));
            }
        });

        // Convert timeline dates
        const timelineJson = formData.get('timeline') as string;
        if (timelineJson) {
            try {
                const timeline = JSON.parse(timelineJson);
                const updatedTimeline = timeline.map((item: any) => ({
                    ...item,
                    startDate: item.startDate && !item.startDate.endsWith('Z') ? toUTC(item.startDate) : item.startDate,
                    endDate: item.endDate && !item.endDate.endsWith('Z') ? toUTC(item.endDate) : item.endDate
                }));
                formData.set('timeline', JSON.stringify(updatedTimeline));
            } catch (e) {
                console.error("Error parsing timeline json", e);
            }
        }

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

                <div className="space-y-2 pt-4 border-t border-white/10">
                    <Label className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                        <Clock className="size-5" /> Timeline
                    </Label>
                    <TimelineBuilder value={timeline} onChange={setTimeline} />
                    <input type="hidden" name="timeline" value={JSON.stringify(timeline)} />
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                        <Label className="text-lg font-semibold text-green-400 flex items-center gap-2">
                            <GripVertical className="size-5" /> Registration Fields
                        </Label>
                        <Button type="button" onClick={addField} size="sm" variant="secondary" className="h-8">
                            <Plus className="size-4 mr-2" /> Add Field
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {(config.registrationFields || []).map((field: any, index: number) => (
                            <div key={index} className="flex gap-2 items-start p-3 bg-white/5 rounded-lg border border-white/10">
                                <div className="grid gap-2 flex-1 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-white/60">Label</Label>
                                        <Input
                                            value={field.label}
                                            onChange={(e) => updateField(index, 'label', e.target.value)}
                                            placeholder="e.g. T-Shirt Size"
                                            className="bg-black/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-white/60">Type</Label>
                                        <Select
                                            value={field.type}
                                            onValueChange={(val) => updateField(index, 'type', val)}
                                        >
                                            <SelectTrigger className="bg-black/20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="text">Text Input</SelectItem>
                                                <SelectItem value="number">Number</SelectItem>
                                                <SelectItem value="textarea">Long Text</SelectItem>
                                                <SelectItem value="url">URL</SelectItem>
                                                <SelectItem value="select">Select (Not impl)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-950/20 mt-6"
                                    onClick={() => removeField(index)}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        ))}
                        {(!config.registrationFields || config.registrationFields.length === 0) && (
                            <p className="text-sm text-white/40 italic text-center py-4">No custom registration fields.</p>
                        )}
                        <input type="hidden" name="config" value={JSON.stringify(config)} />
                    </div>
                </div>
            </div>

            <div className="pt-8 mt-8 border-t border-red-900/30">
                <div className="bg-red-950/10 border border-red-900/20 rounded-xl p-6">
                    <h4 className="text-red-500 font-bold mb-2 flex items-center gap-2">
                        <Palette className="size-4" /> Danger Zone
                    </h4>
                    <p className="text-sm text-red-400/60 mb-4">
                        Deleting an event is irreversible. It will remove all registrations, teams, awards, and data associated with this event.
                    </p>
                    <Button
                        type="button"
                        variant="destructive"
                        className="bg-red-950 hover:bg-red-900 text-red-500 border border-red-900/50"
                        onClick={async () => {
                            if (window.confirm('ARE YOU SURE? This action cannot be undone. Type "DELETE" to confirm (just clicking OK for now).')) {
                                setLoading(true); // Reuse loading state or local
                                const res = await deleteEvent(event.id);
                                if (res.success) {
                                    toast.success(res.message);
                                    router.push('/admin/events');
                                } else {
                                    toast.error(res.message);
                                    setLoading(false);
                                }
                            }
                        }}
                    >
                        Delete Entire Event
                    </Button>
                </div>
            </div>

        </form>
    );
}
