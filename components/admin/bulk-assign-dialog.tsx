'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { bulkAssignDomain } from '@/app/actions/registrations';

interface BulkAssignDialogProps {
    event: any;
    registrations: any[];
    availableDomains: string[];
    onAssign: () => void;
}

export function BulkAssignDialog({ event, registrations, availableDomains, onAssign }: BulkAssignDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState<string>('');
    const [parsedUsers, setParsedUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);

            // Process data
            const results = data.map((row: any) => {
                const email = (row.email || row.Email || '').trim().toLowerCase();
                const match = registrations.find(r => r.user.email.toLowerCase() === email);
                return {
                    email,
                    found: !!match,
                    currentDomain: match?.assignedDomain,
                    registrationId: match?.id,
                    name: match?.user.name
                };
            }).filter(r => r.email); // Remove empty rows

            setParsedUsers(results);
        };
        reader.readAsBinaryString(file);
    };

    const handleBulkAssign = async () => {
        if (!selectedDomain) return toast.error('Please select a domain');
        const validIds = parsedUsers.filter(u => u.found).map(u => u.registrationId);

        if (validIds.length === 0) return toast.error('No valid users to assign');

        setLoading(true);
        try {
            const res = await bulkAssignDomain(event.id, selectedDomain, validIds);
            if (res.success) {
                toast.success(res.message);
                setOpen(false);
                setParsedUsers([]);
                setSelectedDomain('');
                onAssign(); // Trigger refresh
            } else {
                toast.error(res.message);
            }
        } catch (e) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const foundCount = parsedUsers.filter(u => u.found).length;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
                    <FileSpreadsheet className="size-4" /> Bulk Assign
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1a1a] border-white/10 text-white sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Bulk Assign Domains</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Target Domain</label>
                            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                                <SelectTrigger className="bg-black/20 border-white/10">
                                    <SelectValue placeholder="Select Domain" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableDomains.map(d => (
                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Upload CSV (Column: 'email')</label>
                            <div className="relative">
                                <Button variant="outline" className="w-full border-dashed border-white/20 hover:bg-white/5 relative z-10">
                                    <Upload className="size-4 mr-2" /> Choose File
                                </Button>
                                <input
                                    type="file"
                                    accept=".csv,.xlsx"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                    onChange={handleFileUpload}
                                />
                            </div>
                        </div>
                    </div>

                    {parsedUsers.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Preview ({parsedUsers.length} rows)</span>
                                <Badge variant={foundCount > 0 ? 'default' : 'destructive'}>
                                    {foundCount} Matches found
                                </Badge>
                            </div>
                            <ScrollArea className="h-[300px] border border-white/10 rounded-md bg-black/20 p-2">
                                <div className="space-y-1">
                                    {parsedUsers.map((u, i) => (
                                        <div key={i} className={`flex items-center justify-between p-2 rounded text-sm ${u.found ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                            <div className="flex items-center gap-3">
                                                {u.found ? <CheckCircle className="size-4 text-green-500" /> : <XCircle className="size-4 text-red-500" />}
                                                <div>
                                                    <div className="font-medium">{u.email}</div>
                                                    {u.found && <div className="text-xs text-gray-400">{u.name} • Current: {u.currentDomain || 'None'}</div>}
                                                </div>
                                            </div>
                                            {u.found ? (
                                                <Badge variant="outline" className="bg-green-500/20 text-green-300 border-0">Ready</Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-red-500/20 text-red-300 border-0">Not Found</Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleBulkAssign}
                        disabled={loading || foundCount === 0 || !selectedDomain}
                        className="bg-purple-600 hover:bg-purple-700 gap-2"
                    >
                        {loading && <Loader2 className="size-4 animate-spin" />}
                        Assign {selectedDomain ? `to ${selectedDomain}` : ''}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
