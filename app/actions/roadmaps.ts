'use server';

import { db } from '@/lib/db';

export async function fetchLiveRoadmaps() {
    try {
        const roadmaps = await db.query.roadmaps.findMany({
            with: {
                event: true
            }
        });
        return roadmaps;
    } catch (error) {
        console.error('Failed to fetch live roadmaps:', error);
        return [];
    }
}
