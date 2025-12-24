
import { pgTable, uuid, text, integer, jsonb, timestamp, unique, pgEnum, boolean, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { type AdapterAccount } from "next-auth/adapters"

// Enums
export const roleEnum = pgEnum('role', ['student', 'member', 'core_member', 'deputy_convener', 'convener']);
export const eventTypeEnum = pgEnum('event_type', ['hackathon', 'cp_solo', 'cp_team', 'mentorship', 'team_event', 'solo_event']);
export const eventStatusEnum = pgEnum('event_status', ['upcoming', 'live', 'past']);

// Users Table
export const users = pgTable('user', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name'),
    email: text('email').notNull().unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    role: roleEnum('role').default('student'),
    collegeId: text('college_id'),
    bio: text('bio'),
    githubId: text('github_id'),
    linkedinId: text('linkedin_id'),
    xpPoints: integer('xp_points').default(0),
    createdAt: timestamp('created_at').defaultNow(),
});

// Accounts Table (Auth.js)
export const accounts = pgTable("account", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(), // Fix: Explicit type
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
}, (account) => ({
    compoundKey: unique().on(account.provider, account.providerAccountId),
}));

// Sessions Table (Auth.js)
export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Verification Tokens Table (Auth.js)
export const verificationTokens = pgTable("verificationToken", {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
}, (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
}));

// Events Table
export const events = pgTable('events', {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    type: eventTypeEnum('type').notNull(),
    status: eventStatusEnum('status').default('upcoming'),
    posterUrl: text('poster_url'),
    theme: text('theme').default('default'),
    description: text('description'),
    rules: text('rules'),
    startDate: timestamp('start_date'),
    endDate: timestamp('end_date'),
    registrationStartDate: timestamp('registration_start_date'),
    registrationEndDate: timestamp('registration_end_date'),
    config: jsonb('config').$type<{
        maxTeamSize?: number;
        registrationFields?: Array<{ name: string; label: string; type: string; }>;
        availableDomains?: string[];
    }>(),
    timeline: jsonb('timeline').$type<Array<{
        title: string;
        description: string;
        startDate: string; // ISO string
        endDate?: string; // ISO string
    }>>(),
    createdAt: timestamp('created_at').defaultNow(),
});

// Teams Table
export const teams = pgTable('teams', {
    id: uuid('id').defaultRandom().primaryKey(),
    eventId: uuid('event_id').references(() => events.id).notNull(),
    name: text('name').notNull(),
    joinCode: text('join_code').notNull(),
    createdBy: uuid('created_by').references(() => users.id).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

// Registrations Table
export const registrations = pgTable('registrations', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    eventId: uuid('event_id').references(() => events.id).notNull(),
    teamId: uuid('team_id').references(() => teams.id),
    customAnswers: jsonb('custom_answers'),
    domainPriorities: jsonb('domain_priorities').$type<string[]>(), // Top 3 choices
    assignedDomain: text('assigned_domain'), // Admin assigned domain
    status: text('status').default('pending'),
    createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
    uniqueUserEvent: unique().on(t.userId, t.eventId),
}));

// Roadmaps Table
export const roadmaps = pgTable('roadmaps', {
    id: uuid('id').defaultRandom().primaryKey(),
    eventId: uuid('event_id').references(() => events.id).notNull(),
    domain: text('domain').notNull(),
    content: jsonb('content'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Checkpoints Table
export const checkpoints = pgTable('checkpoints', {
    id: uuid('id').defaultRandom().primaryKey(),
    registrationId: uuid('registration_id').references(() => registrations.id).notNull(),
    weekNumber: integer('week_number').notNull(),
    submissionContent: text('submission_content'),
    mentorFeedback: text('mentor_feedback'),
    isApproved: boolean('is_approved'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Event Awards Table
export const eventAwards = pgTable('event_awards', {
    id: uuid('id').defaultRandom().primaryKey(),
    eventId: uuid('event_id').references(() => events.id).notNull(),
    teamId: uuid('team_id').references(() => teams.id),
    userId: uuid('user_id').references(() => users.id),
    title: text('title').notNull(), // e.g. "Winner", "Best UI"
    rank: integer('rank').notNull(), // 1, 2, 3
    description: text('description'),
    category: text('category'), // e.g. "Web", "App", "Design"
    createdAt: timestamp('created_at').defaultNow(),
});

export const eventAwardsRelations = relations(eventAwards, ({ one }) => ({
    team: one(teams, {
        fields: [eventAwards.teamId],
        references: [teams.id],
    }),
    user: one(users, {
        fields: [eventAwards.userId],
        references: [users.id],
    }),
    event: one(events, {
        fields: [eventAwards.eventId],
        references: [events.id],
    }),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
    registrations: many(registrations),
}));

export const registrationsRelations = relations(registrations, ({ one, many }) => ({
    team: one(teams, {
        fields: [registrations.teamId],
        references: [teams.id],
    }),
    user: one(users, {
        fields: [registrations.userId],
        references: [users.id],
    }),
    checkpoints: many(checkpoints),
    event: one(events, {
        fields: [registrations.eventId],
        references: [events.id],
    }),
}));
// Legacy Notes Table
export const legacyNotes = pgTable('legacy_notes', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    content: text('content').notNull(),
    role: roleEnum('role').notNull(), // Snapshot of role at time of writing
    tenure: text('tenure').notNull(), // e.g. "2023-2024"
    createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
    registrations: many(registrations),
    legacyNotes: many(legacyNotes),
}));

export const legacyNotesRelations = relations(legacyNotes, ({ one }) => ({
    user: one(users, {
        fields: [legacyNotes.userId],
        references: [users.id],
    }),
}));

export const checkpointsRelations = relations(checkpoints, ({ one }) => ({
    registration: one(registrations, {
        fields: [checkpoints.registrationId],
        references: [registrations.id],
    }),
}));

// Roadmaps Relations
export const roadmapsRelations = relations(roadmaps, ({ one }) => ({
    event: one(events, {
        fields: [roadmaps.eventId],
        references: [events.id],
    }),
}));

// Mentors Table (Preserved)
export const mentors = pgTable("mentors", {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    image: text('image'),
    role: text('role').notNull(),
    linkedinId: text("linkedin_id"),
    githubId: text("github_id"),
    createdAt: timestamp("created_at").defaultNow(),
});

// Team Photos Table (Preserved)
export const teamPhotos = pgTable("team_photos", {
    id: uuid('id').defaultRandom().primaryKey(),
    url: text('url').notNull(),
    description: text('description'),
    isHeader: boolean("is_header").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});

// System Settings Table
export const systemSettings = pgTable('system_settings', {
    key: text('key').primaryKey(),
    value: text('value').notNull(),
    description: text('description'),
});

