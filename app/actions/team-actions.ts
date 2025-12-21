'use server';

import { db } from '@/lib/db';
import { mentors, teamPhotos } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// --- Mentors ---

export async function addMentor(formData: FormData) {
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const image = formData.get('image') as string;
    const linkedinId = formData.get('linkedinId') as string;
    const githubId = formData.get('githubId') as string;

    if (!name || !role) {
        throw new Error('Name and Role are required');
    }

    await db.insert(mentors).values({
        name,
        role,
        image: image || null,
        linkedinId: linkedinId || null,
        githubId: githubId || null,
    });

    revalidatePath('/team');
    revalidatePath('/admin/team');
}

export async function deleteMentor(id: string) {
    await db.delete(mentors).where(eq(mentors.id, id));
    revalidatePath('/team');
    revalidatePath('/admin/team');
}

// --- Team Header Photo ---

export async function setTeamHeaderPhoto(url: string) {
    if (!url) throw new Error('URL is required');

    // Simple approach: Insert new one, set as header.
    // Ideally we might just have one active, or a single row config table.
    // For now, let's just insert one and we will fetch the latest one with `isHeader` or just latest created.

    // First, unmark all others? Or just insert and we always pick the latest.
    // Let's unmark all others to be clean.
    await db.update(teamPhotos).set({ isHeader: false });

    await db.insert(teamPhotos).values({
        url,
        isHeader: true,
        description: 'Team Header Photo',
    });

    revalidatePath('/team');
    revalidatePath('/admin/team');
}

export async function removeTeamHeaderPhoto() {
    await db.update(teamPhotos).set({ isHeader: false }).where(eq(teamPhotos.isHeader, true));
    revalidatePath('/team');
    revalidatePath('/admin/team');
}

export async function getTeamHeaderPhoto() {
    // Return the most recent one marked as header
    const photo = await db.query.teamPhotos.findFirst({
        where: (teamPhotos, { eq }) => eq(teamPhotos.isHeader, true),
        orderBy: (teamPhotos, { desc }) => [desc(teamPhotos.createdAt)],
    });
    return photo;
}

export async function getMentors() {
    return await db.query.mentors.findMany({
        orderBy: (mentors, { desc }) => [desc(mentors.createdAt)], // Or rank if we add it
    });
}
