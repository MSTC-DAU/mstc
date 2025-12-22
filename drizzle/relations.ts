import { relations } from "drizzle-orm/relations";
import { user, legacyNotes, events, eventAwards, teams, registrations, session, account, roadmaps, checkpoints } from "./schema";

export const legacyNotesRelations = relations(legacyNotes, ({one}) => ({
	user: one(user, {
		fields: [legacyNotes.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	legacyNotes: many(legacyNotes),
	eventAwards: many(eventAwards),
	registrations: many(registrations),
	sessions: many(session),
	teams: many(teams),
	accounts: many(account),
}));

export const eventAwardsRelations = relations(eventAwards, ({one}) => ({
	event: one(events, {
		fields: [eventAwards.eventId],
		references: [events.id]
	}),
	team: one(teams, {
		fields: [eventAwards.teamId],
		references: [teams.id]
	}),
	user: one(user, {
		fields: [eventAwards.userId],
		references: [user.id]
	}),
}));

export const eventsRelations = relations(events, ({many}) => ({
	eventAwards: many(eventAwards),
	registrations: many(registrations),
	teams: many(teams),
	roadmaps: many(roadmaps),
}));

export const teamsRelations = relations(teams, ({one, many}) => ({
	eventAwards: many(eventAwards),
	registrations: many(registrations),
	event: one(events, {
		fields: [teams.eventId],
		references: [events.id]
	}),
	user: one(user, {
		fields: [teams.createdBy],
		references: [user.id]
	}),
}));

export const registrationsRelations = relations(registrations, ({one, many}) => ({
	user: one(user, {
		fields: [registrations.userId],
		references: [user.id]
	}),
	event: one(events, {
		fields: [registrations.eventId],
		references: [events.id]
	}),
	team: one(teams, {
		fields: [registrations.teamId],
		references: [teams.id]
	}),
	checkpoints: many(checkpoints),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const roadmapsRelations = relations(roadmaps, ({one}) => ({
	event: one(events, {
		fields: [roadmaps.eventId],
		references: [events.id]
	}),
}));

export const checkpointsRelations = relations(checkpoints, ({one}) => ({
	registration: one(registrations, {
		fields: [checkpoints.registrationId],
		references: [registrations.id]
	}),
}));