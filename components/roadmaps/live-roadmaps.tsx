import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

interface LiveRoadmapsProps {
    roadmaps: any[];
}

export function LiveRoadmaps({ roadmaps }: LiveRoadmapsProps) {
    if (roadmaps.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white/5 border border-white/10 border-dashed rounded-xl text-center animate-in fade-in zoom-in duration-300">
                <div className="p-4 bg-white/5 rounded-full mb-4">
                    <Rocket className="size-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Active Event Roadmaps</h3>
                <p className="text-gray-400 max-w-md">
                    There are currently no specific roadmaps for live events.
                    Check back when a new hackathon or boot camp starts!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="size-5 text-green-400" /> Active Event Roadmaps
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {roadmaps.map((roadmap) => (
                        <Card key={roadmap.id} className="bg-white/5 border-white/10 hover:border-cyan-500/50 transition-colors group flex flex-col">
                            <CardHeader>
                                <div className="mb-4">
                                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                                        {roadmap.domain}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl group-hover:text-cyan-400 transition-colors">
                                    {roadmap.event?.title || 'Custom Roadmap'}
                                </CardTitle>
                                <CardDescription>
                                    Official roadmap for the linked event.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto">
                                <Button className="w-full bg-cyan-900/20 hover:bg-cyan-900/40 text-cyan-400 border border-cyan-500/20">
                                    View Details <ArrowRight className="ml-2 size-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
