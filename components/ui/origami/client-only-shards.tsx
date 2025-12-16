'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ClientOnlyShards() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                    key={i}
                    className={cn(
                        "absolute opacity-20",
                        i % 2 === 0 ? "bg-black" : "bg-shatter-yellow"
                    )}
                    initial={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        scale: 0,
                        rotate: 0
                    }}
                    animate={{
                        y: [0, Math.random() * 50 - 25],
                        rotate: [0, 180],
                        scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 5 + Math.random() * 5,
                        repeat: Infinity
                    }}
                    style={{
                        width: Math.random() * 50 + 20,
                        height: Math.random() * 50 + 20,
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                    }}
                />
            ))}
        </>
    );
}
