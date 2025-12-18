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

type ActiveView = 'registration' | 'mission' | 'rules' | 'awards' | 'timeline';

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
                            <div className="prose prose-invert prose-sm max-w-none text-gray-300 font-medium leading-relaxed prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-a:text-cyan-400 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin-black"
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
                            <div className="prose prose-invert prose-sm max-w-none text-gray-300 font-medium leading-relaxed prose-li:marker:text-red-500 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin-black"
                                dangerouslySetInnerHTML={{ __html: event.rules }}
                            />
                        ) : (
                            <p className="text-gray-500 italic">Standard protocols apply.</p>
                        )}
                    </div>
                );
            case 'awards': {
                // Group awards by category
                const groupedAwards = awards.reduce((acc: any, award: any) => {
                    const cat = award.category || 'Overall';
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(award);
                    return acc;
                }, {});

                return (
                    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-2 md:gap-4 text-yellow-400 mb-2">
                            <Trophy className="size-6 md:size-8" />
                            <h2 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter">Hall of Fame</h2>
                        </div>
                        <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin-black">
                            {awards.length === 0 ? (
                                <p className="text-gray-500 italic">No records found yet.</p>
                            ) : (
                                Object.entries(groupedAwards).map(([category, categoryAwards]: [string, any]) => (
                                    <div key={category} className="space-y-4">
                                        <h3 className="text-sm font-black uppercase text-cyan-500 tracking-widest border-b border-white/10 pb-2 mb-4">
                                            {category}
                                        </h3>
                                        <div className="space-y-3">
                                            {categoryAwards.map((award: any) => {
                                                // Rank Colors
                                                let rankColor = "bg-gray-700 text-white";
                                                let textColor = "text-white";

                                                if (award.rank === 1) {
                                                    rankColor = "bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.5)]";
                                                    textColor = "text-yellow-400";
                                                } else if (award.rank === 2) {
                                                    rankColor = "bg-slate-300 text-black shadow-[0_0_15px_rgba(203,213,225,0.5)]";
                                                    textColor = "text-slate-300";
                                                } else if (award.rank === 3) {
                                                    rankColor = "bg-amber-700 text-white shadow-[0_0_15px_rgba(180,83,9,0.5)]";
                                                    textColor = "text-amber-600";
                                                }

                                                return (
                                                    <div key={award.id} className="bg-white/5 border border-white/10 p-4 rounded-none flex items-center gap-4 hover:bg-white/10 transition-colors">
                                                        <div className={cn("size-10 font-black flex items-center justify-center rounded-full shrink-0", rankColor)}>
                                                            #{award.rank}
                                                        </div>
                                                        <div>
                                                            <div className={cn("font-bold uppercase text-lg", textColor)}>{award.title}</div>
                                                            <div className="text-xs text-gray-400 font-mono">
                                                                {award.team ? `TEAM: ${award.team.name}` : `USER: ${award.user?.name}`}
                                                            </div>
                                                            {award.description && <div className="text-xs text-gray-500 mt-1 italic">"{award.description}"</div>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );
            }
            case 'timeline':
                return (
                    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-2 md:gap-4 text-shatter-yellow mb-2">
                            <Clock className="size-6 md:size-8" />
                            <h2 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter">Timeline</h2>
                        </div>
                        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin-black">
                            {event.timeline && event.timeline.length > 0 ? (
                                (event.timeline as any[]).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).map((item, idx) => (
                                    <div key={idx} className="relative pl-8 border-l-2 border-dashed border-white/20 last:border-0 pb-10">
                                        <div className="absolute -left-[11px] top-0 flex items-center justify-center">
                                            <div className="size-5 bg-shatter-yellow border-2 border-black rotate-45 z-10 shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
                                        </div>
                                        <div className="bg-[#303134] border-2 border-black p-4 relative" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
                                            <div className="space-y-2">
                                                <div className="flex flex-col md:flex-row md:items-center gap-3 font-mono text-xs uppercase tracking-widest">
                                                    <span className="font-bold text-shatter-pink border border-shatter-pink/30 px-2 py-0.5 bg-shatter-pink/10">
                                                        {new Date(item.startDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                    </span>
                                                    <span className="hidden md:inline text-white/20">TO</span>
                                                    <span className="text-[#9AA0A6]">
                                                        {new Date(item.endDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-black text-[#E8EAED] uppercase italic">{item.title}</h3>
                                                <p className="text-sm text-[#9AA0A6] font-medium leading-relaxed">{item.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">Timeline to be announced.</p>
                            )}
                        </div>
                    </div>
                );
            case 'registration': default:
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
                                <Button asChild className={cn("w-full h-12 md:h-16 text-lg md:text-xl font-black uppercase tracking-widest transition-all rounded-none border-4 shadow-[4px_4px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_black]",
                                    theme.name === 'Winter of Code' ? "bg-cyan-950/40 text-cyan-100 border-cyan-500/50 hover:bg-cyan-900/60 backdrop-blur-md shadow-none hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] border-2" :
                                        "bg-white text-black hover:bg-shatter-yellow border-black")}>
                                    <Link href={`/dashboard/events/${event.slug}/roadmap`} className="block group w-full h-full flex items-center justify-center">
                                        View Roadmap <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                                    </Link>
                                </Button>
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

                {/* Module: Timeline */}
                <button
                    onClick={() => setActiveView('timeline' as any)}
                    className={cn(
                        "flex-none w-[140px] lg:w-full snap-start text-left px-3 py-2 lg:px-4 lg:py-3 border-b-4 lg:border-b-0 lg:border-l-4 bg-transparent hover:bg-white/5 transition-all group flex items-center justify-between",
                        activeView === 'timeline' ? 'border-shatter-yellow bg-white/5' : 'border-gray-800 hover:border-white'
                    )}
                >
                    <span className={cn("font-black italic uppercase tracking-tighter text-xs lg:text-lg text-gray-400 group-hover:text-shatter-yellow transition-colors", activeView === 'timeline' && "text-shatter-yellow")}>
                        Timeline
                    </span>
                    <Clock className={cn("size-4 lg:size-5 text-gray-800 group-hover:text-shatter-yellow transition-colors", activeView === 'timeline' && "text-shatter-yellow")} />
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
                                    activeView === 'timeline' ? 'bg-shatter-yellow' :
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

