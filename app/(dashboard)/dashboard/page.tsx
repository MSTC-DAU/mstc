
import { auth } from '@/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trophy, Zap, Calendar } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { users, events } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function DashboardPage() {
    const session = await auth();

    // Fetch real user data
    let userXp = 0;
    let activeEventsCount = 0;
    let totalSubmissions = 0;
    let recentCheckpoints: any[] = [];

    if (session?.user?.id) {
        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
            with: {
                registrations: {
                    with: {
                        checkpoints: {
                            orderBy: (checkpoints: any, { desc }: any) => [desc(checkpoints.createdAt)],
                            limit: 5
                        },
                        event: true
                    }
                }
            }
        }) as any;

        if (dbUser) {
            userXp = dbUser.xpPoints || 0;
            activeEventsCount = dbUser.registrations.length;

            // Flatten checkpoints for "Recent Activity"
            // Note: This simple approach collects recent checks from all registrations
            // For a perfect global "recent", we might need a separate query from 'checkpoints' table directly
            // but this is efficient enough for a dashboard overview.
            const allUserCheckpoints = dbUser.registrations.flatMap((reg: any) =>
                reg.checkpoints.map((cp: any) => ({
                    ...cp,
                    eventName: reg.event.title,
                    eventSlug: reg.event.slug
                }))
            ).sort((a: any, b: any) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

            totalSubmissions = allUserCheckpoints.length;
            recentCheckpoints = allUserCheckpoints.slice(0, 3);
        }
    }

    // Fetch Live Event
    const liveEvent = await db.query.events.findFirst({
        where: eq(events.status, 'live')
    });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Hello, {session?.user?.name || 'Student'}</h1>
                <p className="text-gray-400">Welcome to your MSTC command center.</p>
            </div>

            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 md:gap-6 mb-8">
                <Card className="p-4 md:p-6 bg-gradient-to-br from-purple-900/20 to-transparent border-purple-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Trophy className="size-5 md:size-6 text-purple-400" />
                        </div>
                        <span className="text-xl md:text-2xl font-bold font-mono">{userXp}</span>
                    </div>
                    <div className="text-xs md:text-sm text-gray-400">XP Points Earned</div>
                </Card>

                <Card className="p-4 md:p-6 bg-gradient-to-br from-blue-900/20 to-transparent border-blue-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Zap className="size-5 md:size-6 text-blue-400" />
                        </div>
                        <span className="text-xl md:text-2xl font-bold font-mono">{activeEventsCount}</span>
                    </div>
                    <div className="text-xs md:text-sm text-gray-400">Active Events</div>
                </Card>

                <Card className="p-4 md:p-6 bg-gradient-to-br from-green-900/20 to-transparent border-green-500/20 col-span-2 md:col-span-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <Calendar className="size-5 md:size-6 text-green-400" />
                        </div>
                        <span className="text-xl md:text-2xl font-bold font-mono">{totalSubmissions}</span>
                    </div>
                    <div className="text-xs md:text-sm text-gray-400">Total Submissions</div>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Active Event - Live Action */}
                <Card className="p-4 md:p-6 bg-white/5 border-white/10">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        {liveEvent ? (
                            <>
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                Live Now: {liveEvent.title}
                            </>
                        ) : (
                            <span className="text-gray-400">No Live Events</span>
                        )}
                    </h3>

                    <div className="space-y-4">
                        {liveEvent ? (
                            <>
                                <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                                    <div className="text-sm text-gray-400 mb-1">Status</div>
                                    <div className="font-semibold text-cyan-400">Accepting Submissions</div>
                                </div>

                                <Link href={`/dashboard/events/${liveEvent.slug}`}>
                                    <Button className="w-full bg-white text-black hover:bg-gray-200">
                                        Continue Working <ArrowRight className="ml-2 size-4" />
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <div className="p-8 text-center text-gray-500 bg-white/5 rounded-lg border border-dashed border-white/10">
                                Check back later for upcoming hackathons and events!
                            </div>
                        )}
                    </div>
                </Card>

                {/* Recent Activity / Roadmap */}
                <Card className="p-4 md:p-6 bg-white/5 border-white/10">
                    <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentCheckpoints.length > 0 ? (
                            recentCheckpoints.map((cp) => (
                                <div key={cp.id} className="flex items-center gap-4 text-sm">
                                    <div className={`size-2 rounded-full ${cp.isApproved ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                    <div className="flex-1">
                                        <span className="text-gray-300">Submitted Week {cp.weekNumber} Checkpoint for </span>
                                        <span className="text-cyan-400 font-mono">{cp.eventName}</span>
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                        {new Date(cp.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500 text-center py-4">No recent activity</div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
