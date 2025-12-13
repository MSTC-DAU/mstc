
import { db } from '@/lib/db';
import { events, roadmaps, registrations, checkpoints } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import RoadmapViewer from '@/components/roadmap/roadmap-viewer';
import { Badge } from '@/components/ui/badge';

export default async function UserRoadmapPage({ params }: { params: Promise<{ slug: string }> }) {
    const session = await auth();
    if (!session?.user?.id) return redirect('/login');

    const { slug } = await params;
    const event = await db.query.events.findFirst({
        where: eq(events.slug, slug)
    });

    if (!event) return notFound();

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
                <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-8">
                        <h1 className="text-2xl font-bold text-yellow-500 mb-2">Pending Domain Assignment</h1>
                        <p className="text-gray-400">
                            Your domain has not been assigned by the admins yet.
                            Please check back later.
                        </p>
                    </div>

                    {registration.domainPriorities && (
                        <div className="text-left bg-white/5 rounded-xl p-6 border border-white/10">
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
            <div className="max-w-4xl mx-auto py-12 text-center">
                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                    <p className="text-gray-400">Roadmap not found or not yet published.</p>
                </div>
            </div>
        );
    }

    if (!registration) return redirect(`/dashboard/events/${slug}`); // Redirect to details if not registered

    // 3. Get User's Submissions (Checkpoints)
    const userCheckpoints = await db.select().from(checkpoints).where(eq(checkpoints.registrationId, registration.id));

    // Convert to Map for easier lookup: { weekNumber: CheckpointRow }
    const submissionsMap = userCheckpoints.reduce((acc, curr) => {
        acc[curr.weekNumber] = curr;
        return acc;
    }, {} as Record<number, any>);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{event.title} Roadmap</h1>
                    <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">{roadmap.domain}</Badge>
                </div>
            </div>

            <RoadmapViewer
                roadmapContent={roadmap.content as any[]}
                eventId={event.id}
                submissions={submissionsMap}
            />
        </div>
    );
}
