
'use server';

import { db } from '@/lib/db';
import { events, users, roadmaps } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth'; // Added import
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createEvent(prevState: any, formData: FormData) {
    // Extract primitive fields
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const type = formData.get('type') as any;
    const startDate = formData.get('startDate') ? new Date(formData.get('startDate') as string) : null;
    const endDate = formData.get('endDate') ? new Date(formData.get('endDate') as string) : null;
    const registrationStartDate = formData.get('registrationStartDate') ? new Date(formData.get('registrationStartDate') as string) : null;
    const registrationEndDate = formData.get('registrationEndDate') ? new Date(formData.get('registrationEndDate') as string) : null;
    const posterUrl = formData.get('posterUrl') as string;
    const configRaw = formData.get('config') as string;
    const config = configRaw ? JSON.parse(configRaw) : {};
    const availableDomainsRaw = formData.get('availableDomains') as string;
    let availableDomains: string[] = [];
    if (availableDomainsRaw) {
        try {
            availableDomains = JSON.parse(availableDomainsRaw);
        } catch (e) {
            console.error("Failed to parse availableDomains", e);
        }
    }

    // ... (rest of auth checks)



    try {
        const [newEvent] = await db.insert(events).values({
            title,
            slug,
            type,
            status: 'upcoming',
            posterUrl,
            startDate,
            endDate,
            registrationStartDate,
            registrationEndDate,
            config: config // Use the parsed config directly
        }).returning({ id: events.id });

        if (availableDomains.length > 0 && newEvent) {
            await Promise.all(availableDomains.map(domain =>
                db.insert(roadmaps).values({
                    eventId: newEvent.id,
                    domain: domain,
                    content: [],
                })
            ));
        }
        return { message: 'Event created successfully!', success: true };
    } catch (e) {
        console.error(e);
        return { message: 'Failed to create event', success: false };
    }

    revalidatePath('/admin/events');
    redirect('/admin/events');
}
