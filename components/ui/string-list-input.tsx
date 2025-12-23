'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface StringListInputProps {
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    label?: string;
}

export function StringListInput({ value, onChange, placeholder = 'Add item', label = 'Items' }: StringListInputProps) {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        if (!inputValue.trim()) return;

        // Split by comma and process each item
        const newItems = inputValue
            .split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0 && !value.includes(item));

        if (newItems.length > 0) {
            onChange([...value, ...newItems]);
        }
        setInputValue('');
    };

    const handleRemove = (itemToRemove: string) => {
        onChange(value.filter(item => item !== itemToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium">{label}</label>
            <div className="flex gap-2">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="bg-white/5"
                />
                <Button type="button" onClick={handleAdd} variant="secondary">
                    <Plus className="size-4" />
                </Button>
            </div>
            <div className="flex flex-wrap gap-2">
                {value.map((item) => (
                    <Badge key={item} variant="secondary" className="px-3 py-1 flex items-center gap-2 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                        {item}
                        <button
                            type="button"
                            onClick={() => handleRemove(item)}
                            className="hover:text-white transition-colors"
                        >
                            <X className="size-3" />
                        </button>
                    </Badge>
                ))}
            </div>
        </div>
    );
}
