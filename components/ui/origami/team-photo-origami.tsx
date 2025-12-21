'use client';

import { motion } from 'framer-motion';

interface TeamPhotoOrigamiProps {
    imageUrl: string;
}

export function TeamPhotoOrigami({ imageUrl }: TeamPhotoOrigamiProps) {
    if (!imageUrl) return null;

    return (
        <div className="relative w-full aspect-[21/9] md:aspect-[21/7] max-w-6xl mx-auto mb-16 overflow-hidden group">
            <div className="absolute inset-0 bg-[#202124] border-4 border-black z-10">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#8AB4F8_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Image Container with Origami Mask Effect */}
                <div className="relative w-full h-full p-4 md:p-8 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full h-full border-4 border-black bg-[#303134] shadow-[8px_8px_0px_#000] overflow-hidden"
                    >
                        <img
                            src={imageUrl}
                            alt="MSTC Team"
                            className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
                        />

                        {/* Overlay/Decoration */}
                        <div className="absolute top-0 right-0 p-4 bg-shatter-yellow border-b-4 border-l-4 border-black">
                            <span className="font-black uppercase tracking-widest text-xs md:text-sm">
                                Core Team 2024-25
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-shatter-pink border-4 border-black z-20" />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-shatter-yellow border-4 border-black z-20" />
        </div>
    );
}
