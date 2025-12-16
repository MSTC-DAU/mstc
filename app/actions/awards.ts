
'use server';

import { db } from '@/lib/db';
import { eventAwards, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

// Helper for auth check
async function canManageAwards() {
    const session = await auth();
    if (!session?.user?.id) return false;
    const user = await db.query.users.findFirst({ where: eq(users.id, session.user.id) });
    // Convener, Deputy, Core can likely assign awards.
    return user && ['convener', 'deputy_convener', 'core_member'].includes(user.role || '');
}

export async function assignAward(eventId: string, title: string, rank: number, teamId?: string, userId?: string, description?: string, category?: string) {
    if (!await canManageAwards()) return { success: false, message: "Unauthorized" };

    try {
        await db.insert(eventAwards).values({
            eventId,
            title,
            rank,
            teamId, // One of these should be set if using TS properly, but we passed undefined.
            userId,
            description,
            category: category || 'Overall' // Default to Overall
        });

        revalidatePath(`/admin/events/${eventId}/awards`);
        revalidatePath(`/dashboard/events`);
        return { success: true, message: "Award assigned successfully" };
    } catch (e) {
        console.error(e);
        return { success: false, message: "Failed to assign award" };
    }
}

export async function removeAward(awardId: string, eventId: string) {
    if (!await canManageAwards()) return { success: false, message: "Unauthorized" };

    try {
        await db.delete(eventAwards).where(eq(eventAwards.id, awardId));
        revalidatePath(`/admin/events/${eventId}/awards`);
        return { success: true, message: "Award removed" };
    } catch (e) {
        return { success: false, message: "Failed to remove award" };
    }
}
