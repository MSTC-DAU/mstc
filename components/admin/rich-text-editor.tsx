'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Code,
    Quote,
    Undo,
    Redo,
    Palette,
    Eye,
    Link as LinkIcon,
    Unlink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const ToolbarButton = ({
    onClick,
    isActive,
    disabled,
    children,
    title
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
}) => (
    <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={cn(
            "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10",
            isActive && "text-cyan-400 bg-cyan-950/30 hover:bg-cyan-950/50"
        )}
    >
        {children}
    </Button>
);

interface RichTextEditorProps {
    value?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
    label?: string;
}

export function RichTextEditor({ value, onChange, placeholder, label }: RichTextEditorProps) {
    const [previewMode, setPreviewMode] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
                HTMLAttributes: {
                    class: 'text-cyan-400 hover:underline cursor-pointer',
                },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[150px] p-4 text-gray-300 text-sm'
            }
        },
        immediatelyRender: false // Fix hydration mismatch
    });

    if (!editor) {
        return null;
    }

    if (previewMode) {
        return (
            <div className="space-y-2">
                {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
                    <div className="flex items-center justify-between p-2 border-b border-white/10 bg-black/20">
                        <span className="text-xs text-gray-500 font-medium px-2">Preview</span>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setPreviewMode(false)}
                            className="h-7 text-xs gap-1.5 text-cyan-400 hover:text-cyan-300"
                        >
                            <Eye className="size-3.5" />
                            Edit
                        </Button>
                    </div>
                    <div
                        className="prose prose-invert max-w-none p-4 text-sm"
                        dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {label && <div className="flex justify-between items-end">
                <label className="text-sm font-medium text-gray-300">{label}</label>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewMode(true)}
                    className="h-6 text-xs gap-1.5 text-gray-500 hover:text-cyan-400 p-0 hover:bg-transparent"
                >
                    <Eye className="size-3.5" />
                    Preview
                </Button>
            </div>}

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-black/20">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Bold"
                    >
                        <Bold className="size-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Italic"
                    >
                        <Italic className="size-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        title="Underline"
                    >
                        <UnderlineIcon className="size-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        title="Strikethrough"
                    >
                        <Strikethrough className="size-4" />
                    </ToolbarButton>

                    <div className="w-px h-4 bg-white/10 mx-1" />

                    <ToolbarButton
                        onClick={() => {
                            const previousUrl = editor.getAttributes('link').href
                            const url = window.prompt('URL', previousUrl)

                            if (url === null) {
                                return
                            }

                            // empty
                            if (url === '') {
                                editor.chain().focus().extendMarkRange('link').unsetLink().run()
                                return
                            }

                            // update
                            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
                        }}
                        isActive={editor.isActive('link')}
                        title="Link"
                    >
                        <LinkIcon className="size-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        disabled={!editor.isActive('link')}
                        title="Unlink"
                    >
                        <Unlink className="size-4" />
                    </ToolbarButton>

                    <div className="w-px h-4 bg-white/10 mx-1" />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        title="Heading 1"
                    >
                        <Heading1 className="size-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        title="Heading 2"
                    >
                        <Heading2 className="size-4" />
                    </ToolbarButton>

                    <div className="w-px h-4 bg-white/10 mx-1" />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Bullet List"
                    >
                        <List className="size-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Ordered List"
                    >
                        <ListOrdered className="size-4" />
                    </ToolbarButton>

                    <div className="w-px h-4 bg-white/10 mx-1" />

                    <div className="relative group">
                        <ToolbarButton
                            onClick={() => { }}
                            isActive={editor.isActive('textStyle', { color: '#06b6d4' })} // cyan-500
                            title="Text Color"
                        >
                            <Palette className="size-4" />
                        </ToolbarButton>
                        <div className="absolute top-full left-0 p-1 bg-gray-900 border border-white/10 rounded-lg shadow-xl hidden group-hover:flex gap-1 z-50">
                            {[
                                '#ffffff', // white
                                '#9ca3af', // gray-400
                                '#06b6d4', // cyan-500
                                '#a855f7', // purple-500
                                '#22c55e', // green-500
                                '#ef4444', // red-500
                                '#eab308', // yellow-500
                            ].map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => editor.chain().focus().setColor(color).run()}
                                    className={cn(
                                        "w-6 h-6 rounded-md border border-white/10 hover:scale-110 transition-transform",
                                        editor.isActive('textStyle', { color }) && "ring-2 ring-white"
                                    )}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex-1" />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().chain().focus().undo().run()}
                        title="Undo"
                    >
                        <Undo className="size-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().chain().focus().redo().run()}
                        title="Redo"
                    >
                        <Redo className="size-4" />
                    </ToolbarButton>
                </div>

                <EditorContent editor={editor} />
            </div>
            <p className="text-xs text-gray-500">
                You can use markdown shortcuts (e.g. # title, - list, **bold**)
            </p>
        </div>
    );
}
