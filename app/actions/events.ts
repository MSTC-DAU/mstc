
'use server';

import { db } from '@/lib/db';
import { events, users, roadmaps, checkpoints, eventAwards, registrations, teams } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
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
    const theme = formData.get('theme') as string || 'default';
    const description = formData.get('description') as string;
    const rules = formData.get('rules') as string;
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
            theme,
            description,
            rules,
            startDate,
            endDate,
            registrationStartDate,
            registrationEndDate,
            config: config, // Use the parsed config directly
            timeline: formData.get('timeline') ? JSON.parse(formData.get('timeline') as string) : []
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

export async function deleteEvent(eventId: string) {
    const session = await auth();
    if (!session?.user?.id) return { message: 'Unauthorized', success: false };

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id)
    });

    if (user?.role !== 'convener') {
        return { message: 'Unauthorized: Only Conveners can delete events.', success: false };
    }

    try {
        await db.transaction(async (tx) => {
            // 1. Delete Awards
            await tx.delete(eventAwards).where(eq(eventAwards.eventId, eventId));

            // 2. Delete Roadmaps
            await tx.delete(roadmaps).where(eq(roadmaps.eventId, eventId));

            // 3. Delete Checkpoints (Need to find registration IDs first)
            // Get registrations for this event to delete their checkpoints
            const eventRegs = await tx.select({ id: registrations.id }).from(registrations).where(eq(registrations.eventId, eventId));
            const regIds = eventRegs.map(r => r.id);

            if (regIds.length > 0) {
                // Use inArray only if we have IDs, otherwise it throws error
                await tx.delete(checkpoints).where(inArray(checkpoints.registrationId, regIds));
            }

            // 4. Delete Registrations
            await tx.delete(registrations).where(eq(registrations.eventId, eventId));

            // 5. Delete Teams
            await tx.delete(teams).where(eq(teams.eventId, eventId));

            // 6. Delete Event
            await tx.delete(events).where(eq(events.id, eventId));
        });

        revalidatePath('/admin/events');
        return { message: 'Event deleted successfully', success: true };
    } catch (e) {
        console.error('Delete event error:', e);
        return { message: 'Failed to delete event. Check console.', success: false };
    }
}
