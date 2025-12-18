
'use client';

import { useState, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormBuilder, FormField } from '@/components/admin/form-builder';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { createEvent } from '@/app/actions/events';
import { useFormStatus } from 'react-dom';
import { StringListInput } from '@/components/ui/string-list-input';
import { EVENT_THEME_CONFIG } from '@/lib/themes-config';
import { ThemeSelector } from '@/components/admin/theme-selector';
import { Palette } from 'lucide-react';
import { TimelineBuilder } from '@/components/admin/timeline-builder';

import {
    Calendar,
    Type,
    Link as LinkIcon,
    Image as ImageIcon,
    Users,
    AlignLeft,
    Briefcase,
    LayoutGrid,
    Clock
} from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending ? 'Creating...' : 'Create Event'}</Button>
}

const initialState = {
    message: '',
    success: false,
};

export default function CreateEventPage() {
    const [fields, setFields] = useState<FormField[]>([]);
    const [maxTeamSize, setMaxTeamSize] = useState(4);
    const [eventType, setEventType] = useState('team_event'); // Default to Team Event
    const [domains, setDomains] = useState<string[]>([]);
    const [description, setDescription] = useState('');
    const [rules, setRules] = useState('');
    const [timeline, setTimeline] = useState<any[]>([]);
    const [state, formAction] = useActionState(createEvent, initialState);

    // Auto-set maxTeamSize for solo events
    const handleTypeChange = (val: string) => {
        setEventType(val);
        // Treat mentorship as a solo event for team size purposes
        if (val === 'solo_event' || val === 'cp_solo' || val === 'mentorship') {
            setMaxTeamSize(1);
        } else if (maxTeamSize === 1) {
            setMaxTeamSize(4); // Reset to default 4 if switching back from solo
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Create New Event</h1>
                <p className="text-gray-400 mt-2">Configure the details and registration requirements for your upcoming event.</p>
            </div>

            <form action={formAction} className="space-y-8">
                {/* Basic Details Card */}
                <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl">
                    <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <LayoutGrid className="size-5 text-cyan-400" />
                            Event Details
                        </h2>
                    </div>
                    <div className="p-6 grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Event Title</label>
                            <div className="relative">
                                <Type className="absolute left-3 top-2.5 size-4 text-gray-500" />
                                <Input name="title" required placeholder="e.g. Winter of Code 2025" className="pl-10 bg-white/5 border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">URL Slug</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-2.5 size-4 text-gray-500" />
                                <Input name="slug" required placeholder="e.g. woc-2025" className="pl-10 bg-white/5 border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Event Theme</label>
                            <label className="text-sm font-medium text-gray-300">Event Theme</label>
                            <ThemeSelector name="theme" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Event Type</label>
                            <Select name="type" required value={eventType} onValueChange={handleTypeChange}>
                                <SelectTrigger className="bg-white/5 border-white/10 focus:ring-cyan-500/20 transition-all">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="size-4 text-gray-500" />
                                        <SelectValue placeholder="Select type..." />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mentorship">Mentorship (WoC/SoC)</SelectItem>
                                    <SelectItem value="team_event">Team Event (Hackathon)</SelectItem>
                                    <SelectItem value="solo_event">Solo Event</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {eventType !== 'solo_event' && eventType !== 'mentorship' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Max Team Size</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-2.5 size-4 text-gray-500" />
                                    <Input
                                        type="number"
                                        min={1}
                                        max={10}
                                        value={isNaN(maxTeamSize) ? '' : maxTeamSize}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            setMaxTeamSize(isNaN(val) ? 0 : val);
                                        }}
                                        placeholder="4"
                                        className="pl-10 bg-white/5 border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Max members allowed per team</p>
                            </div>
                        )}
                        {(eventType === 'solo_event' || eventType === 'mentorship') && (
                            <input type="hidden" name="maxTeamSize" value="1" />
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Start Date & Time</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 size-4 text-gray-500" />
                                <Input type="datetime-local" name="startDate" className="pl-10 bg-white/5 border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all text-gray-300" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">End Date & Time</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 size-4 text-gray-500" />
                                <Input type="datetime-local" name="endDate" className="pl-10 bg-white/5 border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all text-gray-300" />
                            </div>
                        </div>

                        <div className="col-span-full border-t border-white/10 my-2"></div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 text-green-400">Registration Opens</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 size-4 text-green-500/70" />
                                <Input type="datetime-local" name="registrationStartDate" className="pl-10 bg-white/5 border-white/10 focus:border-green-500/50 focus:ring-green-500/20 transition-all text-gray-300" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 text-red-400">Registration Closes</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 size-4 text-red-500/70" />
                                <Input type="datetime-local" name="registrationEndDate" className="pl-10 bg-white/5 border-white/10 focus:border-red-500/50 focus:ring-red-500/20 transition-all text-gray-300" />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-300">Poster Image URL (Optional)</label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-2.5 size-4 text-gray-500" />
                                <Input type="url" name="posterUrl" placeholder="https://example.com/poster.jpg" className="pl-10 bg-white/5 border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline Config */}
                <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl">
                    <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Clock className="size-5 text-orange-400" />
                            Event Timeline
                        </h2>
                    </div>
                    <div className="p-6">
                        <p className="text-sm text-gray-400 mb-4">Define the key milestones for your event.</p>
                        <TimelineBuilder value={timeline} onChange={setTimeline} />
                        <input type="hidden" name="timeline" value={JSON.stringify(timeline)} />
                    </div>
                </div>

                {/* Rich Text Fields */}
                <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl">
                    <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <AlignLeft className="size-5 text-purple-400" />
                            Event Content
                        </h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <RichTextEditor
                            label="Event Description"
                            placeholder="Describe your event..."
                            value={description}
                            onChange={setDescription}
                        />
                        <input type="hidden" name="description" value={description} />

                        <div className="border-t border-white/10" />

                        <RichTextEditor
                            label="Rules of Conduct"
                            placeholder="List the rules and guidelines..."
                            value={rules}
                            onChange={setRules}
                        />
                        <input type="hidden" name="rules" value={rules} />
                    </div>
                </div>

                {/* Mentorship Specific Config */}
                {eventType === 'mentorship' && (
                    <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl animate-in fade-in slide-in-from-bottom-4">
                        <div className="px-6 py-4 border-b border-cyan-500/20 bg-cyan-500/10">
                            <h2 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                                <Briefcase className="size-5" />
                                Mentorship Domains
                            </h2>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-cyan-200/60 mb-4">Define the tracks or domains available for students to choose from.</p>
                            <StringListInput
                                value={domains}
                                onChange={setDomains}
                                label="Available Domains"
                                placeholder="e.g. Web Development, App Development, AI/ML"
                            />
                            <input type="hidden" name="availableDomains" value={JSON.stringify(domains)} />
                        </div>
                    </div>
                )}

                {/* Registration Form Builder */}
                <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl">
                    <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <AlignLeft className="size-5 text-gray-400" />
                            Registration Custom Fields
                        </h2>
                        <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60">Optional</span>
                    </div>
                    <div className="p-6 space-y-4">
                        <p className="text-sm text-gray-400">Add custom questions for participants to answer during registration.</p>
                        <FormBuilder value={fields} onChange={setFields} />
                        <input type="hidden" name="config" value={JSON.stringify({ registrationFields: fields, maxTeamSize, availableDomains: domains })} />
                    </div>
                </div>

                {state?.message && (
                    <div className={`p-4 rounded-lg border text-sm text-center ${state?.success ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                        {state.message}
                    </div>
                )}

                <div className="flex justify-end gap-4 pb-12">
                    <Button variant="ghost" type="button" onClick={() => window.history.back()}>Cancel</Button>
                    <SubmitButton />
                </div>
            </form>
        </div>
    )
}
