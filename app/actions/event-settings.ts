
'use server';

import { db } from '@/lib/db';
import { events, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function updateEventSettings(eventId: string, formData: FormData) {
    const status = formData.get('status') as any;
    const startDate = formData.get('startDate') ? new Date(formData.get('startDate') as string) : null;
    const endDate = formData.get('endDate') ? new Date(formData.get('endDate') as string) : null;
    const registrationStartDate = formData.get('registrationStartDate') ? new Date(formData.get('registrationStartDate') as string) : null;
    const registrationEndDate = formData.get('registrationEndDate') ? new Date(formData.get('registrationEndDate') as string) : null;
    const posterUrl = formData.get('posterUrl') as string;
    const theme = formData.get('theme') as string;
    const description = formData.get('description') as string;
    const rules = formData.get('rules') as string;

    const session = await auth();

    if (!session?.user?.id) {
        return { message: 'Unauthorized', success: false };
    }

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (!user || !['convener', 'deputy_convener', 'core_member', 'member'].includes(user.role || '')) {
        return { message: 'Unauthorized: You do not have permission to manage events.', success: false };
    }

    try {
        await db.update(events)
            .set({
                status,
                startDate,
                endDate,
                registrationStartDate,
                registrationEndDate,
                posterUrl,
                theme,
                description,
                rules,
                timeline: formData.get('timeline') ? JSON.parse(formData.get('timeline') as string) : undefined
            })
            .where(eq(events.id, eventId));

        revalidatePath(`/admin/events/${eventId}`);
        revalidatePath('/admin/events');
        return { message: 'Event settings updated successfully', success: true };
    } catch (e) {
        console.error(e);
        return { message: 'Failed to update event', success: false };
    }
}
