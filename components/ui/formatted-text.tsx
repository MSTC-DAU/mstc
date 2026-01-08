import Link from 'next/link';
import { cn } from '@/lib/utils';

interface FormattedTextProps {
    text: string;
    className?: string;
}

export function FormattedText({ text, className }: FormattedTextProps) {
    if (!text) return null;

    // Split by newlines first
    const lines = text.split('\n');

    return (
        <div className={cn("text-sm text-gray-300 leading-relaxed space-y-1", className)}>
            {lines.map((line, i) => (
                <div key={i} className="min-h-[1.2em]">
                    <FormattedLine line={line} />
                </div>
            ))}
        </div>
    );
}

function FormattedLine({ line }: { line: string }) {
    if (!line) return null;

    // Regex to detect URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = line.split(urlRegex);

    return (
        <span>
            {parts.map((part, i) => {
                if (part.match(urlRegex)) {
                    return (
                        <a
                            key={i}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 hover:underline break-all"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {part}
                        </a>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
}
