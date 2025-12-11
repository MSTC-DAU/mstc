
'use client';
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { registerForEvent } from '@/app/actions/registrations';
import { useActionState, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function PrioritySelects({ domains }: { domains: string[] }) {
    const [selections, setSelections] = useState<{ [key: number]: string }>({});

    const handleChange = (rank: number, value: string) => {
        setSelections(prev => ({
            ...prev,
            [rank]: value
        }));
    };

    const getAvailableDomains = (currentRank: number) => {
        const selectedOthers = Object.entries(selections)
            .filter(([r]) => parseInt(r) !== currentRank)
            .map(([, v]) => v);
        return domains.filter(d => !selectedOthers.includes(d));
    };

    return (
        <div className="space-y-4">
            {[1, 2, 3].map((rank) => (
                <div key={rank} className="space-y-2">
                    <Label className="text-xs font-medium uppercase tracking-wider text-gray-500">Priority {rank}</Label>
                    <input type="hidden" name={`priority_${rank}`} value={selections[rank] || ''} />
                    <Select
                        value={selections[rank] || ''}
                        onValueChange={(val) => handleChange(rank, val)}
                        required={rank === 1}
                    >
                        <SelectTrigger className="bg-black/40 border-white/10 text-white focus:ring-cyan-500/20">
                            <SelectValue placeholder="Select Domain..." />
                        </SelectTrigger>
                        <SelectContent className="bg-black/80 backdrop-blur-xl border-white/10 text-white">
                            {getAvailableDomains(rank).map((domain) => (
                                <SelectItem key={domain} value={domain} className="focus:bg-cyan-500/20 focus:text-cyan-400">
                                    {domain}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            ))}
        </div>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">{pending ? 'Registering...' : 'Complete Registration'}</Button>
}

// Recursive or mapped component to render form fields based on JSON
export default function DynamicRegistrationForm({ config, eventId }: { config: any, eventId: string }) {
    const [state, formAction] = useActionState(registerForEvent, { message: '', success: false });
    // We can still use react-hook-form for validation if we want, but for dynamic formData submission
    // sticking to native form action is easier with server actions unless we need complex client validation.
    // For simplicity with dynamic fields, let's use native inputs with names corresponding to fields.

    const [teamMode, setTeamMode] = useState<'create' | 'join' | 'solo'>(config?.maxTeamSize === 1 ? 'solo' : 'create');

    if (!config?.registrationFields) return <div>No registration fields configured.</div>;

    if (state.success) {
        return (
            <div className="p-6 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-center backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-2">Registration Successful!</h3>
                <p className="opacity-80">{state.message}</p>
                {teamMode === 'create' && <p className="text-sm mt-2 text-cyan-400">Share your Team Code with others!</p>}
            </div>
        )
    }

    return (
        <form action={formAction} className="space-y-8">
            <input type="hidden" name="eventId" value={eventId} />
            <input type="hidden" name="teamMode" value={teamMode} />

            {/* Team Section - Hide if Solo */}
            {config.maxTeamSize > 1 ? (
                <div className="space-y-4 p-5 bg-white/5 border border-white/10 rounded-xl">
                    <h3 className="text-lg font-semibold text-white">Team Formation</h3>

                    <div className="flex gap-2 p-1 bg-black/40 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setTeamMode('create')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${teamMode === 'create' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Create New Team
                        </button>
                        <button
                            type="button"
                            onClick={() => setTeamMode('join')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${teamMode === 'join' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Join Existing Team
                        </button>
                    </div>

                    {teamMode === 'create' ? (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <Label>Team Name</Label>
                            <Input name="teamName" placeholder="e.g. The Algo Wizards" className="bg-black/20" required={teamMode === 'create'} />
                            <p className="text-xs text-gray-400">You will get a unique join code to share with your teammates.</p>
                        </div>
                    ) : (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <Label>Join Code</Label>
                            <Input name="joinCode" placeholder="Enter 6-character code" className="bg-black/20 font-mono uppercase" maxLength={6} required={teamMode === 'join'} />
                            <p className="text-xs text-gray-400">Ask your team leader for the code.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-4 bg-cyan-500/5 text-cyan-400 border border-cyan-500/20 rounded-xl text-center text-sm">
                    Individual Registration
                </div>
            )}

            {/* Domain Preferences (WoC) */}
            {config.availableDomains && config.availableDomains.length > 0 && (
                <div className="space-y-4 p-5 bg-cyan-900/10 border border-cyan-500/20 rounded-xl">
                    <h3 className="text-lg font-semibold text-cyan-400">Domain Preferences</h3>
                    <p className="text-sm text-gray-400">Select your top 3 choices. Admins will assign you one based on your profile.</p>

                    <PrioritySelects domains={config.availableDomains} />
                </div>
            )}

            {/* Dynamic Fields Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-t border-white/10 pt-4">Participant Details</h3>
                {config.registrationFields.map((field: any) => (
                    <div key={field.name} className="space-y-2">
                        <Label className="text-gray-300">{field.label}</Label>

                        {field.type === 'text' && (
                            <Input name={field.name} required={field.required} placeholder={`Enter ${field.label}`} className="bg-black/20" />
                        )}

                        {field.type === 'url' && (
                            <Input type="url" name={field.name} required={field.required} placeholder="https://..." className="bg-black/20" />
                        )}

                        {/* Priority Ranker Placeholder - Simple Textarea for now */}
                        {field.type === 'priority_ranker' && (
                            <textarea
                                name={field.name}
                                className="w-full p-3 bg-black/20 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                                placeholder={`List your preferences for: ${field.options?.join(', ')}`}
                            />
                        )}
                    </div>
                ))}
            </div>

            {state?.message && !state.success && (
                <div className="text-red-400 text-sm">{state.message}</div>
            )}

            <SubmitButton />
        </form>
    );
}
