'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { InstallPrompt } from '@/components/pwa/install-prompt';

import Image from 'next/image';

const links = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/dashboard/events' },
    { name: 'Timeline', href: '/#timeline' },
    { name: 'Team', href: '/team' },
    { name: 'About', href: '/about' },
];

export function OrigamiNavbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { data: session } = useSession();
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#202124] text-[#E8EAED] border-b-4 border-shatter-yellow font-sans">
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                {/* Brand */}

                {/* Brand */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative size-16 transition-transform group-hover:rotate-6">
                        <Image
                            src="/mstc_logo.png"
                            alt="MSTC Logo"
                            fill
                            className="object-contain drop-shadow-[2px_2px_0px_rgba(138,180,248,0.5)]"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-2xl tracking-tighter uppercase italic leading-none">
                            MSTC
                        </span>
                        <span className="text-xs font-bold tracking-widest text-shatter-yellow bg-black px-1">
                            DAU
                        </span>
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-bold uppercase tracking-widest hover:text-shatter-yellow transition-colors relative",
                                pathname === link.href ? "text-shatter-yellow" : "text-[#E8EAED]"
                            )}
                        >
                            {link.name}
                            {pathname === link.href && (
                                <span className="absolute -bottom-2 left-0 w-full h-1 bg-shatter-pink skew-x-12" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <InstallPrompt className="h-10 px-6 border-2 border-shatter-pink text-shatter-pink hover:bg-shatter-pink hover:text-black font-black uppercase tracking-widest transition-all rounded-none flex items-center gap-2" />
                    {session ? (
                        <Link href="/dashboard">
                            <Button className="h-10 px-6 bg-shatter-yellow hover:bg-white text-black font-black uppercase tracking-widest shatter-shadow-sm border-2 border-transparent hover:border-black transition-all rounded-none">
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/register">
                            <Button className="h-10 px-6 bg-shatter-pink hover:bg-white hover:text-black text-white font-black uppercase tracking-widest shatter-shadow-sm border-2 border-transparent hover:border-black transition-all rounded-none flex items-center gap-2">
                                Join Us <ArrowRight className="size-4" />
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden size-10 flex items-center justify-center bg-shatter-yellow text-black font-bold"
                >
                    {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    className="md:hidden bg-[#202124] border-b-4 border-black overflow-hidden text-[#E8EAED]"
                >
                    <div className="flex flex-col p-4 gap-4">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block text-2xl font-black uppercase italic hover:text-shatter-pink transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-4 border-t-2 border-[#303134]">
                            {session ? (
                                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                                    <Button className="w-full h-12 bg-shatter-yellow text-black font-black uppercase tracking-widest rounded-none border-2 border-transparent active:border-black">
                                        Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/register" onClick={() => setMobileOpen(false)}>
                                    <Button className="w-full h-12 bg-shatter-pink text-white font-black uppercase tracking-widest rounded-none border-2 border-transparent active:border-black flex items-center justify-center gap-2">
                                        Join Us <ArrowRight className="size-4" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </nav>
    );
}
