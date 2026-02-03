import {
	type InferInsertModel,
	type InferSelectModel,
	relations,
} from "drizzle-orm";
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
	},
	// (table) => ({
	//     unique: unique().on(table.id),
	// })
);

export const membersRelations = relations(members, ({ one, many }) => ({
	availabilities: many(availabilities),
	users: one(users, {
		fields: [members.id],
		references: [users.id],
	}),
}));

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

export const usersRelations = relations(users, ({ one, many }) => ({
	oauthAccountsTable: many(oauthAccounts),
	usersInGroups: many(usersInGroup),
	sessions: many(sessions),
	members: one(members, {
		fields: [users.memberId],
		references: [members.id],
	}),
}));

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

export const oauthAccountRelations = relations(oauthAccounts, ({ one }) => ({
	users: one(users, {
		fields: [oauthAccounts.userId],
		references: [users.id],
	}),
}));

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

export const sessionsRelations = relations(sessions, ({ one }) => ({
	users: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export type SelectSession = InferSelectModel<typeof sessions>;
export type InsertSession = InferInsertModel<typeof sessions>;

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

export type SelectScheduledMeeting = InferSelectModel<typeof scheduledMeetings>;

export const meetingsRelations = relations(meetings, ({ one, many }) => ({
	groups: one(groups, {
		fields: [meetings.group_id],
		references: [groups.id],
	}),
	availabilities: many(availabilities),
}));

export type InsertMeeting = InferInsertModel<typeof meetings>;
export type SelectMeeting = InferSelectModel<typeof meetings>;

export const groups = pgTable("groups", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	createdAt: timestamp("created_at"),
	createdBy: text("user_id").references(() => users.id),
	archived: boolean("archived").default(false).notNull(),
});

export const groupsRelations = relations(groups, ({ many }) => ({
	usersInGroups: many(usersInGroup),
	meetings: many(meetings),
}));

export type InsertGroup = InferInsertModel<typeof groups>;
export type SelectGroup = InferSelectModel<typeof groups>;

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

export const availabilitiesRelations = relations(availabilities, ({ one }) => ({
	members: one(members, {
		fields: [availabilities.memberId],
		references: [members.id],
	}),
	meetings: one(meetings, {
		fields: [availabilities.meetingId],
		references: [meetings.id],
	}),
}));

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

export const usersInGroupRelations = relations(usersInGroup, ({ one }) => ({
	groups: one(groups, {
		fields: [usersInGroup.groupId],
		references: [groups.id],
	}),
	users: one(users, {
		fields: [usersInGroup.userId],
		references: [users.id],
	}),
}));

export const oauthRelations = relations(oauthAccounts, ({ one }) => ({
	users: one(users, {
		fields: [oauthAccounts.userId],
		references: [users.id],
	}),
}));
