"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import {
    LayoutDashboard,
    Calendar,
    User,
    Trophy,
    Map,
    Terminal,
    ArrowLeft,
    LogOut
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Events', href: '/dashboard/events', icon: Calendar },
    { name: 'My Teams', href: '/dashboard/teams', icon: User },
    { name: 'Roadmaps', href: '/dashboard/roadmaps', icon: Map },
    { name: 'Leaderboard', href: '/dashboard/leaderboard', icon: Trophy },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export function DashboardSidebar({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    return (
        <div className={cn("flex flex-col h-full bg-[#141414] border-r border-white/10", className)}>
            <div className="h-16 flex items-center px-6 border-b border-white/10 gap-2 shrink-0">
                <Terminal className="text-cyan-400 size-6" />
                <span className="font-bold text-lg tracking-tight">MSTC Student</span>
            </div>

            <div className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} onClick={onNavigate}>
                            <Button variant="ghost" className={cn("w-full justify-start gap-3", isActive ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5")}>
                                <item.icon className="size-4" />
                                {item.name}
                            </Button>
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-white/10 space-y-2 shrink-0">
                {/* Admin Link for Non-Students */}
                {status === 'authenticated' && session?.user && (session.user.role || 'student') !== 'student' && (
                    <Link href="/admin" onClick={onNavigate}>
                        <Button variant="ghost" className="w-full justify-start gap-3 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 mb-2">
                            <Terminal className="size-4" /> Admin Panel
                        </Button>
                    </Link>
                )}

                <Link href="/" onClick={onNavigate}>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-gray-400 hover:text-white hover:bg-white/10">
                        <ArrowLeft className="size-4" /> Back to Website
                    </Button>
                </Link>
                <Button variant="ghost" onClick={() => signOut({ callbackUrl: '/' })} className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                    <LogOut className="size-4" /> Logout
                </Button>
            </div>
        </div>
    );
}
