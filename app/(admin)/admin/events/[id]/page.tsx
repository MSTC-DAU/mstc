
import { db } from '@/lib/db';
import { events, registrations, teams, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Calendar, Activity, Map, CheckCircle2, Trophy } from 'lucide-react';
import { EditEventSettings } from '@/components/admin/edit-event-settings';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RegistrationDetailsDialog } from '@/components/admin/registration-details-dialog';
import { DeleteParticipantButton } from '@/components/admin/delete-participant-button';

export default async function AdminEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Await params for Next.js 15+ compatibility
    const { id } = await params;

    const event = await db.query.events.findFirst({
        where: eq(events.id, id)
    });

    if (!event) return notFound();

    // Fetch stats
    const allRegistrations = await db.select({
        reg: registrations,
        user: users,
        team: teams
    })
        .from(registrations)
        .leftJoin(users, eq(registrations.userId, users.id))
        .leftJoin(teams, eq(registrations.teamId, teams.id))
        .where(eq(registrations.eventId, id))
        .orderBy(desc(registrations.createdAt));

    const totalRegistrations = allRegistrations.length;
    const uniqueTeams = new Set(allRegistrations.map(r => r.team?.id).filter(Boolean)).size;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                    <div className="flex items-center gap-3 text-gray-400">
                        <span className="font-mono bg-white/5 px-2 py-1 rounded text-xs">ID: {event.id}</span>
                        <Badge variant="outline" className="capitalize border-blue-500/30 text-blue-400">{event.type}</Badge>
                        <Badge className={`${event.status === 'live' ? 'bg-green-600' : 'bg-gray-600'} capitalize`}>{event.status}</Badge>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/admin/events/${id}/roadmap`}>
                        <Button variant="outline" className="gap-2">
                            <Map className="size-4" /> Edit Roadmap
                        </Button>
                    </Link>
                    <Link href={`/admin/events/${id}/checkpoints`}>
                        <Button variant="outline" className="gap-2 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10">
                            <CheckCircle2 className="size-4" /> Reviews
                        </Button>
                    </Link>
                    <Link href={`/admin/events/${id}/awards`}>
                        <Button variant="outline" className="gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                            <Trophy className="size-4" /> Awards
                        </Button>
                    </Link>
                    <Link href={`/admin/events/${id}/registrations`}>
                        <Button className="gap-2 bg-cyan-600 hover:bg-cyan-700">
                            Manage Participants
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total Participants</CardTitle>
                        <Users className="h-4 w-4 text-cyan-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{totalRegistrations}</div>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Teams Formed</CardTitle>
                        <Shield className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{uniqueTeams}</div>
                        <p className="text-xs text-gray-500">Max size: {event.config?.maxTeamSize || 'N/A'}</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Start Date</CardTitle>
                        <Calendar className="h-4 w-4 text-orange-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold text-white">{event.startDate ? new Date(event.startDate).toLocaleDateString() : 'TBD'}</div>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Event Status</CardTitle>
                        <Activity className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold text-white capitalize">{event.status}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Registrations Table */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Recent Registrations</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-400 uppercase bg-black/20 text-xs">
                            <tr>
                                <th className="px-6 py-3">Participant</th>
                                <th className="px-6 py-3">Team</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-gray-300">
                            {allRegistrations.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No registrations yet.
                                    </td>
                                </tr>
                            ) : (
                                allRegistrations.map((row) => (
                                    <tr key={row.reg.id} className="hover:bg-white/5">
                                        <td className="px-6 py-4 font-medium text-white">
                                            {row.user?.name || 'Unknown'} <br />
                                            <span className="text-xs text-gray-500">{row.user?.email}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {row.team ? (
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-cyan-400">{row.team.name}</span>
                                                    <span className="text-xs text-gray-500 font-mono">CODE: {row.team.joinCode}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-600 italic">Solo / No Team</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            <Badge variant="outline" className={`capitalize ${row.reg.status === 'accepted' ? 'border-green-500/30 text-green-400' : 'border-yellow-500/30 text-yellow-500'
                                                }`}>
                                                {row.reg.status}
                                            </Badge>
                                            <RegistrationDetailsDialog registration={row} />
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {row.reg.createdAt ? new Date(row.reg.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DeleteParticipantButton registrationId={row.reg.id} name={row.user?.name || 'Unknown'} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Event Settings Section */}
            <EditEventSettings event={event} />
        </div>
    );
}
