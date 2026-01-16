
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

export type FormField = {
    name: string;
    label: string;
    type: 'text' | 'number' | 'url' | 'file' | 'priority_ranker' | 'dropdown';
    required: boolean;
    options?: string[]; // comma separated for now
};

export function FormBuilder({ value, onChange }: { value: FormField[], onChange: (val: FormField[]) => void }) {

    const addField = () => {
        onChange([...value, { name: '', label: '', type: 'text', required: true }]);
    };

    const removeField = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const updateField = (index: number, field: Partial<FormField>) => {
        const newFields = [...value];
        newFields[index] = { ...newFields[index], ...field };
        onChange(newFields);
    };

    return (
        <div className="space-y-4">
            {value.map((field, index) => (
                <Card key={index} className="p-4 bg-white/5 border-white/10 flex gap-4 items-start">
                    <div className="grid gap-4 flex-1 md:grid-cols-3">
                        <Input
                            placeholder="Label (e.g. GitHub Link)"
                            value={field.label}
                            onChange={(e) => updateField(index, { label: e.target.value, name: e.target.value.toLowerCase().replace(/\s/g, '_') })}
                        />
                        <Select value={field.type} onValueChange={(v: any) => updateField(index, { type: v })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="text">Text Input</SelectItem>
                                <SelectItem value="url">URL</SelectItem>
                                <SelectItem value="file">File Upload</SelectItem>
                                <SelectItem value="priority_ranker">Priority Ranker (WoC)</SelectItem>
                                <SelectItem value="dropdown">Dropdown Select</SelectItem>
                            </SelectContent>
                        </Select>

                        {(field.type === 'priority_ranker' || field.type === 'dropdown') && (
                            <Input
                                placeholder="Options (comma separated)"
                                value={field.options?.join(',') || ''}
                                onChange={(e) => updateField(index, { options: e.target.value.split(',').map(s => s.trim()) })}
                            />
                        )}
                    </div>

                    <Button variant="ghost" size="icon" onClick={() => removeField(index)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="size-4" />
                    </Button>
                </Card>
            ))}

            <Button type="button" variant="outline" onClick={addField} className="w-full border-dashed border-white/20">
                <Plus className="mr-2 size-4" /> Add Registration Field
            </Button>
        </div>
    );
}
