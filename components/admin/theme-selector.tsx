'use client';

import { EVENT_THEME_CONFIG, EventThemeKey } from "@/lib/themes-config";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ThemeSelectorProps {
    value?: string;
    onChange?: (value: string) => void;
    name?: string;
}

export function ThemeSelector({ value, onChange, name }: ThemeSelectorProps) {
    const currentTheme = value || 'default';

    const handleSelect = (themeKey: string) => {
        if (onChange) {
            onChange(themeKey);
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Hidden input for form submission if name is provided */}
            {name && <input type="hidden" name={name} value={currentTheme} />}

            {Object.entries(EVENT_THEME_CONFIG).map(([key, theme]) => {
                const isSelected = currentTheme === key;

                // Extract colors for preview
                // We'll try to parse the tailwind classes or use a map if needed.
                // For now, let's map the keys to hardcoded hexes for the preview circles
                // or just use the background classes if possible.
                // Actually, let's use the theme config colors directly as classes.

                return (
                    <div
                        key={key}
                        onClick={() => handleSelect(key)}
                        className={cn(
                            "relative group cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-300",
                            "hover:scale-[1.02] active:scale-[0.98]",
                            isSelected
                                ? "border-cyan-400 bg-white/10 shadow-[0_0_20px_-5px_rgba(34,211,238,0.3)]"
                                : "border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/5"
                        )}
                    >
                        {/* Preview Area */}
                        <div className={cn("h-24 w-full relative overflow-hidden", theme.background)}>
                            {/* Decorative Elements based on Theme */}
                            <div className={cn("absolute inset-0 opacity-30 bg-gradient-to-br from-transparent to-black/80")} />

                            {/* Color Swatches */}
                            <div className="absolute bottom-3 left-3 flex -space-x-2">
                                <div className={cn("size-6 rounded-full border-2 border-black z-10", theme.background)} />
                                <div className={cn("size-6 rounded-full border-2 border-black z-20 flex items-center justify-center", theme.card.split(' ')[0])}>
                                    {/* Try to use the first class of card for bg */}
                                </div>
                                <div className={cn("size-6 rounded-full border-2 border-black z-30 flex items-center justify-center bg-white/10 backdrop-blur-sm")}>
                                    <div className={cn("size-2 rounded-full", theme.icon.split(' ')[0].replace('text-', 'bg-'))} />
                                </div>
                            </div>

                            {/* Selection Checkmark */}
                            {isSelected && (
                                <div className="absolute top-2 right-2 size-6 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                                    <Check className="size-3 text-black font-bold" />
                                </div>
                            )}
                        </div>

                        {/* Label Area */}
                        <div className="p-3">
                            <h3 className={cn(
                                "text-sm font-bold uppercase tracking-wider truncate",
                                isSelected ? "text-cyan-400" : "text-gray-400 group-hover:text-gray-200"
                            )}>
                                {theme.name}
                            </h3>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
