'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { saveLegacyNote, deleteLegacyNote } from '@/app/actions/legacy-actions';
import { toast } from 'sonner';
import { Loader2, Trash2, Save, Plus, ArrowUpDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface LegacyNote {
    id: string;
    userId: string;
    content: string;
    role: string;
    tenure: string;
    createdAt: string | Date | null;
    user: {
        name: string | null;
        image: string | null;
    };
}

interface LegacyBoardProps {
    notes: LegacyNote[];
    tenureOptions: string[]; // [Current, Previous]
    currentUserId?: string;
}

export function LegacyBoard({ notes, tenureOptions, currentUserId }: LegacyBoardProps) {
    // 1. Group notes by Tenure
    const notesByTenure = notes.reduce((acc, note) => {
        if (!acc[note.tenure]) acc[note.tenure] = [];
        acc[note.tenure].push(note);
        return acc;
    }, {} as Record<string, LegacyNote[]>);

    const availableTenures = Array.from(new Set([...tenureOptions, ...Object.keys(notesByTenure)])).sort().reverse();

    // View State
    const [selectedTenure, setSelectedTenure] = useState(tenureOptions[0]);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    // Add/Edit Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [writingTenure, setWritingTenure] = useState(tenureOptions[0]);
    const [noteContent, setNoteContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Check if user has a note in the selected writing tenure
    const userNote = notes.find(n => n.userId === currentUserId && n.tenure === writingTenure);

    // Populate form when dialog opens or tenure changes
    useEffect(() => {
        if (isDialogOpen) {
            if (userNote) {
                setNoteContent(userNote.content);
            } else {
                setNoteContent('');
            }
        }
    }, [isDialogOpen, userNote, writingTenure]);

    const handleSave = async () => {
        if (!noteContent.trim()) return;

        setIsSubmitting(true);
        const res = await saveLegacyNote(noteContent, writingTenure);
        setIsSubmitting(false);

        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success(userNote ? 'Note updated' : 'Note added');
            if (!userNote) setIsDialogOpen(false); // Close on create, keep open on update for convenience
        }
    };

    const handleDelete = async () => {
        if (!userNote) return;
        if (!confirm("Are you sure you want to delete this note?")) return;

        setIsSubmitting(true);
        const res = await deleteLegacyNote(userNote.id);
        setIsSubmitting(false);

        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success('Note deleted');
            setNoteContent('');
            setIsDialogOpen(false);
        }
    };

    // Sorting Logic
    const displayedNotes = notesByTenure[selectedTenure]?.sort((a, b) => {
        const dateA = new Date(a.createdAt ?? 0).getTime();
        const dateB = new Date(b.createdAt ?? 0).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    }) || [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Legacy Board</h2>
                    <p className="text-gray-400">Wisdom passed down through tenures.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Actions Header: Sort + Add */}
                    <div className="flex items-center gap-2">
                        <Select value={sortOrder} onValueChange={(v: any) => setSortOrder(v)}>
                            <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                                <ArrowUpDown className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Sort" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                            </SelectContent>
                        </Select>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                                    <Plus className="h-4 w-4" /> Contribute
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#1a1a1a] border-white/10 text-white sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>
                                        {userNote ? 'Edit Your Legacy Note' : 'Add Legacy Note'}
                                    </DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                        Share your experience. One note per tenure.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6 py-4">
                                    {/* Tenure Selection */}
                                    <div className="space-y-3">
                                        <Label className="text-xs text-purple-300 uppercase font-semibold tracking-wider">Select Tenure</Label>
                                        <RadioGroup
                                            value={writingTenure}
                                            onValueChange={setWritingTenure}
                                            className="flex flex-row gap-4"
                                        >
                                            {tenureOptions.map(option => (
                                                <div key={option} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={option} id={`r-${option}`} className="border-purple-400 text-purple-400" />
                                                    <Label htmlFor={`r-${option}`} className="text-sm text-gray-300 cursor-pointer">{option}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-gray-400 uppercase font-semibold">Content</Label>
                                        <Textarea
                                            placeholder="What should future teams know?..."
                                            className="min-h-[200px] bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-purple-500 resize-none"
                                            value={noteContent}
                                            onChange={(e) => setNoteContent(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <DialogFooter className="gap-2 sm:gap-0">
                                    {userNote && (
                                        <Button
                                            variant="destructive"
                                            className="mr-auto"
                                            onClick={handleDelete}
                                            disabled={isSubmitting}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                                        </Button>
                                    )}
                                    <Button
                                        className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                                        onClick={handleSave}
                                        disabled={isSubmitting || !noteContent.trim()}
                                    >
                                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        {userNote ? 'Update Note' : 'Submit Note'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* Tenure Tabs */}
            <div className="bg-white/5 p-1 rounded-lg border border-white/10 overflow-x-auto">
                <div className="flex gap-1">
                    {availableTenures.map(tenure => (
                        <button
                            key={tenure}
                            onClick={() => setSelectedTenure(tenure)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${selectedTenure === tenure
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tenure}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notes Grid - Full Width */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedNotes.length > 0 ? (
                    displayedNotes.map(note => (
                        <Card key={note.id} className="bg-white/5 border-white/10 hover:border-purple-500/30 transition-colors h-full flex flex-col">
                            <CardHeader className="flex flex-row items-start gap-4 pb-2">
                                <Avatar className="h-10 w-10 border border-white/10">
                                    <AvatarImage src={note.user.image || ''} />
                                    <AvatarFallback>{note.user.name?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <CardTitle className="text-base font-semibold text-white truncate">
                                            {note.user.name}
                                        </CardTitle>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                            {new Date(note.createdAt ?? 0).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 text-xs mt-1">
                                        <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-gray-300 capitalize">
                                            {note.role.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
                                    {note.content}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-white/5 rounded-xl border border-dashed border-white/10 text-gray-500">
                        No notes found for {selectedTenure}.
                    </div>
                )}
            </div>
        </div>
    );
}
