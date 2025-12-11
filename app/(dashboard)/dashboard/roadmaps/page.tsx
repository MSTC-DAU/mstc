import { auth } from '@/auth';
import { db } from '@/lib/db';
import { roadmaps } from '@/db/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Code,
    Smartphone,
    Brain,
    Server,
    Terminal,
    Cpu,
    Link as LinkIcon,
    Layout,
    Rocket,
    ArrowRight,
    Sparkles,
    Database
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function RoadmapsPage() {
    const session = await auth();

    // Fetch roadmaps from DB (Keep this for future dynamic/custom roadmaps)
    const dbRoadmaps = await db.query.roadmaps.findMany({
        with: {
            event: true
        }
    }) as any[];

    // User provided roadmaps
    const bigRoadmaps = [
        {
            id: 'mern',
            title: 'MERN Stack',
            description: 'Master MongoDB, Express, React, and Node.js.',
            icon: Database,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-500/20',
            href: 'https://msoc-website.vercel.app/events'
        },
        {
            id: 'genai',
            title: 'Generative AI',
            description: 'Explore the frontier of AI generation and LLMs.',
            icon: Sparkles,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20',
            href: 'https://msoc-website.vercel.app/events'
        }
    ];

    const categoryRoadmaps = [
        {
            id: 'frontend',
            title: 'HTML, CSS, JS & React',
            description: 'The foundation of modern web development.',
            icon: Code,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20',
            href: 'https://msoc-website.vercel.app/html-css-js-react'
        },
        {
            id: 'nodejs',
            title: 'NodeJS Backend',
            description: 'Scalable server-side development with JavaScript.',
            icon: Server,
            color: 'text-green-400',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20',
            href: 'https://msoc-website.vercel.app/nodejs'
        },
        {
            id: 'flutter',
            title: 'Flutter App Dev',
            description: 'Build native apps for mobile, web, and desktop.',
            icon: Smartphone,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            href: 'https://msoc-website.vercel.app/flutter'
        },
        {
            id: 'python',
            title: 'Python Programming',
            description: 'Versatile programming for web, data, and scripts.',
            icon: Terminal,
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/20',
            href: 'https://msoc-website.vercel.app/python'
        },
        {
            id: 'dsa',
            title: 'CP & DSA',
            description: 'Master algorithms and ace coding interviews.',
            icon: Cpu,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            href: 'https://msoc-website.vercel.app/cp-dsa'
        },
        {
            id: 'blockchain',
            title: 'Blockchain & Web3',
            description: 'Decentralized applications and smart contracts.',
            icon: LinkIcon,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/20',
            href: 'https://msoc-website.vercel.app/blockchain'
        },
        {
            id: 'ml-nlp',
            title: 'ML & NLP',
            description: 'Machine Learning and Natural Language Processing.',
            icon: Brain,
            color: 'text-pink-400',
            bg: 'bg-pink-500/10',
            border: 'border-pink-500/20',
            href: 'https://msoc-website.vercel.app/ml-nlp'
        },
        {
            id: 'django',
            title: 'Django Framework',
            description: 'The web framework for perfectionists with deadlines.',
            icon: Layout,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            href: 'https://msoc-website.vercel.app/django'
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Rocket className="size-8 text-cyan-400" /> Learning Roadmaps
                </h1>
                <p className="text-gray-400">
                    Curated paths to help you master new technologies and domains.
                </p>
            </div>

            {/* Featured / Big Roadmaps */}
            <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="size-5 text-yellow-400" /> Featured Paths
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                    {bigRoadmaps.map((roadmap) => (
                        <Card key={roadmap.id} className={`bg-gradient-to-br from-black to-white/5 border hover:border-opacity-50 transition-colors group ${roadmap.border}`}>
                            <CardHeader>
                                <div className={`size-12 rounded-lg flex items-center justify-center mb-4 ${roadmap.bg}`}>
                                    <roadmap.icon className={`size-6 ${roadmap.color}`} />
                                </div>
                                <CardTitle className="text-2xl group-hover:text-white transition-colors">
                                    {roadmap.title}
                                </CardTitle>
                                <CardDescription className="text-base">
                                    {roadmap.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto">
                                <Link href={roadmap.href} target="_blank">
                                    <Button className={`w-full gap-2 ${roadmap.bg} ${roadmap.color} hover:text-white hover:bg-white/10 border border-white/5`}>
                                        View Roadmap <ArrowRight className="size-4" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Standard Category Roadmaps */}
            <div>
                <h2 className="text-xl font-bold mb-4">Domain Tracks</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {/* Render User Provided Roadmaps */}
                    {categoryRoadmaps.map((roadmap) => (
                        <Card key={roadmap.id} className={`bg-white/5 border-white/10 hover:border-white/20 transition-colors group flex flex-col`}>
                            <CardHeader className="pb-3">
                                <div className={`size-10 rounded-lg flex items-center justify-center mb-3 ${roadmap.bg}`}>
                                    <roadmap.icon className={`size-5 ${roadmap.color}`} />
                                </div>
                                <CardTitle className="text-lg group-hover:text-white transition-colors">
                                    {roadmap.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 text-xs">
                                    {roadmap.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto pt-0">
                                <Link href={roadmap.href} target="_blank">
                                    <Button variant="ghost" className="w-full justify-between text-gray-400 hover:text-white hover:bg-white/5 text-sm h-8 px-2">
                                        Start Learning <ArrowRight className="size-3" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Render DB Roadmaps appended for now if any exist */}
                    {dbRoadmaps.map((roadmap) => (
                        <Card key={roadmap.id} className="bg-white/5 border-white/10 hover:border-cyan-500/50 transition-colors group flex flex-col">
                            <CardHeader className="pb-3">
                                <div className="mb-3">
                                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-[10px%">
                                        {roadmap.domain}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg group-hover:text-cyan-400 transition-colors">
                                    {roadmap.event?.title || 'Custom Roadmap'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="mt-auto pt-0">
                                {/* Future: Link to dynamic roadmap viewer */}
                                <Button variant="ghost" className="w-full justify-between text-cyan-400 hover:bg-cyan-900/10 text-sm h-8 px-2">
                                    View Details <ArrowRight className="size-3" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
