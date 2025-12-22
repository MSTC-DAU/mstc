import { pgTable, foreignKey, uuid, text, timestamp, integer, unique, jsonb, boolean, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const eventStatus = pgEnum("event_status", ['upcoming', 'live', 'past'])
export const eventType = pgEnum("event_type", ['hackathon', 'cp_solo', 'cp_team', 'mentorship', 'team_event', 'solo_event'])
export const role = pgEnum("role", ['student', 'member', 'core_member', 'deputy_convener', 'convener'])


export const legacyNotes = pgTable("legacy_notes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	content: text().notNull(),
	role: role().notNull(),
	tenure: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "legacy_notes_user_id_user_id_fk"
		}),
]);

export const eventAwards = pgTable("event_awards", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	eventId: uuid("event_id").notNull(),
	teamId: uuid("team_id"),
	userId: uuid("user_id"),
	title: text().notNull(),
	rank: integer().notNull(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	category: text(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "event_awards_event_id_events_id_fk"
		}),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "event_awards_team_id_teams_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "event_awards_user_id_user_id_fk"
		}),
]);

export const registrations = pgTable("registrations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	eventId: uuid("event_id").notNull(),
	teamId: uuid("team_id"),
	customAnswers: jsonb("custom_answers"),
	status: text().default('pending'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	domainPriorities: jsonb("domain_priorities"),
	assignedDomain: text("assigned_domain"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "registrations_user_id_user_id_fk"
		}),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "registrations_event_id_events_id_fk"
		}),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "registrations_team_id_teams_id_fk"
		}),
	unique("registrations_user_id_event_id_unique").on(table.userId, table.eventId),
]);

export const mentors = pgTable("mentors", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	image: text(),
	role: text().notNull(),
	linkedinId: text("linkedin_id"),
	githubId: text("github_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const user = pgTable("user", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	name: text(),
	emailVerified: timestamp({ mode: 'string' }),
	image: text(),
	role: role().default('student'),
	collegeId: text("college_id"),
	xpPoints: integer("xp_points").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	bio: text(),
	githubId: text("github_id"),
	linkedinId: text("linkedin_id"),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const teamPhotos = pgTable("team_photos", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	url: text().notNull(),
	description: text(),
	isHeader: boolean("is_header").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const session = pgTable("session", {
	sessionToken: text().primaryKey().notNull(),
	userId: uuid().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const teams = pgTable("teams", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	eventId: uuid("event_id").notNull(),
	name: text().notNull(),
	joinCode: text("join_code").notNull(),
	createdBy: uuid("created_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "teams_event_id_events_id_fk"
		}),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [user.id],
			name: "teams_created_by_user_id_fk"
		}),
]);

export const account = pgTable("account", {
	userId: uuid().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
	id: uuid().defaultRandom().primaryKey().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}).onDelete("cascade"),
	unique("account_provider_providerAccountId_unique").on(table.provider, table.providerAccountId),
]);

export const events = pgTable("events", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: text().notNull(),
	title: text().notNull(),
	type: eventType().notNull(),
	status: eventStatus().default('upcoming'),
	posterUrl: text("poster_url"),
	startDate: timestamp("start_date", { mode: 'string' }),
	endDate: timestamp("end_date", { mode: 'string' }),
	config: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	registrationStartDate: timestamp("registration_start_date", { mode: 'string' }),
	registrationEndDate: timestamp("registration_end_date", { mode: 'string' }),
	description: text(),
	rules: text(),
	theme: text().default('default'),
	timeline: jsonb(),
}, (table) => [
	unique("events_slug_unique").on(table.slug),
]);

export const roadmaps = pgTable("roadmaps", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	eventId: uuid("event_id").notNull(),
	domain: text().notNull(),
	content: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "roadmaps_event_id_events_id_fk"
		}),
]);

export const checkpoints = pgTable("checkpoints", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	registrationId: uuid("registration_id").notNull(),
	weekNumber: integer("week_number").notNull(),
	submissionContent: text("submission_content"),
	mentorFeedback: text("mentor_feedback"),
	isApproved: boolean("is_approved"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.registrationId],
			foreignColumns: [registrations.id],
			name: "checkpoints_registration_id_registrations_id_fk"
		}),
]);

export const verificationToken = pgTable("verificationToken", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	primaryKey({ columns: [table.identifier, table.token], name: "verificationToken_identifier_token_pk"}),
]);
