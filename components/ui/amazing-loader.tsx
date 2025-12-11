"use client";

import { motion } from "framer-motion";

export const AmazingLoader = () => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative">
                {/* Outer Ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-500 border-r-cyan-500/50"
                    style={{ width: "120px", height: "120px", margin: "-35px" }} // Centering adjustment
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* Middle Ring - Reverse */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-transparent border-b-purple-500 border-l-purple-500/50"
                    style={{ width: "90px", height: "90px", margin: "-20px" }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                {/* Core Pulse */}
                <motion.div
                    className="relative flex items-center justify-center rounded-full bg-cyan-500/10"
                    style={{ width: "50px", height: "50px" }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                        boxShadow: [
                            "0 0 20px rgba(0, 243, 255, 0.2)",
                            "0 0 40px rgba(0, 243, 255, 0.6)",
                            "0 0 20px rgba(0, 243, 255, 0.2)"
                        ]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="h-4 w-4 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(0,243,255,1)]" />
                </motion.div>

                {/* Loading Text */}
                <motion.div
                    className="absolute top-24 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-mono tracking-[0.2em] text-cyan-400/80"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    INITIALIZING
                </motion.div>
            </div>
        </div>
    );
};
