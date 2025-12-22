'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ClientOnlyShards } from './client-only-shards';

export function OrigamiHero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#202124] pt-20">

            {/* 1. Floating Shards (Decoration) */}
            <ClientOnlyShards />

            <div className="container relative z-10 flex flex-col items-center text-center px-4">

                {/* 2. Top Label */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-shatter-yellow text-black font-black uppercase px-4 py-1 text-sm tracking-widest mb-6 rotate-2 shadow-[4px_4px_0px_#000]"
                >
                    Community // Learn // Build
                </motion.div>

                {/* 3. Massive Typography */}
                <h1 className="text-5xl md:text-9xl font-black uppercase leading-[0.85] tracking-tighter mb-8 italic">
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-[#E8EAED] inline-block relative"
                    >
                        MSTC DAU <span className="text-shatter-pink text-4xl md:text-6xl align-top">_</span>
                    </motion.div>
                    <br />
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8EAED] via-[#E8EAED] to-[#9AA0A6] drop-shadow-sm"
                    >
                        LEARNING
                    </motion.div>
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative inline-block"
                    >
                        BY BUILDING
                        {/* Underline Decoration */}
                        <div className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-2 md:h-4 bg-shatter-yellow -z-10 -rotate-1" />
                    </motion.div>
                </h1>

                {/* 4. Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-2xl font-bold text-[#9AA0A6] max-w-3xl mb-12 leading-relaxed"
                >
                    Let's <span className="text-shatter-yellow">spark the start</span>, <span className="text-shatter-pink">master the art</span>, and <span className="bg-black text-[#E8EAED] px-2 italic inline-block -rotate-1 border-b-4 border-shatter-yellow">craft code that wins hearts</span>.
                </motion.p>

                {/* 5. CTAs */}
                <div className="flex flex-col md:flex-row gap-6">
                    <Link href="/register">
                        <Button className="h-16 px-10 bg-shatter-pink hover:bg-black text-white font-black text-xl uppercase tracking-widest shatter-shadow border-3 border-black rounded-none transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] group">
                            Join the community <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Link href="/dashboard/events">
                        <Button variant="ghost" className="h-16 px-10 bg-[#303134] hover:bg-shatter-yellow text-[#E8EAED] hover:text-black font-black text-xl uppercase tracking-widest shatter-shadow border-3 border-black rounded-none transition-colors">
                            View Events
                        </Button>
                    </Link>
                </div>
            </div>

            {/* 6. Bottom Decor */}
            <div className="absolute bottom-0 left-0 w-full h-8 bg-black flex overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="flex-none w-20 h-full bg-shatter-yellow border-r-2 border-black transform -skew-x-12 mx-2" />
                ))}
            </div>

        </section>
    );
}
