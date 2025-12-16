'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle2, Clock, FileText, ShieldAlert, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Types (simplified for props)
interface EventControlCenterProps {
    event: any; // Using any to avoid complex schema imports here, strict in usage
    theme: any;
    isRegistered: boolean;
    awards: any[];
    children?: React.ReactNode; // For the registration form which is a server/client hybrid beast
}

type ActiveView = 'registration' | 'mission' | 'rules' | 'awards';

export function EventControlCenter({ event, theme, isRegistered, awards, children }: EventControlCenterProps) {
    const [activeView, setActiveView] = useState<ActiveView>('registration');

    // Helper to render content in Sidebar
    const renderSidebarContent = () => {
        switch (activeView) {
            case 'mission':
                return (
                    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-2 md:gap-4 text-cyan-400 mb-2">
                            <FileText className="size-6 md:size-8" />
                            <h2 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter">Mission Brief</h2>
                        </div>
                        {event.description ? (
                            <div className="prose prose-invert prose-sm max-w-none text-gray-300 font-medium leading-relaxed prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-a:text-cyan-400 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar"
                                dangerouslySetInnerHTML={{ __html: event.description }}
                            />
                        ) : (
                            <p className="text-gray-500 italic">No briefing data available.</p>
                        )}
                    </div>
                );
            case 'rules':
                return (
                    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-2 md:gap-4 text-red-500 mb-2">
                            <ShieldAlert className="size-6 md:size-8" />
                            <h2 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter">Engagement Rules</h2>
                        </div>
                        {event.rules ? (
                            <div className="prose prose-invert prose-sm max-w-none text-gray-300 font-medium leading-relaxed prose-li:marker:text-red-500 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar"
                                dangerouslySetInnerHTML={{ __html: event.rules }}
                            />
                        ) : (
                            <p className="text-gray-500 italic">Standard protocols apply.</p>
                        )}
                    </div>
                );
            case 'awards':
                return (
                    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-2 md:gap-4 text-yellow-400 mb-2">
                            <Trophy className="size-6 md:size-8" />
                            <h2 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter">Hall of Fame</h2>
                        </div>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            {awards.length === 0 ? (
                                <p className="text-gray-500 italic">No records found yet.</p>
                            ) : (
                                awards.map((award: any) => (
                                    <div key={award.id} className="bg-white/5 border border-white/10 p-4 rounded-none flex items-center gap-4">
                                        <div className="size-10 bg-yellow-500 text-black font-black flex items-center justify-center rounded-full shrink-0">
                                            #{award.rank}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white uppercase">{award.title}</div>
                                            <div className="text-xs text-gray-400">{award.team?.name || award.user?.name}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );
            case 'registration':
            default:
                return (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4 md:space-y-6">
                        {isRegistered ? (
                            <div className="text-center space-y-6 md:space-y-8 relative z-10">
                                <div className={cn("size-16 md:size-24 rounded-none mx-auto bg-black border-4 border-white shadow-[4px_4px_0px_black] flex items-center justify-center")}>
                                    <CheckCircle2 className="size-8 md:size-12 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-black italic uppercase mb-2 text-white tracking-tighter">Status: Active</h3>
                                    <p className="text-gray-400 font-mono text-xs md:text-sm uppercase tracking-widest border-t border-b border-white/10 py-2">You are registered</p>
                                </div>
                                <Link href={`/dashboard/events/${event.slug}/roadmap`} className="block group">
                                    <Button className={cn("w-full h-12 md:h-16 text-lg md:text-xl font-black uppercase tracking-widest transition-all rounded-none border-4 shadow-[4px_4px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_black]",
                                        theme.name === 'Winter of Code' ? "bg-cyan-950/40 text-cyan-100 border-cyan-500/50 hover:bg-cyan-900/60 backdrop-blur-md shadow-none hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] border-2" :
                                            "bg-white text-black hover:bg-shatter-yellow border-black")}>
                                        View Roadmap <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <h3 className={cn("text-2xl md:text-4xl font-black italic uppercase mb-4 md:mb-8 tracking-tighter text-center", theme.accent)}>
                                    Join The Fray
                                </h3>
                                {children}
                                <p className="text-[10px] font-mono uppercase text-gray-600 mt-4 md:mt-8 text-center tracking-widest">
                                    // Protocol: MSTC_COC_V2 //
                                </p>
                            </>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 md:px-8 max-w-7xl mx-auto">
            {/* Main Content Area: Menu Bar */}
            <div className="col-span-1 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide snap-x">
                {/* Hidden header on mobile */}
                <h3 className="hidden lg:block text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-4 ml-1">Modules</h3>

                {/* Module: Mission */}
                <button
                    onClick={() => setActiveView('mission')}
                    className={cn(
                        "flex-none w-[140px] lg:w-full snap-start text-left px-3 py-2 lg:px-4 lg:py-3 border-b-4 lg:border-b-0 lg:border-l-4 bg-transparent hover:bg-white/5 transition-all group flex items-center justify-between",
                        activeView === 'mission' ? 'border-cyan-400 bg-white/5' : 'border-gray-800 hover:border-white'
                    )}
                >
                    <span className={cn("font-black italic uppercase tracking-tighter text-xs lg:text-lg text-gray-400 group-hover:text-cyan-400 transition-colors", activeView === 'mission' && "text-cyan-400")}>
                        Mission
                    </span>
                    <FileText className={cn("size-4 lg:size-5 text-gray-800 group-hover:text-cyan-400 transition-colors", activeView === 'mission' && "text-cyan-400")} />
                </button>

                {/* Module: Rules */}
                <button
                    onClick={() => setActiveView('rules')}
                    className={cn(
                        "flex-none w-[120px] lg:w-full snap-start text-left px-3 py-2 lg:px-4 lg:py-3 border-b-4 lg:border-b-0 lg:border-l-4 bg-transparent hover:bg-white/5 transition-all group flex items-center justify-between",
                        activeView === 'rules' ? 'border-red-500 bg-white/5' : 'border-gray-800 hover:border-white'
                    )}
                >
                    <span className={cn("font-black italic uppercase tracking-tighter text-xs lg:text-lg text-gray-400 group-hover:text-red-500 transition-colors", activeView === 'rules' && "text-red-500")}>
                        Rules
                    </span>
                    <ShieldAlert className={cn("size-4 lg:size-5 text-gray-800 group-hover:text-red-500 transition-colors", activeView === 'rules' && "text-red-500")} />
                </button>

                {/* Module: Hall of Fame (Conditional) */}
                {awards.length > 0 && (
                    <button
                        onClick={() => setActiveView('awards')}
                        className={cn(
                            "flex-none w-[140px] lg:w-full snap-start text-left px-3 py-2 lg:px-4 lg:py-3 border-b-4 lg:border-b-0 lg:border-l-4 bg-transparent hover:bg-white/5 transition-all group flex items-center justify-between",
                            activeView === 'awards' ? 'border-yellow-400 bg-white/5' : 'border-gray-800 hover:border-white'
                        )}
                    >
                        <span className={cn("font-black italic uppercase tracking-tighter text-xs lg:text-lg text-gray-400 group-hover:text-yellow-400 transition-colors", activeView === 'awards' && "text-yellow-400")}>
                            Awards
                        </span>
                        <Trophy className={cn("size-4 lg:size-5 text-gray-800 group-hover:text-yellow-400 transition-colors", activeView === 'awards' && "text-yellow-400")} />
                    </button>
                )}

                {/* Module: Registration (Manual Trigger) */}
                <button
                    onClick={() => setActiveView('registration')}
                    className={cn(
                        "flex-none w-[140px] lg:w-full snap-start text-left px-3 py-2 lg:px-4 lg:py-3 border-b-4 lg:border-b-0 lg:border-l-4 bg-transparent hover:bg-white/5 transition-all group flex items-center justify-between mt-0 lg:mt-8",
                        activeView === 'registration' ? 'border-white bg-white/5' : 'border-gray-800 hover:border-white'
                    )}
                >
                    <span className={cn("font-black italic uppercase tracking-tighter text-xs lg:text-lg text-gray-400 group-hover:text-white transition-colors", activeView === 'registration' && "text-white")}>
                        Status / Reg
                    </span>
                    <ArrowRight className={cn("size-4 lg:size-5 text-gray-800 group-hover:text-white transition-colors", activeView === 'registration' && "text-white")} />
                </button>

            </div>

            {/* Sidebar View: Dynamic Terminal (Now Bigger) */}
            <div className="col-span-1 lg:col-span-3">
                <div className={cn("sticky top-8 rounded-none p-4 md:p-8 relative overflow-hidden min-h-[400px] lg:min-h-[600px] flex flex-col", theme.card)}>
                    <div className="active-view-header mb-6 pb-6 border-b-2 border-white/10 flex items-center justify-between">
                        <span className="text-[10px] md:text-xs font-mono uppercase text-gray-500 tracking-widest">Active Terminal // {event.title}</span>
                        <span className={cn("text-[10px] md:text-xs font-black uppercase tracking-widest px-2 py-0.5 text-black bg-white",
                            activeView === 'mission' ? 'bg-cyan-400' :
                                activeView === 'rules' ? 'bg-red-500' :
                                    activeView === 'awards' ? 'bg-yellow-400' : 'bg-white'
                        )}>
                            {activeView} MODULE
                        </span>
                    </div>
                    <div className="flex-1">
                        {renderSidebarContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

