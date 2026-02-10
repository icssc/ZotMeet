import { relations } from "drizzle-orm";
import * as schema from "./schema";

export const membersRelations = relations(schema.members, ({ one, many }) => ({
	availabilities: many(schema.availabilities),

	user: one(schema.users, {
		fields: [schema.members.id],
		references: [schema.users.memberId],
	}),
}));

export const usersRelations = relations(schema.users, ({ one, many }) => ({
	oauthAccounts: many(schema.oauthAccounts),
	usersInGroups: many(schema.usersInGroup),
	sessions: many(schema.sessions),

	member: one(schema.members, {
		fields: [schema.users.memberId],
		references: [schema.members.id],
	}),
}));

export const oauthAccountsRelations = relations(
	schema.oauthAccounts,
	({ one }) => ({
		user: one(schema.users, {
			fields: [schema.oauthAccounts.userId],
			references: [schema.users.id],
		}),
	}),
);

export const sessionsRelations = relations(schema.sessions, ({ one }) => ({
	user: one(schema.users, {
		fields: [schema.sessions.userId],
		references: [schema.users.id],
	}),
}));

export const meetingsRelations = relations(
	schema.meetings,
	({ one, many }) => ({
		group: one(schema.groups, {
			fields: [schema.meetings.group_id],
			references: [schema.groups.id],
		}),
		availabilities: many(schema.availabilities),
	}),
);

export const groupsRelations = relations(schema.groups, ({ many }) => ({
	usersInGroups: many(schema.usersInGroup),
	meetings: many(schema.meetings),
}));

export const availabilitiesRelations = relations(
	schema.availabilities,
	({ one }) => ({
		member: one(schema.members, {
			fields: [schema.availabilities.memberId],
			references: [schema.members.id],
		}),
		meeting: one(schema.meetings, {
			fields: [schema.availabilities.meetingId],
			references: [schema.meetings.id],
		}),
	}),
);

export const usersInGroupRelations = relations(
	schema.usersInGroup,
	({ one }) => ({
		group: one(schema.groups, {
			fields: [schema.usersInGroup.groupId],
			references: [schema.groups.id],
		}),
		user: one(schema.users, {
			fields: [schema.usersInGroup.userId],
			references: [schema.users.id],
		}),
	}),
);
