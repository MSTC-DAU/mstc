
import { db } from '@/lib/db';
import { events, roadmaps, registrations, checkpoints } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import RoadmapViewer from '@/components/roadmap/roadmap-viewer';
import { Badge } from '@/components/ui/badge';
import { EVENT_THEME_CONFIG, EventThemeKey } from '@/lib/themes-config';
import { EventBackground } from '@/components/ui/event-background';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default async function UserRoadmapPage({ params }: { params: Promise<{ slug: string }> }) {
    const session = await auth();
    if (!session?.user?.id) return redirect('/login');

    const { slug } = await params;
    const event = await db.query.events.findFirst({
        where: eq(events.slug, slug)
    });

    if (!event) return notFound();

    const themeKey = (event.theme || 'default') as EventThemeKey;
    const theme = EVENT_THEME_CONFIG[themeKey] || EVENT_THEME_CONFIG['default'];

    // 1. Get User's Registration FIRST
    const registration = await db.query.registrations.findFirst({
        where: and(
            eq(registrations.userId, session.user.id),
            eq(registrations.eventId, event.id)
        )
    });

    if (!registration) return redirect(`/dashboard/events/${slug}`);

    // 2. Determine which roadmap to show
    let roadmapQuery = eq(roadmaps.eventId, event.id);

    // For mentorship, strict filtering by assigned domain
    if (event.type === 'mentorship') {
        if (!registration.assignedDomain) {
            return (
                <div className="min-h-screen relative font-sans">
                    <EventBackground theme={themeKey} />
                    <div className="relative z-10 max-w-2xl mx-auto py-20 px-4 text-center space-y-6">
                        <div className="absolute top-0 left-4 z-20 flex items-center gap-4 pt-8">
                            <Link href={`/dashboard/events/${slug}`}>
                                <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5 uppercase tracking-widest font-bold text-xs md:text-sm">
                                    &larr; Back to Mission
                                </Button>
                            </Link>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-8 backdrop-blur-md">
                            <h1 className="text-2xl font-bold text-yellow-500 mb-2">Pending Domain Assignment</h1>
                            <p className="text-gray-400">
                                Your domain has not been assigned by the admins yet.
                                Please check back later.
                            </p>
                        </div>

                        {registration.domainPriorities && (
                            <div className="text-left bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-md">
                                <h3 className="font-semibold mb-4 text-gray-400">Your Priorities</h3>
                                <div className="space-y-2">
                                    {(registration.domainPriorities as string[]).map((p, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <Badge variant="outline" className="size-6 flex items-center justify-center rounded-full">
                                                {i + 1}
                                            </Badge>
                                            <span>{p}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        // Filter by assigned domain
        roadmapQuery = and(eq(roadmaps.eventId, event.id), eq(roadmaps.domain, registration.assignedDomain)) as any;
    }

    const roadmap = await db.query.roadmaps.findFirst({
        where: roadmapQuery
    });

    if (!roadmap) {
        return (
            <div className="min-h-screen relative font-sans">
                <EventBackground theme={themeKey} />
                <div className="relative z-10 max-w-4xl mx-auto py-20 px-4 text-center">
                    <div className="absolute top-0 left-4 z-20 flex items-center gap-4 pt-8">
                        <Link href={`/dashboard/events/${slug}`}>
                            <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5 uppercase tracking-widest font-bold text-xs md:text-sm">
                                &larr; Back to Mission
                            </Button>
                        </Link>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-md">
                        <p className="text-gray-400">Roadmap not found or not yet published.</p>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Get User's Submissions (Checkpoints)
    const userCheckpoints = await db.select().from(checkpoints).where(eq(checkpoints.registrationId, registration.id));

    // Convert to Map for easier lookup
    const submissionsMap = userCheckpoints.reduce((acc, curr) => {
        acc[curr.weekNumber] = curr;
        return acc;
    }, {} as Record<number, any>);

    return (
        <div className="min-h-screen relative font-sans">
            <EventBackground theme={themeKey} />

            <div className="relative z-10 pb-20 pt-8 px-4">
                {/* Back Button */}
                <div className="max-w-6xl mx-auto mb-8">
                    <Link href={`/dashboard/events/${slug}`}>
                        <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5 uppercase tracking-widest font-bold text-xs md:text-sm -ml-4">
                            &larr; Back to Mission
                        </Button>
                    </Link>
                </div>

                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                        <div>
                            <span className="text-xs font-mono uppercase text-cyan-400 tracking-widest mb-2 block">Active Roadmap</span>
                            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg">{event.title}</h1>
                        </div>
                        <div className={cn("px-4 py-2 border-2 text-sm font-bold uppercase tracking-widest backdrop-blur-md", theme.accent.replace('text-', 'border-').replace('border-', 'text-'))}>
                            {roadmap.domain} Domain
                        </div>
                    </div>

                    <RoadmapViewer
                        roadmapContent={roadmap.content as any[]}
                        eventId={event.id}
                        submissions={submissionsMap}
                    />
                </div>
            </div>
        </div>
    );
}
