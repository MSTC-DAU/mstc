'use server';

import { db } from '@/lib/db';
import { systemSettings, users } from '@/db/schema'; // Ensure systemSettings is exported from schema
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function getSystemSetting(key: string) {
    try {
        const setting = await db.query.systemSettings.findFirst({
            where: eq(systemSettings.key, key)
        });
        return setting?.value || null;
    } catch (e) {
        console.error("Failed to fetch setting:", key, e);
        return null;
    }
}

export async function updateSystemSetting(key: string, value: string, description?: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, message: "Unauthorized" };

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id)
    });

    if (!user || (user.role !== 'convener' && user.role !== 'deputy_convener')) {
        return { success: false, message: "Unauthorized: Insufficient permissions." };
    }

    try {
        await db.insert(systemSettings).values({
            key,
            value,
            description
        }).onConflictDoUpdate({
            target: systemSettings.key,
            set: { value, description }
        });

        revalidatePath('/team');
        revalidatePath('/admin/settings');
        return { success: true, message: "Setting updated successfully." };
    } catch (e) {
        console.error("Failed to update setting:", e);
        return { success: false, message: "Failed to update setting." };
    }
}
