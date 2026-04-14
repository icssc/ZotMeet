import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	time,
	timestamp,
	unique,
	uuid,
} from "drizzle-orm/pg-core";

export const attendanceValues = ["accepted", "maybe", "declined"] as const;
export type AttendanceValue = (typeof attendanceValues)[number];

export const attendanceEnum = pgEnum("attendance", [
	"accepted",
	"maybe",
	"declined",
]);

export enum GroupRole {
	MEMBER = "member",
	ADMIN = "admin",
}

export function enumToPgEnum<T extends Record<string, string>>(
	myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
	return Object.values(myEnum).map((value: string) => value) as [
		T[keyof T],
		...T[keyof T][],
	];
}

export const groupRoleEnum = pgEnum("group_role", enumToPgEnum(GroupRole));

// Members encompasses anyone who uses ZotMeet, regardless of guest or user status.
export const members = pgTable(
	"members",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		displayName: text("display_name").notNull(),
		username: text("username").unique(),
		year: text("year"),
		major: text("major"),
		profilePicture: text("profile_picture"),
	},
	// (table) => ({
	//     unique: unique().on(table.id),
	// })
);

export type InsertMember = InferInsertModel<typeof members>;
export type SelectMember = InferSelectModel<typeof members>;

// Users encompasses Members who have created an account.
export const users = pgTable("users", {
	id: text("id").primaryKey(),
	memberId: uuid("member_id")
		.references(() => members.id, {
			onDelete: "cascade",
		})
		.notNull(),
	email: text("email").unique().notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export type SelectUser = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;

export const oauthAccounts = pgTable(
	"oauth_accounts",
	{
		userId: text("user_id")
			.notNull()
			.references(() => users.id, {
				onDelete: "cascade",
			}),
		providerId: text("provider_id").notNull(),
		providerUserId: text("provider_user_id").notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
	}),
);

export const sessions = pgTable(
	"sessions",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at", {
			withTimezone: true,
			mode: "date",
		}).notNull(),
		userId: text("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		oidcAccessToken: text("oidc_access_token"),
		oidcRefreshToken: text("oidc_refresh_token"),
		googleAccessToken: text("google_access_token"),
		googleRefreshToken: text("google_refresh_token"),
		googleAccessTokenExpiresAt: timestamp("google_access_token_expires_at", {
			withTimezone: true,
			mode: "date",
		}),
	},
	(table) => {
		return {
			userIdx: index("user_idx_sessions").on(table.userId),
		};
	},
);

export type SelectSession = InferSelectModel<typeof sessions>;
export type InsertSession = InferInsertModel<typeof sessions>;

export const groups = pgTable("groups", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	createdAt: timestamp("created_at"),
	createdBy: text("user_id").references(() => users.id),
	archived: boolean("archived").default(false).notNull(),
});

export type InsertGroup = InferInsertModel<typeof groups>;
export type SelectGroup = InferSelectModel<typeof groups>;

export const inviteStatusEnum = pgEnum("invite_status", [
	"pending",
	"accepted",
	"declined",
	"expired",
]);

export const groupInvites = pgTable("group_invites", {
	id: uuid("id").defaultRandom().primaryKey(),
	groupId: uuid("group_id")
		.notNull()
		.references(() => groups.id, { onDelete: "cascade" }),
	inviteToken: text("invite_token").notNull().unique(),
	inviterId: text("inviter_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	inviteeEmail: text("invitee_email").notNull().default(""),
	sentAt: timestamp("sent_at", { mode: "date" }).defaultNow().notNull(),
	expiresAt: timestamp("expires_at", { mode: "date" }),
});

export const groupInviteResponses = pgTable(
	"group_invite_responses",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		inviteId: uuid("invite_id")
			.notNull()
			.references(() => groupInvites.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		email: text("email").notNull(),
		status: inviteStatusEnum("status").notNull().default("pending"),
		respondedAt: timestamp("responded_at", { mode: "date" }),
	},
	(table) => ({
		inviteUserUnique: unique("group_invite_responses_invite_user_unique").on(
			table.inviteId,
			table.userId,
		),
	}),
);

export type InsertGroupInvite = InferInsertModel<typeof groupInvites>;
export type SelectGroupInvite = InferSelectModel<typeof groupInvites>;

export type InsertGroupInviteResponse = InferInsertModel<
	typeof groupInviteResponses
>;
export type SelectGroupInviteResponse = InferSelectModel<
	typeof groupInviteResponses
>;

export const meetingTypeEnum = pgEnum("meeting_type", ["dates", "days"]);

export const meetings = pgTable("meetings", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: text("title").notNull(),
	description: text("description"),
	location: text("location"),
	scheduled: boolean("scheduled"),
	fromTime: time("from_time", {
		withTimezone: false,
	}).notNull(),
	toTime: time("to_time", { withTimezone: false }).notNull(),
	// store IANA timezone as a string for better compatibility
	timezone: text("timezone").notNull(),
	group_id: uuid("group_id").references(() => groups.id, {
		onDelete: "cascade",
	}),
	hostId: uuid("host_id")
		.references(() => members.id, { onDelete: "cascade" })
		.notNull(),
	// JSON array of calendar dates
	// If meetingtype is "days" then array will contain anchor dates
	// If meetingtype is "dates" then array will contain dates of the meeting
	dates: jsonb("dates").$type<string[]>().notNull().default([]),
	meetingType: meetingTypeEnum("meeting_type").notNull().default("dates"),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	archived: boolean("archived").default(false).notNull(),
});

