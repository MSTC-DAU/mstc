
import { db } from '@/lib/db';
import { events, teams, eventAwards, registrations } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AwardAssignForm } from '@/components/admin/award-assign-form';
import { Trophy } from 'lucide-react';
import { RemoveAwardButton } from '@/components/admin/remove-award-button';

export const dynamic = 'force-dynamic';

export default async function AwardsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await db.query.events.findFirst({ where: eq(events.id, id) });
    if (!event) return notFound();

    const eventTeams = await db.query.teams.findMany({
        where: eq(teams.eventId, id)
    });

    const eventUsers = await db.query.registrations.findMany({
        where: eq(registrations.eventId, id),
        with: { user: true }
    });

    const awards = await db.query.eventAwards.findMany({
        where: eq(eventAwards.eventId, id),
        with: {
            team: true,
            user: true
        },
        orderBy: [asc(eventAwards.rank)]
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Winner Declaration</h1>
                <p className="text-gray-400">Assign official awards for <span className="text-cyan-400">{event.title}</span>.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Assignment Form */}
                <Card className="bg-white/5 border-white/10 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Trophy className="size-5 text-yellow-500" /> New Award
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AwardAssignForm eventId={id} teams={eventTeams} users={eventUsers.map(r => r.user)} />
                    </CardContent>
                </Card>

                {/* Current Winners List */}
                {/* Current Winners List */}
                <div className="space-y-8">
                    <h3 className="text-xl font-bold">Hall of Fame</h3>
                    {awards.length === 0 ? (
                        <p className="text-gray-500 italic">No awards assigned yet.</p>
                    ) : (
                        Object.entries(awards.reduce((acc, award) => {
                            const cat = award.category || 'Overall';
                            if (!acc[cat]) acc[cat] = [];
                            acc[cat].push(award);
                            return acc;
                        }, {} as Record<string, typeof awards>)).map(([category, categoryAwards]) => (
                            <div key={category} className="space-y-4">
                                <h4 className="text-lg font-semibold uppercase tracking-wider text-cyan-500 border-b border-white/10 pb-2">{category}</h4>
                                <div className="grid gap-4">
                                    {categoryAwards.map((award) => {
                                        // Dynamic Colors based on Rank
                                        const rankColors = {
                                            1: 'from-yellow-900/10 to-transparent border-yellow-500/20 text-yellow-500 bg-yellow-500/10',
                                            2: 'from-slate-800/20 to-transparent border-slate-400/20 text-slate-300 bg-slate-400/10', // Silver
                                            3: 'from-orange-900/10 to-transparent border-orange-700/20 text-orange-600 bg-orange-700/10', // Bronze
                                        }[award.rank] || 'from-blue-900/10 to-transparent border-blue-500/20 text-blue-400 bg-blue-500/10'; // Default

                                        return (
                                            <Card key={award.id} className={`bg-gradient-to-r ${rankColors}`}>
                                                <CardContent className="p-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`size-10 rounded-full flex items-center justify-center font-bold text-lg border ${rankColors.split(' ')[2]} ${rankColors.split(' ')[3]}`}>
                                                            {award.rank}
                                                        </div>
                                                        <div>
                                                            <h4 className={`font-bold ${rankColors.split(' ')[3].replace('bg-', 'text-').replace('/10', '')}`}>{award.title}</h4>
                                                            <p className="text-sm text-gray-400">
                                                                {award.team ? `Team ${award.team.name}` : award.user?.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <RemoveAwardButton awardId={award.id} eventId={id} />
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
