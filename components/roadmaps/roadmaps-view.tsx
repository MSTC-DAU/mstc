'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, Zap, Loader2 } from 'lucide-react';
import { StaticRoadmaps } from './static-roadmaps';
import { LiveRoadmaps } from './live-roadmaps';
import { fetchLiveRoadmaps } from '@/app/actions/roadmaps';

export function RoadmapsView() {
    const [activeTab, setActiveTab] = useState<'static' | 'live'>('static');
    const [liveData, setLiveData] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSwitchToLive = async () => {
        setActiveTab('live');
        if (!liveData) {
            setLoading(true);
            try {
                // Determine if we need to fetch. 
                // We fetch if we don't have data yet.
                const data = await fetchLiveRoadmaps();
                setLiveData(data);
            } catch (error) {
                console.error("Failed to fetch live roadmaps", error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Rocket className="size-8 text-cyan-400" /> Learning Roadmaps
                    </h1>
                    <p className="text-gray-400">
                        Curated paths to help you master new technologies and domains.
                    </p>
                </div>

                {/* Tabs Switcher */}
                <div className="flex p-1 bg-white/5 border border-white/10 rounded-lg">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('static')}
                        className={`${activeTab === 'static' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-white/5'} transition-all`}
                    >
                        Standard Roadmaps
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSwitchToLive}
                        className={`${activeTab === 'live' ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white hover:bg-white/5'} transition-all`}
                    >
                        <Zap className="size-4 mr-2" /> Live Events
                    </Button>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="min-h-[400px]">
                {activeTab === 'static' ? (
                    <StaticRoadmaps />
                ) : (
                    <>
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="size-8 text-green-400 animate-spin" />
                            </div>
                        ) : (
                            <LiveRoadmaps roadmaps={liveData || []} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