export const scheduledMeetings = pgTable("scheduled_meetings", {
	id: uuid("id").defaultRandom().primaryKey(),
	meetingId: uuid("meeting_id")
		.notNull()
		.references(() => meetings.id, { onDelete: "cascade" }),
	scheduledDate: timestamp("scheduled_date", {
		withTimezone: false,
		mode: "date",
	}).notNull(),
	scheduledFromTime: time("scheduled_from_time", {
		withTimezone: false,
	}).notNull(),
	scheduledToTime: time("scheduled_to_time", {
		withTimezone: false,
	}).notNull(),
});

export type InsertScheduledMeeting = InferInsertModel<typeof scheduledMeetings>;
export type SelectScheduledMeeting = InferSelectModel<typeof scheduledMeetings>;

export type InsertMeeting = InferInsertModel<typeof meetings>;
export type SelectMeeting = InferSelectModel<typeof meetings>;

export const notifications = pgTable("notifications", {
	id: uuid("id").defaultRandom().primaryKey(),
	memberId: uuid("user_id")
		.notNull()
		.references(() => members.id, { onDelete: "cascade" }),
	type: text("type").notNull(),
	readAt: timestamp("read_at", { withTimezone: true, mode: "date" }),
	createdAt: timestamp("created_at", {
		withTimezone: true,
		mode: "date",
	}).defaultNow(),
	createdBy: text("created_by"),
	title: text("title").notNull(),
	message: text("message"),
	redirect: text("redirect"),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
	member: one(members, {
		fields: [notifications.memberId],
		references: [members.id],
	}),
}));

export const availabilities = pgTable(
	"availabilities",
	{
		memberId: uuid("member_id")
			.notNull()
			.references(() => members.id, { onDelete: "cascade" }),
		meetingId: uuid("meeting_id")
			.notNull()
			.references(() => meetings.id, { onDelete: "cascade" }),
		status: attendanceEnum("status"),
		/**
		 * A JSON array of ISO dates as strings
		 * @example ["2025-04-11T00:00:00.000Z", "2025-04-12T00:00:00.000Z"]
		 */
		meetingAvailabilities: jsonb("meeting_availabilities")
			.$type<string[]>()
			.notNull()
			.default([]),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.memberId, table.meetingId] }),
	}),
);

export type SelectAvailability = InferSelectModel<typeof availabilities>;
export type InsertAvailability = InferInsertModel<typeof availabilities>;

export const usersInGroup = pgTable(
	"users_in_group",
	{
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		groupId: uuid("group_id")
			.notNull()
			.references(() => groups.id, { onDelete: "cascade" }),
		role: groupRoleEnum("role").default(GroupRole.MEMBER).notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.groupId, table.userId] }),
	}),
);

export const usersRelations = relations(users, ({ one, many }) => ({
	oauthAccounts: many(oauthAccounts),
	usersInGroups: many(usersInGroup),
	sessions: many(sessions),
	member: one(members, {
		fields: [users.memberId],
		references: [members.id],
	}),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
	members: many(usersInGroup),
	meetings: many(meetings),
}));

export const membersRelations = relations(members, ({ one, many }) => ({
	hostedMeetings: many(meetings, {
		relationName: "memberHostedMeetings",
	}),
	availabilities: many(availabilities),
	notifications: many(notifications),
	user: one(users, {
		fields: [members.id],
		references: [users.memberId],
	}),
}));

export const meetingsRelations = relations(meetings, ({ one, many }) => ({
	group: one(groups, {
		fields: [meetings.group_id],
		references: [groups.id],
	}),
	host: one(members, {
		fields: [meetings.hostId],
		references: [members.id],
		relationName: "memberHostedMeetings",
	}),
	availabilities: many(availabilities),
	scheduledMeetings: many(scheduledMeetings),
}));

export const availabilitiesRelations = relations(availabilities, ({ one }) => ({
	member: one(members, {
		fields: [availabilities.memberId],
		references: [members.id],
	}),
	meeting: one(meetings, {
		fields: [availabilities.meetingId],
		references: [meetings.id],
	}),
}));

export const usersInGroupRelations = relations(usersInGroup, ({ one }) => ({
	user: one(users, {
		fields: [usersInGroup.userId],
		references: [users.id],
	}),
	group: one(groups, {
		fields: [usersInGroup.groupId],
		references: [groups.id],
	}),
}));

export const scheduledMeetingsRelations = relations(
	scheduledMeetings,
	({ one }) => ({
		meeting: one(meetings, {
			fields: [scheduledMeetings.meetingId],
			references: [meetings.id],
		}),
	}),
);

export const oauthAccountsRelations = relations(oauthAccounts, ({ one }) => ({
	user: one(users, {
		fields: [oauthAccounts.userId],
		references: [users.id],
	}),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));
