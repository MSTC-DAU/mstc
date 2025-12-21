'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DomainAssigner } from '@/components/admin/domain-assigner';
import { BulkAssignDialog } from '@/components/admin/bulk-assign-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Settings2, ChevronDown, ChevronRight } from 'lucide-react';
import { ExportOptions, exportRegistrationsToExcel } from '@/lib/data-export';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';


interface RegistrationsClientViewProps {
    initialRegistrations: any[];
    event: any;
    availableDomains: string[];
}

export function RegistrationsClientView({ initialRegistrations, event, availableDomains }: RegistrationsClientViewProps) {
    const [registrations, setRegistrations] = useState(initialRegistrations);
    const [selectedDomain, setSelectedDomain] = useState<string>('all');

    // Dynamic Data Extraction
    const allCustomQuestions = Array.from(new Set(
        registrations.flatMap(reg => reg.customAnswers ? Object.keys(reg.customAnswers) : [])
    ));

    const allWeeks = Array.from(new Set(
        registrations.flatMap(reg => reg.checkpoints?.map((cp: any) => cp.weekNumber) || [])
    )).sort((a, b) => (a as number) - (b as number));

    const [exportOpen, setExportOpen] = useState(false);

    // Initial State for Granular Options
    const [exportOptions, setExportOptions] = useState<ExportOptions>({
        participantFields: {
            name: true,
            email: true,
            status: true,
            domain: true,
            date: true,
        },
        teamFields: {
            name: true,
            code: true,
        },
        customQuestions: allCustomQuestions as string[],
        includeDomainPriorities: true,
        checkpointFields: {
            weeks: allWeeks as number[],
            content: true,
            feedback: true,
            approvalStatus: true,
        },
    });

    // Filter Logic
    const filteredRegistrations = selectedDomain === 'all'
        ? registrations
        : registrations.filter(r => r.assignedDomain === selectedDomain);

    const handleExport = () => {
        const fileName = `${event.slug}-registrations-${selectedDomain === 'all' ? 'all' : selectedDomain}-${new Date().toISOString().split('T')[0]}`;
        exportRegistrationsToExcel(filteredRegistrations, fileName, exportOptions);
        setExportOpen(false);
    };

    const toggleCustomQuestion = (question: string, checked: boolean) => {
        setExportOptions(prev => ({
            ...prev,
            customQuestions: checked
                ? [...prev.customQuestions, question]
                : prev.customQuestions.filter(q => q !== question)
        }));
    };

    const toggleWeek = (week: number, checked: boolean) => {
        setExportOptions(prev => ({
            ...prev,
            checkpointFields: {
                ...prev.checkpointFields,
                weeks: checked
                    ? [...prev.checkpointFields.weeks, week]
                    : prev.checkpointFields.weeks.filter(w => w !== week)
            }
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <span className="text-sm font-medium text-gray-400">Filter by Domain:</span>
                    <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                        <SelectTrigger className="w-[200px] bg-black/20 border-white/10">
                            <SelectValue placeholder="All Domains" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Domains</SelectItem>
                            {availableDomains.map(d => (
                                <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2">
                    <BulkAssignDialog
                        event={event}
                        registrations={registrations}
                        availableDomains={availableDomains}
                        onAssign={() => window.location.reload()} // Simple refresh to fetch new data
                    />

                    <Dialog open={exportOpen} onOpenChange={setExportOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full md:w-auto gap-2 bg-green-600 hover:bg-green-700">
                                <Settings2 className="size-4" /> Export Options
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
                            <DialogHeader>
                                <DialogTitle>Export Configuration</DialogTitle>
                            </DialogHeader>

                            <div className="flex-1 overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#0a0a0a] [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
                                <div className="space-y-6 py-4">

                                    {/* 1. Participant Details */}
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-purple-400 text-sm uppercase tracking-wider border-b border-white/10 pb-1">Participant Details</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {Object.keys(exportOptions.participantFields).map((key) => (
                                                <div key={key} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`p-${key}`}
                                                        checked={exportOptions.participantFields[key as keyof typeof exportOptions.participantFields]}
                                                        onCheckedChange={(c) => setExportOptions(prev => ({
                                                            ...prev,
                                                            participantFields: { ...prev.participantFields, [key]: !!c }
                                                        }))}
                                                    />
                                                    <Label htmlFor={`p-${key}`} className="capitalize cursor-pointer">{key}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 2. Team Details */}
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-purple-400 text-sm uppercase tracking-wider border-b border-white/10 pb-1">Team Details</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="t-name"
                                                    checked={exportOptions.teamFields.name}
                                                    onCheckedChange={(c) => setExportOptions(prev => ({ ...prev, teamFields: { ...prev.teamFields, name: !!c } }))}
                                                />
                                                <Label htmlFor="t-name">Team Name</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="t-code"
                                                    checked={exportOptions.teamFields.code}
                                                    onCheckedChange={(c) => setExportOptions(prev => ({ ...prev, teamFields: { ...prev.teamFields, code: !!c } }))}
                                                />
                                                <Label htmlFor="t-code">Join Code</Label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. Custom Questions */}
                                    {(allCustomQuestions as string[]).length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-purple-400 text-sm uppercase tracking-wider border-b border-white/10 pb-1">Custom Questions</h4>
                                            <div className="space-y-2">
                                                {(allCustomQuestions as string[]).map((q, idx) => (
                                                    <div key={idx} className="flex items-start space-x-2">
                                                        <Checkbox
                                                            id={`q-${idx}`}
                                                            className="mt-1"
                                                            checked={exportOptions.customQuestions.includes(q)}
                                                            onCheckedChange={(c) => toggleCustomQuestion(q, !!c)}
                                                        />
                                                        <Label htmlFor={`q-${idx}`} className="text-sm leading-tight text-gray-300 cursor-pointer">{q}</Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 4. Weekly Submissions (Granular) */}
                                    {(allWeeks as number[]).length > 0 && (
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-purple-400 text-sm uppercase tracking-wider border-b border-white/10 pb-1">Submissions & Feedback</h4>

                                            {/* Column Selectors */}
                                            <div className="space-y-2">
                                                <Label className="text-xs text-gray-500">Include Columns:</Label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id="sub-content"
                                                            checked={exportOptions.checkpointFields.content}
                                                            onCheckedChange={(c) => setExportOptions(prev => ({
                                                                ...prev, checkpointFields: { ...prev.checkpointFields, content: !!c }
                                                            }))}
                                                        />
                                                        <Label htmlFor="sub-content">Content</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id="sub-feedback"
                                                            checked={exportOptions.checkpointFields.feedback}
                                                            onCheckedChange={(c) => setExportOptions(prev => ({
                                                                ...prev, checkpointFields: { ...prev.checkpointFields, feedback: !!c }
                                                            }))}
                                                        />
                                                        <Label htmlFor="sub-feedback">Feedback</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id="sub-status"
                                                            checked={exportOptions.checkpointFields.approvalStatus}
                                                            onCheckedChange={(c) => setExportOptions(prev => ({
                                                                ...prev, checkpointFields: { ...prev.checkpointFields, approvalStatus: !!c }
                                                            }))}
                                                        />
                                                        <Label htmlFor="sub-status">Status</Label>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Week Selectors */}
                                            <div className="space-y-2">
                                                <Label className="text-xs text-gray-500">Include Weeks:</Label>
                                                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                                                    {(allWeeks as number[]).map(week => (
                                                        <div key={week} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`week-${week}`}
                                                                checked={exportOptions.checkpointFields.weeks.includes(week)}
                                                                onCheckedChange={(c) => toggleWeek(week, !!c)}
                                                            />
                                                            <Label htmlFor={`week-${week}`}>W{week}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
                                        <Checkbox
                                            id="dp"
                                            checked={exportOptions.includeDomainPriorities}
                                            onCheckedChange={(c) => setExportOptions(prev => ({ ...prev, includeDomainPriorities: !!c }))}
                                        />
                                        <Label htmlFor="dp">Include Domain Priorities</Label>
                                    </div>

                                </div>
                            </div>

                            <DialogFooter className="border-t border-white/10 pt-4 mt-auto">
                                <Button variant="ghost" onClick={() => setExportOpen(false)}>Cancel</Button>
                                <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 gap-2">
                                    <Download className="size-4" /> Download Excel
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-6">
                {filteredRegistrations.map((reg) => (
                    <Card key={reg.id} className="bg-white/5 border-white/10">
                        <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start">
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-white">{reg.user.name}</h3>
                                <p className="text-sm text-gray-400">{reg.user.email}</p>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="outline" className="capitalize">{reg.status}</Badge>
                                    {reg.team && (
                                        <Badge className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
                                            Team: {reg.team.name}
                                        </Badge>
                                    )}
                                    {reg.assignedDomain && (
                                        <Badge className="bg-cyan-500/20 text-cyan-300">
                                            {reg.assignedDomain}
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Domain Management Section (Only for Mentorship) */}
                            {event.type === 'mentorship' && (
                                <div className="w-full md:w-64 border-l border-white/10 pl-6">
                                    <DomainAssigner
                                        registrationId={reg.id}
                                        currentDomain={reg.assignedDomain}
                                        availableDomains={availableDomains}
                                        priorities={reg.domainPriorities as string[]}
                                    />
                                </div>
                            )}

                            {/* Additional Answers Preview */}
                            {reg.customAnswers && Object.keys(reg.customAnswers as object).length > 0 && (
                                <div className="w-full md:w-64 border-l border-white/10 pl-6 text-sm text-gray-400">
                                    <div className="font-semibold text-gray-500 mb-1">Details</div>
                                    <pre className="whitespace-pre-wrap font-sans text-xs opacity-70">
                                        {JSON.stringify(reg.customAnswers, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {filteredRegistrations.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No registrations found for the selected filter.
                    </div>
                )}
            </div>
        </div>
    );
}
