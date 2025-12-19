'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    Home,
    Calendar,
    Trophy,
    Users,
    LogOut,
    Map,
    ShieldAlert,
    Menu,
    X,
    ChevronRight,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const menuItems = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Events', href: '/dashboard/events', icon: Calendar },
    { name: 'Roadmap', href: '/dashboard/roadmaps', icon: Map },
    { name: 'Leaderboard', href: '/dashboard/leaderboard', icon: Trophy },
    { name: 'Teams', href: '/dashboard/teams', icon: Users },
    { name: 'Admin', href: '/admin', icon: ShieldAlert, adminOnly: true },
];

export function OrigamiSidebar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    const userRole = session?.user?.role;
    const adminRoles = ['convener', 'deputy_convener', 'core_member'];
    const isAdmin = userRole ? adminRoles.includes(userRole) : false;

    return (
        <>
            {/* Desktop Shatter Sidebar */}
            <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-[300px] z-40 bg-[#202124] border-r-4 border-black font-sans">



                {/* Header */}
                <div className="h-20 bg-shatter-yellow flex items-center justify-center border-b-4 border-black p-4">
                    <div className="flex items-center gap-3 transform -rotate-1">
                        <div className="relative size-14">
                            <Image
                                src="/mstc_logo.png"
                                alt="MSTC Logo"
                                fill
                                className="object-contain invert" // Invert for black logo on yellow bg if needed, or check image. Assuming stick with standard for now, maybe add black border if transparent.
                            />
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-black">
                            MSTC <span className="text-white text-stroke-black">DASH</span>
                        </h1>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-3 overflow-y-auto">
                    {menuItems.map((item) => {
                        if (item.adminOnly && !isAdmin) return null;
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link key={item.href} href={item.href} className="block group">
                                <div className={cn(
                                    "relative p-3 flex items-center gap-3 transition-all duration-200 border-2 border-transparent",
                                    isActive
                                        ? "bg-[#303134] text-shatter-yellow shatter-shadow-sm border-black"
                                        : "hover:bg-shatter-pink hover:text-white hover:border-black hover:shatter-shadow-sm text-[#E8EAED]"
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
                </nav>

                {/* Footer */}
                <div className="p-6 border-t-4 border-black bg-[#202124]">
                    <Link href="/dashboard/profile" className="flex items-center gap-3 mb-4 bg-[#303134] p-2 border-2 border-black hover:bg-shatter-yellow transition-colors group cursor-pointer block">
                        <div className="size-10 bg-black text-white flex items-center justify-center font-black border border-black group-hover:bg-white group-hover:text-black transition-colors">
                            {session?.user?.name?.[0] || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-black text-[#E8EAED] uppercase truncate group-hover:text-black">{session?.user?.name || 'OPERATIVE'}</p>
                            <p className="text-xs text-[#9AA0A6] font-mono truncate group-hover:text-black">LEVEL_01</p>
                        </div>
                    </Link>

                    <Link href="/" className="w-full h-12 bg-black hover:bg-shatter-yellow hover:text-black text-white border-2 border-black font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shatter-shadow-sm mb-4">
                        <ArrowLeft className="size-4" /> Back to Website
                    </Link>

                    <button
                        onClick={() => signOut()}
                        className="w-full h-12 bg-[#303134] hover:bg-black hover:text-white text-[#E8EAED] border-2 border-black font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shatter-shadow-sm"
                    >
                        <LogOut className="size-4" /> Sign Out
                    </button>
                </div>
            </aside >

            {/* Mobile Trigger */}
            < div className="md:hidden fixed top-4 right-4 z-50" >
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="size-12 bg-shatter-yellow text-black border-2 border-black shatter-shadow-sm flex items-center justify-center active:translate-y-1 transition-transform"
                >
                    {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
            </div >

            {/* Mobile Menu */}
            {
                mobileOpen && (
                    <div className="fixed inset-0 z-40 bg-[#202124] flex flex-col p-8 space-y-6 animate-in slide-in-from-right font-sans">
                        <h2 className="text-5xl font-black text-[#E8EAED] uppercase italic mb-8 border-b-4 border-shatter-yellow inline-block self-start">
                            MENU
                        </h2>
                        <div className="space-y-4">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-4 text-3xl font-black text-[#E8EAED] uppercase hover:text-shatter-pink transition-colors"
                                >
                                    <item.icon className="size-8" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        <div className="mt-auto space-y-4">
                            <Link href="/dashboard/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 bg-[#303134] p-3 border-2 border-black active:bg-shatter-yellow transition-colors group">
                                <div className="size-12 bg-black text-white flex items-center justify-center font-black border border-black group-active:bg-white group-active:text-black transition-colors text-xl">
                                    {session?.user?.name?.[0] || 'U'}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-lg font-black text-[#E8EAED] uppercase truncate group-active:text-black">{session?.user?.name || 'OPERATIVE'}</p>
                                    <p className="text-sm text-[#9AA0A6] font-mono truncate group-active:text-black">LEVEL_01</p>
                                </div>
                            </Link>

                            <Link href="/" onClick={() => setMobileOpen(false)} className="w-full h-14 bg-[#303134] text-[#E8EAED] font-black uppercase tracking-widest text-lg border-2 border-black active:bg-shatter-blue active:text-white transition-colors flex items-center justify-center gap-2">
                                <ArrowLeft className="size-5" /> Back to Home
                            </Link>

                            <button
                                onClick={() => signOut()}
                                className="w-full h-16 bg-black text-white font-black uppercase tracking-widest text-xl border-2 border-[#303134] active:bg-shatter-pink active:border-black transition-colors"
                            >
                                Log Out
                            </button>
                        </div>
                    </div >
                )
            }
        </>
    );
}
