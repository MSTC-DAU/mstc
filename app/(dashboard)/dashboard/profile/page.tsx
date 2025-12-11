
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users, registrations, events, checkpoints, teams } from '@/db/schema';
import { eq, desc, gt, and, count } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Calendar, Activity, Medal, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user?.id) return redirect('/login');

    const userId = session.user.id;

    // 1. Fetch User Data
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });

    if (!user) return redirect('/login');

    // 2. Calculate Rank
    // Count users with strictly more XP than current user
    // Note: This might be slow on huge datasets, but fine for now.
    const betterPlayers = await db.select({ count: count() })
        .from(users)
        .where(gt(users.xpPoints, user.xpPoints || 0));

    const rank = betterPlayers[0].count + 1;

    // 3. Fetch Registered Events
    const myEvents = await db.select({
        event: events,
        reg: registrations,
        team: teams
    })
        .from(registrations)
        .innerJoin(events, eq(registrations.eventId, events.id))
        .leftJoin(teams, eq(registrations.teamId, teams.id))
        .where(eq(registrations.userId, userId))
        .orderBy(desc(registrations.createdAt));

    // 4. Fetch Recent Activity (Approved Checkpoints)
    const recentActivity = await db.select({
        checkpoint: checkpoints,
        event: events
    })
        .from(checkpoints)
        .innerJoin(registrations, eq(checkpoints.registrationId, registrations.id))
        .innerJoin(events, eq(registrations.eventId, events.id))
        .where(and(
            eq(registrations.userId, userId),
            eq(checkpoints.isApproved, true)
        ))
        .orderBy(desc(checkpoints.createdAt))
        .limit(5);

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/20 rounded-2xl p-4 md:p-8 border border-white/10 flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <Avatar className="size-24 md:size-32 border-4 border-cyan-500/30">
                    <AvatarImage src={user.image || ''} />
                    <AvatarFallback className="text-4xl font-bold bg-cyan-950 text-cyan-400">
                        {user.name?.[0] || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left flex-1 space-y-2">
                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4">
                        <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                        <Badge variant="secondary" className="capitalize border-cyan-500/30 text-cyan-400">{user.role}</Badge>
                    </div>
                    <p className="text-gray-400 text-sm md:text-base">{user.email}</p>
                    <p className="text-xs text-gray-500">Joined {new Date(user.createdAt!).toLocaleDateString()}</p>
                </div>
                {/* Quick Stats on Hero */}
                <div className="flex w-full md:w-auto justify-around md:justify-start gap-4 md:gap-8 text-center bg-black/20 p-4 md:p-6 rounded-xl border border-white/5">
                    <div>
                        <div className="text-2xl md:text-3xl font-black text-cyan-400">{user.xpPoints}</div>
                        <div className="text-[10px] md:text-xs uppercase tracking-wider text-gray-500 font-semibold">Total XP</div>
                    </div>
                    <div>
                        <div className="text-2xl md:text-3xl font-black text-yellow-400">#{rank}</div>
                        <div className="text-[10px] md:text-xs uppercase tracking-wider text-gray-500 font-semibold">Global Rank</div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 md:gap-8">
                {/* Left Column: Stats & Events */}
                <div className="md:col-span-2 space-y-8">
                    {/* Events List */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Calendar className="size-5 text-cyan-400" /> My Events
                        </h2>
                        {myEvents.length === 0 ? (
                            <Card className="bg-white/5 border-white/10 p-8 text-center text-gray-500">
                                <p>You haven't joined any events yet.</p>
                                <Link href="/dashboard/events">
                                    <Button variant="link" className="text-cyan-400">Explore Events</Button>
                                </Link>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {myEvents.map(({ event, reg, team }) => (
                                    <Link key={event.id} href={`/dashboard/events/${event.slug}`}>
                                        <Card className="bg-white/5 border-white/10 hover:border-cyan-500/50 transition-colors group">
                                            <CardContent className="p-4 flex items-center gap-4">
                                                <div className="size-12 rounded-lg bg-gradient-to-br from-cyan-900 to-blue-900 flex items-center justify-center text-cyan-400 font-bold">
                                                    {event.title[0]}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold group-hover:text-cyan-400 transition-colors">{event.title}</h3>
                                                    <div className="flex gap-2 text-xs text-gray-400 mt-1">
                                                        <Badge variant="outline" className="text-[10px] h-5 border-gray-600 px-1">{event.type}</Badge>
                                                        {team && <span className="text-gray-500">Team: {team.name}</span>}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge className={reg.status === 'accepted' ? 'bg-green-900/50 text-green-400 hover:bg-green-900/50' : 'bg-yellow-900/50 text-yellow-500 hover:bg-yellow-900/50'}>
                                                        {reg.status}
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Recent Activity */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Activity className="size-5 text-purple-400" /> Recent Activity
                    </h2>
                    <Card className="bg-white/5 border-white/10 min-h-[300px]">
                        <CardContent className="p-4 space-y-6">
                            {recentActivity.length === 0 ? (
                                <p className="text-center text-gray-500 py-8 text-sm">No recent activity. Start submitting checkpoints!</p>
                            ) : (
                                recentActivity.map((act) => (
                                    <div key={act.checkpoint.id} className="relative pl-6 border-l border-white/10 pb-2 last:pb-0">
                                        <div className="absolute -left-[5px] top-1 size-2.5 rounded-full bg-green-500 animate-pulse" />
                                        <div className="text-sm font-medium text-white mb-1">
                                            Completed Checkpoint
                                        </div>
                                        <p className="text-xs text-gray-400 line-clamp-2">
                                            {act.event.title} • Week {act.checkpoint.weekNumber}
                                        </p>
                                        <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-green-400">
                                            <Star className="size-3 fill-green-400" /> +100 XP
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Achievement Placeholder */}
                    <Card className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-yellow-500 flex items-center gap-2">
                                <Trophy className="size-4" /> Next Milestone
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white mb-1">Level 2</div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full mt-2">
                                <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '45%' }} />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">450 / 1000 XP</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
