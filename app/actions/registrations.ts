
'use server';

import { db } from '@/lib/db';
import { registrations, teams, events, users, checkpoints } from '@/db/schema'; // Added events, users
import { eq, and } from 'drizzle-orm'; // Added eq, and
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { nanoid } from 'nanoid';

export async function registerForEvent(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: 'You must be logged in to register.' };
    }

    const eventId = formData.get('eventId') as string;
    const teamMode = formData.get('teamMode') as 'create' | 'join' | 'solo';
    const rawData = Object.fromEntries(formData.entries());

    // 1. Check if Event Exists & Get Config (for maxTeamSize)
    const event = await db.query.events.findFirst({
        where: eq(events.id, eventId),
        columns: { config: true }
    });

    if (!event) return { message: 'Event not found.' };

    const maxTeamSize = event.config?.maxTeamSize || 4; // Default to 4 if not set

    // 2. Check if User is ALREADY registered
    const existingReg = await db.query.registrations.findFirst({
        where: and(
            eq(registrations.userId, session.user.id),
            eq(registrations.eventId, eventId)
        )
    });

    if (existingReg) {
        return { message: 'You are already registered for this event.' };
    }

    let teamId: string;
    let finalMessage = 'Success! You are registered.';

    try {
        if (teamMode === 'join') {
            // --- JOIN EXISTING TEAM ---
            const joinCode = (formData.get('joinCode') as string)?.trim().toUpperCase();
            if (!joinCode) return { message: 'Please enter a valid join code.' };

            const team = await db.query.teams.findFirst({
                where: and(
                    eq(teams.joinCode, joinCode),
                    eq(teams.eventId, eventId) // Ensure code belongs to THIS event
                )
            });

            if (!team) return { message: 'Invalid Join Code. Team not found.' };

            // Check Size Limit
            const members = await db.select().from(registrations).where(eq(registrations.teamId, team.id));
            if (members.length >= maxTeamSize) {
                return { message: `Team is full! Max size is ${maxTeamSize}.` };
            }

            teamId = team.id;
            finalMessage = `Joined team "${team.name}" successfully!`;

            teamId = team.id;
            finalMessage = `Joined team "${team.name}" successfully!`;

        } else if (teamMode === 'solo') {
            // --- SOLO REGISTRATION (Auto-create team) ---
            const teamName = session.user.name || 'Solo Participant';
            const teamCode = nanoid(6).toUpperCase();

            const [newTeam] = await db.insert(teams).values({
                name: teamName,
                joinCode: teamCode,
                eventId: eventId,
                createdBy: session.user.id,
            }).returning();

            teamId = newTeam.id;
            finalMessage = 'Registration Successful!';

        } else {
            // --- CREATE NEW TEAM ---
            const teamName = formData.get('teamName') as string || `${session.user.name}'s Team`;
            const teamCode = nanoid(6).toUpperCase();

            // Insert Team
            const [newTeam] = await db.insert(teams).values({
                name: teamName,
                joinCode: teamCode,
                eventId: eventId,
                createdBy: session.user.id,
            }).returning();

            teamId = newTeam.id;
            finalMessage = `Team created! Your Join Code is: ${teamCode}`;
        }

        // 3. Create Registration linked to Team
        // Cleanup raw data
        const submissionData = { ...rawData };
        delete submissionData.eventId;
        delete submissionData.teamMode;
        delete submissionData.teamName;
        delete submissionData.joinCode;
        delete submissionData.$ACTION_REF_1;
        delete submissionData.priority_1;
        delete submissionData.priority_2;
        delete submissionData.priority_3;

        // Extract Priorities
        const priorities = [];
        if (formData.get('priority_1')) priorities.push(formData.get('priority_1') as string);
        if (formData.get('priority_2')) priorities.push(formData.get('priority_2') as string);
        if (formData.get('priority_3')) priorities.push(formData.get('priority_3') as string);

        await db.insert(registrations).values({
            userId: session.user.id,
            eventId: eventId,
            teamId: teamId,
            customAnswers: submissionData,
            domainPriorities: priorities.length > 0 ? priorities : null, // Save priorities
            status: 'pending',
        });

    } catch (e) {
        console.error('Registration error:', e);
        return { message: 'Failed to process registration. Please try again.' };
    }

    revalidatePath(`/dashboard/events`);
    return { message: finalMessage, success: true };
}

export async function assignDomain(registrationId: string, domain: string) {
    const session = await auth();
    if (!session?.user?.id) return { message: 'Unauthorized', success: false };

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id)
    });

    if (!user || !['convener', 'deputy_convener', 'core_member', 'member'].includes(user.role || '')) {
        return { message: 'Unauthorized', success: false };
    }

    try {
        await db.update(registrations)
            .set({ assignedDomain: domain })
            .where(eq(registrations.id, registrationId));

        revalidatePath('/admin/events');
        return { message: `Assigned to ${domain}`, success: true };
    } catch (e) {
        console.error(e);
        return { message: 'Failed to assign domain', success: false };
    }
}

export async function removeParticipant(registrationId: string) {
    const session = await auth();
    if (!session?.user?.id) return { message: 'Unauthorized', success: false };

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id)
    });

    if (user?.role !== 'convener') {
        return { message: 'Unauthorized: Only Conveners can remove participants.', success: false };
    }

    try {
        // 1. Delete their checkpoints first
        await db.delete(checkpoints).where(eq(checkpoints.registrationId, registrationId));

        // 2. Delete the registration
        await db.delete(registrations).where(eq(registrations.id, registrationId));

        revalidatePath('/admin/events');
        return { message: 'Participant removed successfully', success: true };
    } catch (e) {
        console.error('Remove participant error:', e);
        return { message: 'Failed to remove participant', success: false };
    }
}
