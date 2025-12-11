
'use client';

import { useState } from 'react';
import { Menu, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-[#0f0f0f] text-white font-sans">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 border-r border-white/10 flex-col fixed h-full bg-[#141414]">
                <DashboardSidebar />
            </aside>

            {/* Mobile Header & Content */}
            <div className="flex-1 flex flex-col md:ml-64">
                {/* Mobile Header */}
                <header className="h-16 border-b border-white/10 flex items-center px-4 md:hidden bg-[#141414] sticky top-0 z-40">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="mr-4 text-gray-400">
                                <Menu className="size-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 bg-[#141414] border-r border-white/10 w-72">
                            <DashboardSidebar onNavigate={() => setOpen(false)} />
                        </SheetContent>
                    </Sheet>

                    <div className="flex items-center gap-2">
                        <Terminal className="text-cyan-400 size-5" />
                        <span className="font-bold text-lg tracking-tight">MSTC Student</span>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
