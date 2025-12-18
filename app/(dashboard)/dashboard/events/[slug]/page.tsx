
import { db } from '@/lib/db';
import { events, registrations, eventAwards } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, CheckCircle2, Trophy } from 'lucide-react';
import DynamicRegistrationForm from '@/components/forms/dynamic-registration-form';
import { auth } from '@/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EVENT_THEME_CONFIG, EventThemeKey } from '@/lib/themes-config';
import { cn } from '@/lib/utils';
import { EventControlCenter } from '@/components/events/event-control-center';
import { EventBackground } from '@/components/ui/event-background';

export const dynamic = 'force-dynamic';

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const session = await auth();

    const event = await db.query.events.findFirst({
        where: eq(events.slug, slug)
    });

    if (!event) return notFound();

    const themeKey = (event.theme || 'default') as EventThemeKey;
    const theme = EVENT_THEME_CONFIG[themeKey] || EVENT_THEME_CONFIG['default'];

    // Check Registration Status
    let isRegistered = false;
    if (session?.user?.id) {
        const existingReg = await db.query.registrations.findFirst({
            where: and(
                eq(registrations.userId, session.user.id),
                eq(registrations.eventId, event.id)
            )
        });
        if (existingReg) isRegistered = true;
    }

    // Fetch Awards (Hall of Fame)
    const awards = await db.query.eventAwards.findMany({
        where: eq(eventAwards.eventId, event.id),
        with: {
            team: {
                with: {
                    registrations: {
                        with: { user: true }
                    }
                }
            },
            user: true
        },
        orderBy: [asc(eventAwards.rank)]
    });

    return (
        <div className="min-h-screen relative font-sans">
            <EventBackground theme={themeKey} />

            <div className="relative z-10 space-y-8 pb-20">
                {/* Header Section */}
                <div className={cn("relative overflow-hidden min-h-[200px] md:min-h-[300px] flex flex-col items-center justify-center text-center group pt-12")}>


                    {/* Back Button & Badges */}
                    <div className="absolute top-0 left-4 z-20 flex items-center gap-4">
                        <Button variant="ghost" asChild className="text-gray-400 hover:text-white hover:bg-white/5 uppercase tracking-widest font-bold text-xs md:text-sm">
                            <Link href="/dashboard/events">
                                &larr; Back to Log
                            </Link>
                        </Button>
                    </div>

                    <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center w-full px-4 mt-8">
                        {/* Event Type Badge */}
                        <div className={cn("mb-6 px-4 py-1.5 text-xs md:text-sm font-black uppercase tracking-[0.2em] border-2 backdrop-blur-md shadow-[4px_4px_0px_black]", theme.accent.replace('text-', 'border-').replace('border-', 'text-'))}>
                            {event.type.replace('_', ' ')}
                        </div>

                        {/* Massive Title */}
                        <h1 className={cn("text-5xl md:text-7xl lg:text-9xl font-black italic uppercase tracking-tighter mb-8 md:mb-12 text-white drop-shadow-2xl leading-[0.85] py-2 break-words text-center w-full")}>
                            {event.title}
                        </h1>

                        {/* Metadata Grid */}
                        <div className={cn("grid grid-cols-3 gap-0 w-full max-w-4xl border-y-2 bg-black/40 backdrop-blur-xl", theme.accent.replace('text-', 'border-').split(' ')[0])}>
                            <div className="p-2 md:p-6 flex flex-col items-center justify-center gap-1 md:gap-2 border-r-2 border-white/10">
                                <span className="text-[8px] md:text-xs font-mono uppercase text-gray-400 tracking-widest text-center">Timeline</span>
                                <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 font-black text-xs md:text-lg text-white uppercase text-center">
                                    <Calendar className={cn("size-3 md:size-5 hidden md:block", theme.icon)} />
                                    <span>{event.startDate ? new Date(event.startDate).toLocaleDateString() : 'TBA'}</span>
                                </div>
                            </div>

                            <div className="p-2 md:p-6 flex flex-col items-center justify-center gap-1 md:gap-2 border-r-2 border-white/10">
                                <span className="text-[8px] md:text-xs font-mono uppercase text-gray-400 tracking-widest text-center">Squad</span>
                                <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 font-black text-xs md:text-lg text-white uppercase text-center">
                                    <Users className={cn("size-3 md:size-5 hidden md:block", theme.icon)} />
                                    <span>{event.config?.maxTeamSize ? `Max ${event.config.maxTeamSize}` : 'Solo'}</span>
                                </div>
                            </div>

                            <div className="p-2 md:p-6 flex flex-col items-center justify-center gap-1 md:gap-2">
                                <span className="text-[8px] md:text-xs font-mono uppercase text-gray-400 tracking-widest text-center">Status</span>
                                <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 font-black text-xs md:text-lg text-white uppercase text-center">
                                    <Clock className={cn("size-3 md:size-5 hidden md:block", theme.icon)} />
                                    <span className={cn(event.status === 'live' ? 'text-green-400 animate-pulse' : '')}>
                                        {event.status === 'live' ? 'Live' : 'Open'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interactive Content Layout */}
                <EventControlCenter
                    event={event}
                    theme={theme}
                    isRegistered={isRegistered}
                    awards={awards}
                >
                    {(() => {
                        const now = new Date();
                        const regStart = event.registrationStartDate ? new Date(event.registrationStartDate) : null;
                        const regEnd = event.registrationEndDate ? new Date(event.registrationEndDate) : null;

                        if (event.status === 'past') {
                            return (
                                <div className="p-6 bg-red-950/50 border-4 border-red-500 text-center font-black uppercase text-red-500 tracking-widest">
                                    // Mission Ended //
                                </div>
                            );
                        }

                        if (regStart && now < regStart) {
                            return (
                                <div className="p-6 bg-yellow-950/50 border-4 border-yellow-500 text-center text-yellow-500">
                                    <div className="font-black uppercase tracking-widest mb-2">Locked</div>
                                    <div className="font-mono text-xs">Unlocks: {regStart.toLocaleDateString()}</div>
                                </div>
                            );
                        }

                        if (regEnd && now > regEnd) {
                            return (
                                <div className="space-y-4">
                                    <div className="p-6 bg-red-950/50 border-4 border-red-500 text-center font-black uppercase text-red-500 tracking-widest">
                                        // Registration Closed //
                                    </div>
                                    <div className="text-xs font-mono text-gray-500 text-center">
                                        OVERRIDE REQUEST: <a href="mailto:microsoftclub@dau.ac.in" className="text-white hover:underline">ADMIN@MSTC</a>
                                    </div>
                                </div>
                            );
                        }

                        // Default: Open
                        return <DynamicRegistrationForm config={event.config} eventId={event.id} />;
                    })()}
                </EventControlCenter>
            </div>
        </div>
    );
}

