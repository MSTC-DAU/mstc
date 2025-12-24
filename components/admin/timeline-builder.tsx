'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Clock } from 'lucide-react';

interface TimelineItem {
    title: string;
    description: string;
    startDate: string;
    endDate?: string;
}

interface TimelineBuilderProps {
    value?: TimelineItem[];
    onChange: (items: TimelineItem[]) => void;
}

export function TimelineBuilder({ value = [], onChange }: TimelineBuilderProps) {
    const [mounted, setMounted] = useState(false);
    const [newItem, setNewItem] = useState<TimelineItem>({
        title: '',
        description: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    const addItem = () => {
        if (!newItem.title || !newItem.startDate) return;
        onChange([...value, newItem]);
        setNewItem({ title: '', description: '', startDate: '', endDate: '' });
    };

    const removeItem = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <div className="space-y-4 p-4 border border-white/10 rounded-lg bg-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                            placeholder="e.g. Opening Ceremony"
                            value={newItem.title}
                            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                            className="bg-black/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                            placeholder="Short description..."
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            className="bg-black/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Start</Label>
                        <Input
                            type="datetime-local"
                            value={newItem.startDate}
                            onChange={(e) => setNewItem({ ...newItem, startDate: e.target.value })}
                            className="bg-black/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>End</Label>
                        <Input
                            type="datetime-local"
                            value={newItem.endDate}
                            onChange={(e) => setNewItem({ ...newItem, endDate: e.target.value })}
                            className="bg-black/20"
                        />
                    </div>
                </div>
                <Button type="button" onClick={addItem} className="w-full gap-2 border-dashed border-2 bg-transparent hover:bg-white/5">
                    <Plus className="size-4" /> Add Timeline Item
                </Button>
            </div>

            {value.length > 0 && (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin-black">
                    {value.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border border-white/10 rounded bg-black/20">
                            <div className="space-y-1">
                                <div className="font-bold text-sm">{item.title}</div>
                                <div className="text-xs text-gray-500 flex gap-2">
                                    <Clock className="size-3" />
                                    {mounted ? (
                                        <>
                                            {new Date(item.startDate).toLocaleString()}
                                            {item.endDate && ` - ${new Date(item.endDate).toLocaleString()}`}
                                        </>
                                    ) : (
                                        <span>Loading time...</span>
                                    )}
                                </div>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-300">
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
