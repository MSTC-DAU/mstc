'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, LayoutDashboard, Users, Settings, Trophy, LogOut, ShieldAlert, ArrowLeft, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShatterBackground } from '@/components/ui/shatter-background';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { ReactNode } from 'react';

const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Team', href: '/admin/team', icon: GraduationCap },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Legacy', href: '/admin/legacy', icon: Trophy },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminLayoutClient({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen text-[#E8EAED] font-sans relative bg-[#202124]">
            {/* Animated Background */}
            <ShatterBackground />

            {/* Sidebar */}
            <aside className="w-[300px] border-r-4 border-black flex flex-col fixed h-full bg-[#202124] z-40">
                <div className="h-20 flex items-center justify-center border-b-4 border-black p-4 bg-shatter-yellow bg-opacity-10">
                    <div className="flex items-center gap-3">
                        <div className="relative size-14">
                            <Image
                                src="/mstc_logo.png"
                                alt="MSTC Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase italic text-[#E8EAED]">
                            MSTC <span className="text-shatter-yellow">ADMIN</span>
                        </h1>
                    </div>
                </div>

                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link key={item.href} href={item.href} className="block group">
                                <div className={cn(
                                    "relative p-3 flex items-center gap-3 transition-all duration-200 border-2",
                                    isActive
                                        ? "bg-[#303134] text-shatter-yellow shatter-shadow-sm border-black"
                                        : "border-transparent hover:bg-shatter-pink hover:text-white hover:border-black hover:shatter-shadow-sm text-[#E8EAED]"
                                )}>
                                    <Icon className={cn("size-5", isActive ? "text-shatter-yellow" : "group-hover:text-white")} />
                                    <span className="font-black uppercase tracking-widest text-base bg-transparent">{item.name}</span>

                                    {isActive && (
                                        <ArrowRight className="ml-auto size-5 text-shatter-yellow animate-pulse" />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-6 border-t-4 border-black bg-[#202124]">
                    <div className="mb-4 flex items-center gap-3 p-3 bg-[#303134] border-2 border-black">
                        <ShieldAlert className="size-6 text-shatter-pink" />
                        <div>
                            <p className="text-xs font-black text-[#E8EAED] uppercase">SYSTEM LEVEL</p>
                            <p className="text-[10px] text-[#9AA0A6] font-mono">ROOT_ACCESS_GRANTED</p>
                        </div>
                    </div>

                    <Link href="/dashboard" className="mb-2 w-full h-12 bg-black hover:bg-shatter-yellow hover:text-black text-[#E8EAED] border-2 border-white/20 hover:border-black font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                        <ArrowLeft className="size-4" /> Back to Dash
                    </Link>

                    <button
                        onClick={() => signOut()}
                        className="w-full h-12 bg-black hover:bg-shatter-pink hover:text-white text-[#E8EAED] border-2 border-white/20 hover:border-black font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    >
                        <LogOut className="size-4" /> Exit Console
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="relative z-10 ml-[300px] p-8 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

// Helper component for icon
function ArrowRight({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
