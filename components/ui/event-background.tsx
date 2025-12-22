'use client';

import { motion } from 'framer-motion';
import { EventThemeKey } from '@/lib/themes-config';
import React from 'react';
import { cn } from '@/lib/utils';
import { Github, GitBranch, GitCommit, GitPullRequest, Terminal, GitMerge } from 'lucide-react';

const WinterBackground = () => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#020617]">
        {/* Dynamic Aurora Gradient */}
        <motion.div
            className="absolute inset-0 opacity-40 will-change-transform"
            style={{
                background: 'radial-gradient(circle at 50% -20%, #22d3ee 0%, #0c4a6e 20%, #020617 60%)',
            }}
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />

        {/* Secondary Shifting Aurora Layers */}
        <motion.div
            className="absolute -inset-[50%] opacity-30 blur-[100px] will-change-transform"
            style={{
                background: 'conic-gradient(from 0deg at 50% 50%, #020617 0deg, #0891b2 120deg, #020617 240deg)',
            }}
            animate={{
                rotate: 360
            }}
            transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
            }}
        />

        {/* Heavy Snowfall Effect */}
        {[...Array(100)].map((_, i) => {
            const isLarge = i % 5 === 0; // 20% large flakes
            const duration = isLarge ? 10 + Math.random() * 5 : 20 + Math.random() * 15;

            return (
                <motion.div
                    key={`snow-heavy-${i}`}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: -50 // Start position for layout
                    }}
                    animate={{
                        y: ["0vh", "120vh"],
                        x: [0, Math.random() * 40 - 20],
                        opacity: [0, isLarge ? 1 : 0.6, isLarge ? 1 : 0.6, 0]
                    }}
                    transition={{
                        duration: duration,
                        repeat: Infinity,
                        delay: -Math.random() * 20, // Immediate presence
                        ease: "linear"
                    }}
                    className={cn(
                        "absolute rounded-full bg-white",
                        isLarge ? "w-2 h-2 blur-[1px] z-10" : "w-1 h-1 blur-[0.5px] opacity-60"
                    )}
                // Shadow inline if needed, or via class
                />
            );
        })}

        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)] pointer-events-none" />
    </div>
);

const HacktoberfestBackground = () => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#150229]">
        <div className="absolute inset-0 bg-noise opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        {[...Array(15)].map((_, i) => (
            <motion.div
                key={i}
                initial={{ y: 1000, x: Math.random() * 1500, opacity: 0 }}
                animate={{ y: -200, opacity: [0, 0.8, 0] }}
                transition={{
                    duration: 100 + Math.random() * 10,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "linear"
                }}
                className="absolute flex items-center justify-center text-purple-400/30 font-mono font-bold text-2xl"
            >
                {[
                    '</>',
                    '//',
                    <GitPullRequest key="pr" className="size-8" />,
                    <Terminal key="term" className="size-8" />,
                    '{ }'
                ][i % 5]}
            </motion.div>
        ))}
    </div>
);

const GithubBackground = () => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#0d1117]">
        <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent opacity-90" />
        {[...Array(20)].map((_, i) => {
            const Icon = [Github, GitBranch, GitCommit, GitPullRequest, Terminal, GitMerge][i % 6];
            return (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{
                        opacity: [0, 1.5, 1.5, 0],
                        scale: [0.5, 1.2, 0.5],
                        rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                        duration: 3 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                    }}
                    className="absolute text-white/10"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                >
                    <Icon className="size-8" />
                </motion.div>
            );
        })}
    </div>
);

const SummerBackground = () => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#1c1004]">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        {/* Fireflies */}
        {[...Array(20)].map((_, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0, 1.2, 0],
                    y: [0, -50, -100],
                    x: [0, Math.random() * 50 - 25, 0]
                }}
                transition={{
                    duration: 2 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "easeInOut"
                }}
                className="absolute size-1 bg-yellow-400 rounded-full blur-[1px] shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${50 + Math.random() * 50}%`,
                }}
            />
        ))}
    </div>
);

