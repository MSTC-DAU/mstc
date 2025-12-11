
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Terminal } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

const navItems = [
    { name: 'Events', href: '/dashboard/events' },
    { name: 'Timeline', href: '/#timeline' },
    { name: 'Team', href: '/team' },
    { name: 'About', href: '/about' },
];

export function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <div className="size-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                            <Terminal className="text-white size-5" />
                        </div>
                        <Link href="/" className="font-bold text-xl tracking-tighter hover:opacity-80 transition">
                            MSTC <span className="text-cyan-400">Next</span>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                        pathname === item.href
                                            ? 'bg-white/10 text-white'
                                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6 gap-4">
                            {session?.user ? (
                                <>
                                    <Button
                                        variant="ghost"
                                        className="text-gray-300 hover:text-white hover:bg-white/10"
                                        onClick={() => signOut()}
                                    >
                                        Logout
                                    </Button>
                                    <Link href="/dashboard">
                                        <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0">
                                            Dashboard
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0">
                                            Join Club
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-[#0f0f0f] border-l border-white/10 text-white">
                                <div className="flex flex-col gap-4 mt-8">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="text-lg font-medium text-gray-300 hover:text-white"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                    <div className="h-px bg-white/10 my-2" />
                                    {session?.user ? (
                                        <>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-gray-300"
                                                onClick={() => signOut()}
                                            >
                                                Logout
                                            </Button>
                                            <Link href="/dashboard">
                                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                                    Dashboard
                                                </Button>
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/login">
                                                <Button variant="ghost" className="w-full justify-start text-gray-300">
                                                    Login
                                                </Button>
                                            </Link>
                                            <Link href="/register">
                                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                                    Join Club
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}
