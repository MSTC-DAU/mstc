import { db } from "@/lib/db";
import { users, events, registrations, eventStatusEnum } from "@/db/schema";
import { count, eq, gt, desc, and } from "drizzle-orm";

/**
 * Fetches statistics for a specific user (User Dashboard).
 */
export async function getUserStats(userId: string) {
    if (!userId) return null;

    // 1. Get User Data (XP)
    const [user] = await db
        .select({
            xpPoints: users.xpPoints,
            collegeId: users.collegeId,
            email: users.email,
        })
        .from(users)
        .where(eq(users.id, userId));

    if (!user) return null;

    const currentXp = user.xpPoints || 0;

    // 2. Calculate Global Rank (Count users with strictly more XP)
    // Rank = (Users with > XP) + 1
    const [rankData] = await db
        .select({ count: count() })
        .from(users)
        .where(gt(users.xpPoints, currentXp));

    const globalRank = (rankData?.count || 0) + 1;

    // 3. Count User Registrations (Events joined)
    const [regData] = await db
        .select({ count: count() })
        .from(registrations)
        .where(eq(registrations.userId, userId));

    const eventsCount = regData?.count || 0;

    // 4. Determine Activity Status
    // Simple logic: If they have registered for at least one event -> "High", else "Low"
    // In future, could check timestamps.
    const activityLevel = eventsCount > 0 ? "High" : "Low";

    return {
        xpPoints: currentXp.toLocaleString(),
        globalRank: `#${globalRank}`,
        eventsCount: eventsCount.toString(),
        activityLevel,
        collegeId: user.collegeId,
        email: user.email,
    };
}

/**
 * Fetches recent activity for a user (registrations).
 */
export async function getUserRecentActivity(userId: string) {
    if (!userId) return [];

    const recentRegs = await db
        .select({
            id: registrations.id,
            status: registrations.status,
            createdAt: registrations.createdAt,
            eventTitle: events.title,
            eventSlug: events.slug,
            xpReward: events.config // Assuming we might store XP reward generic or logic elsewhere, simplified for now
        })
        .from(registrations)
        .leftJoin(events, eq(registrations.eventId, events.id))
        .where(eq(registrations.userId, userId))
        .orderBy(desc(registrations.createdAt))
        .limit(3);

    return recentRegs;
}

/**
 * Fetches aggregate statistics for the Admin Dashboard.
 */
export async function getAdminStats() {
    // 1. Total Users
    const [usersData] = await db.select({ count: count() }).from(users);

    // 2. Total Registrations
    const [regsData] = await db.select({ count: count() }).from(registrations);

    // 3. Active Events (Status = 'live' or 'upcoming')
    const [activeEventsData] = await db
        .select({ count: count() })
        .from(events)
        .where(and(
            eq(events.status, 'live') // Or upcoming
        ));

    // 4. Pending Approvals (Pending registrations)
    const [pendingRegsData] = await db
        .select({ count: count() })
        .from(registrations)
        .where(eq(registrations.status, 'pending'));

    return {
        totalUsers: usersData?.count || 0,
        totalRegistrations: regsData?.count || 0,
        activeEvents: activeEventsData?.count || 0,
        pendingApprovals: pendingRegsData?.count || 0
    };
}

/**
 * Fetches all events for the public events log.
 */
export async function getEvents() {
    return await db.select().from(events).orderBy(desc(events.createdAt));
}
