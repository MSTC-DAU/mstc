
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Save, ChevronRight, ChevronDown } from 'lucide-react';
import { saveRoadmap, deleteRoadmapDomain } from '@/app/actions/roadmaps';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


interface Task {
    id: string;
    title: string;
    description: string;
    resources?: string[];
}

interface Week {
    id: number;
    title: string;
    tasks: Task[];
}

// Client component to manage the structure.
// This is a complex form. Ideally we'd use a reducer, but state is fine for MVC.
export default function RoadmapBuilder({ eventId, initialRoadmaps }: { eventId: string, initialRoadmaps: any[] }) {
    // Local state for the "Active" domain being edited
    const [domains, setDomains] = useState<any[]>(initialRoadmaps);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setDomains(initialRoadmaps);
    }, [initialRoadmaps]);

    // Editing State
    const [activeDomain, setActiveDomain] = useState<string>('');
    const [weeks, setWeeks] = useState<Week[]>([]);

    const handleSelectDomain = (roadmap: any) => {
        setActiveDomain(roadmap.domain);
        setWeeks(roadmap.content || []);
    };

    const handleNewDomain = () => {
        const name = prompt("Enter Domain Name (e.g. Web Development):");
        if (!name) return;
        setActiveDomain(name);
        setWeeks([{ id: 1, title: 'Week 1', tasks: [] }]); // Start with Week 1
    };

    const handleDeleteDomain = async (e: React.MouseEvent, roadmapId: string, domainName: string) => {
        e.stopPropagation();
        if (!confirm(`Are you sure you want to delete the "${domainName}" roadmap? This cannot be undone.`)) return;

        const res = await deleteRoadmapDomain(roadmapId);
        if (res.success) {
            toast.success(res.message);
            router.refresh();
            const newDomains = domains.filter(d => d.id !== roadmapId);
            setDomains(newDomains);
            if (activeDomain === domainName) {
                setActiveDomain('');
                setWeeks([]);
            }
        } else {
            toast.error(res.message);
        }
    };

    const handleSave = async () => {
        if (!activeDomain) return;
        setLoading(true);
        const res = await saveRoadmap(eventId, activeDomain, weeks);
        setLoading(false);
        if (res.success) {
            toast.success(res.message);
            router.refresh();
        } else {
            toast.error(res.message);
        }
    };

    const addWeek = () => {
        setWeeks([...weeks, { id: weeks.length + 1, title: `Week ${weeks.length + 1}`, tasks: [] }]);
    };

    const deleteWeek = (weekId: number) => {
        if (!confirm('Delete this week and all its tasks?')) return;
        setWeeks(weeks.filter(w => w.id !== weekId));
    };

    const addTask = (weekId: number) => {
        setWeeks(weeks.map(w => {
            if (w.id === weekId) {
                return {
                    ...w,
                    tasks: [...w.tasks, { id: crypto.randomUUID(), title: '', description: '' }]
                };
            }
            return w;
        }));
    };

    const deleteTask = (weekId: number, taskId: string) => {
        setWeeks(weeks.map(w => {
            if (w.id === weekId) {
                return {
                    ...w,
                    tasks: w.tasks.filter(t => t.id !== taskId)
                };
            }
            return w;
        }));
    };

    const updateTask = (weekId: number, taskId: string, field: keyof Task, value: string) => {
        setWeeks(weeks.map(w => {
            if (w.id === weekId) {
                return {
                    ...w,
                    tasks: w.tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t)
                };
            }
            return w;
        }));
    };

    return (
        <div className="grid grid-cols-12 gap-6">
            {/* Sidebar list of domains */}
            <div className="col-span-3 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-400">Domains</h3>
                    <Button onClick={handleNewDomain} size="sm" variant="outline"><Plus className="size-4" /></Button>
                </div>
                <div className="space-y-2">
                    {domains.map((r, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleSelectDomain(r)}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors group flex justify-between items-start ${activeDomain === r.domain ? 'bg-cyan-500/20 border-cyan-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        >
                            <div>
                                <div className="font-medium">{r.domain}</div>
                                <div className="text-xs text-gray-500">{Array.isArray(r.content) ? r.content.length : 0} Weeks</div>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => handleDeleteDomain(e, r.id, r.domain)}
                            >
                                <Trash2 className="size-3" />
                            </Button>
                        </div>
                    ))}
                    {activeDomain && !domains.find(d => d.domain === activeDomain) && (
                        <div className="p-3 rounded-lg border bg-cyan-500/20 border-cyan-500 font-medium">
                            {activeDomain} (Draft)
                        </div>
                    )}
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="col-span-9 bg-white/5 rounded-xl border border-white/10 p-6 min-h-[500px]">
                {!activeDomain ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <p>Select a domain or create a new one to start building.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                            <h2 className="text-2xl font-bold">{activeDomain} Roadmap</h2>
                            <Button onClick={handleSave} disabled={loading} className="gap-2 bg-green-600 hover:bg-green-700">
                                <Save className="size-4" /> Save Changes
                            </Button>
                        </div>

                        {/* Weeks */}
                        <div className="space-y-6">
                            {weeks.map((week, idx) => (
                                <Card key={week.id} className="bg-black/20 border-white/10">
                                    <CardHeader className="py-4 flex flex-row justify-between items-center">
                                        <CardTitle className="text-lg font-medium text-cyan-400">{week.title}</CardTitle>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-gray-500 hover:text-red-400"
                                            onClick={() => deleteWeek(week.id)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {week.tasks.map((task, tIdx) => (
                                            <div key={task.id} className="flex gap-4 items-start p-3 bg-white/5 rounded-md group">
                                                <div className="flex-1 space-y-2">
                                                    <Input
                                                        placeholder="Task Title (e.g. Learn React Basics)"
                                                        value={task.title}
                                                        onChange={(e) => updateTask(week.id, task.id, 'title', e.target.value)}
                                                        className="bg-black/20 border-transparent focus:border-cyan-500"
                                                    />
                                                    <textarea
                                                        placeholder="Description / Instructions..."
                                                        value={task.description}
                                                        onChange={(e) => updateTask(week.id, task.id, 'description', e.target.value)}
                                                        className="w-full bg-black/20 rounded-md p-2 text-sm text-gray-300 border border-transparent focus:border-cyan-500 focus:outline-none"
                                                        rows={2}
                                                    />
                                                </div>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => deleteTask(week.id, task.id)}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button onClick={() => addTask(week.id)} variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                            <Plus className="size-4 mr-2" /> Add Task
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Button onClick={addWeek} variant="outline" className="w-full border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-white">
                            <Plus className="size-4 mr-2" /> Add Week
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