const CPBackground = () => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
        <div className="absolute inset-0 flex justify-around opacity-20">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ y: -1000 }}
                    animate={{ y: 2000 }}
                    transition={{
                        duration: 5 + Math.random() * 10,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "linear"
                    }}
                    className="w-[2px] h-[200px] bg-gradient-to-b from-transparent via-green-500 to-transparent"
                />
            ))}
        </div>
        {[...Array(10)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute flex items-center gap-2"
                initial={{ x: Math.random() * 1000, y: Math.random() * 800, opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 5 }}
            >
                <div className="size-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                <div className="h-px w-10 bg-green-700/50" />
                <div className="size-3 rounded-full bg-green-500/50" />
            </motion.div>
        ))}
    </div>
);

const PolarNightBackground = () => {
    // 1. ICE SHARDS (Blue): Fall from Top to Bottom
    // Increased count (40 -> 70) and scale variance
    const iceShards = React.useMemo(() => [...Array(70)].map(() => ({
        left: Math.random() * 100 + "%",
        top: -Math.random() * 20 + "%",
        yEnd: 100 + Math.random() * 20 + "vh",
        duration: 2 + Math.random() * 4, // Faster fall
        delay: -Math.random() * 5,
        scale: 1 + Math.random() * 1.5, // Much larger scale
        opacity: 0.7 + Math.random() * 0.3 // Higher average opacity
    })), []);

    // 2. FIRE EMBER/ASH (Red): Rise from Bottom to Top
    // Increased count (40 -> 70)
    const fireEmbers = React.useMemo(() => [...Array(70)].map(() => ({
        left: Math.random() * 100 + "%",
        bottom: -Math.random() * 20 + "%",
        yEnd: -(100 + Math.random() * 20) + "vh",
        duration: 4 + Math.random() * 6,
        delay: -Math.random() * 10,
        scale: 1 + Math.random() * 2, // Signficantly larger
        opacity: 0.6 + Math.random() * 0.4
    })), []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#020617]">
            {/* --- STATIC GRADIENT ZONES --- */}

            {/* TOP: Cold Blue Zone - Increased Intensity */}
            <div className="absolute inset-x-0 top-0 h-[55vh] bg-gradient-to-b from-cyan-500/30 via-blue-900/15 to-transparent mix-blend-screen" />

            {/* BOTTOM: Hot Red Zone - Increased Intensity */}
            <div className="absolute inset-x-0 bottom-0 h-[60vh] bg-gradient-to-t from-red-600/30 via-red-900/15 to-transparent mix-blend-screen" />


            {/* --- PARTICLE SYSTEMS --- */}

            {/* BLUE SNOWFLAKES (Downwards) */}
            {iceShards.map((p, i) => (
                <motion.div
                    key={`ice-${i}`}
                    style={{
                        left: p.left,
                        top: p.top,
                        scale: p.scale,
                    }}
                    animate={{
                        y: p.yEnd,
                        opacity: [0, p.opacity, 0],
                        rotate: [0, 360] // Rotate as they fall
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear"
                    }}
                    className="absolute text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] text-xl select-none"
                >
                    ❄
                </motion.div>
            ))}

            {/* RED EMBER ASH (Upwards) */}
            {fireEmbers.map((p, i) => (
                <motion.div
                    key={`fire-${i}`}
                    style={{
                        left: p.left,
                        bottom: p.bottom,
                        scale: p.scale,
                    }}
                    animate={{
                        y: p.yEnd,
                        x: (Math.random() - 0.5) * 150, // Wider drift
                        opacity: [0, p.opacity, 0]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear"
                    }}
                    className="absolute rounded-full bg-red-500 blur-[1px] shadow-[0_0_15px_red] size-2" // Base size increased
                />
            ))}

            {/* Cinematic Vignette (Center Focus) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_70%,#000000_100%)]" />
        </div>
    );
};

const DefaultBackground = () => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#020617]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-black opacity-80" />
        <div className="bg-noise opacity-20" />
    </div>
);

const COMPONENTS: Record<EventThemeKey, React.FC> = {
    default: DefaultBackground,
    winter: WinterBackground,
    polar_night: PolarNightBackground,
    hacktoberfest: HacktoberfestBackground,
    github: GithubBackground,
    summer: SummerBackground,
    cp: CPBackground
};


export function EventBackground({ theme }: { theme: EventThemeKey }) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const Component = COMPONENTS[theme] || DefaultBackground;
    return <Component />;
}

