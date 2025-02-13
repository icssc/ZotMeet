import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
    boolean,
    char,
    index,
    jsonb,
    pgEnum,
    pgTable,
    primaryKey,
    text,
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

export const timezoneEnum = pgEnum("timezone", [
    "PST",
    "PDT",
    "MST",
    "MDT",
    "CST",
    "CDT",
    "EST",
    "EDT",
]);

// Members encompasses anyone who uses ZotMeet, regardless of guest or user status.
export const members = pgTable(
    "members",
    {
        id: text("id").primaryKey(),
        displayName: text("display_name").notNull(),
    },
    (table) => ({
        unique: unique().on(table.id),
    })
);

export const membersRelations = relations(members, ({ one, many }) => ({
    availabilities: many(availabilities),
    users: one(users, {
        fields: [members.id],
        references: [users.id],
    }),
}));

// Users encompasses Members who have created an account.
export const users = pgTable("users", {
    id: text("id")
        .primaryKey()
        .references(() => members.id, { onDelete: "cascade" }),
    memberId: text("member_id").references(() => members.id),
    email: text("email").unique().notNull(),
    passwordHash: text("password_hash"),
    createdAt: timestamp("created_at"),
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
    })
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
    },
    (table) => {
        return {
            userIdx: index("user_idx_sessions").on(table.userId),
        };
    }
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
    users: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const meetings = pgTable("meetings", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    location: text("location"),
    scheduled: boolean("scheduled"),
    from_time: char("from_time", { length: 5 }).notNull(),
    to_time: char("to_time", { length: 5 }).notNull(),
    timezone: timezoneEnum("timezone").default("PST").notNull(),
    group_id: uuid("group_id").references(() => groups.id, {
        onDelete: "cascade",
    }),
    host_id: text("host_id").references(() => members.id).notNull(),
    // dates: interval("dates"), -- STORES RELATIVE TIME INTERVAL
    // dates: jsonb("dates") -- CANNOT VALIDATE KEY-VALUE PAIR FORMAT IN DDL
    dates: jsonb("dates").notNull().default([]),
    // start_date: timestamp("start_date").notNull(), // could default to today's date
    // end_date: timestamp("end_date").notNull(),
});

export const meetingsRelations = relations(meetings, ({ one, many }) => ({
    groups: one(groups, {
        fields: [meetings.group_id],
        references: [groups.id],
    }),
    availabilities: many(availabilities),
}));

// TODO: remove this table
/**
 * @deprecated in favor of storing dates in the meetings table as JSON column
 */
// export const meetingDates = pgTable(
//     "meeting_dates",
//     {
//         id: uuid("id").unique().defaultRandom(),
//         meeting_id: uuid("meeting_id").references(() => meetings.id, {
//             onDelete: "cascade",
//         }),
//         date: timestamp("date").notNull(),
//     },
//     (table) => ({
//         pk: primaryKey({ columns: [table.id, table.date] }),
//     })
// );

export const groups = pgTable("groups", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    created_at: timestamp("created_at"),
    created_by: text("user_id").references(() => users.id),
});

export const groupsRelations = relations(groups, ({ many }) => ({
    usersInGroups: many(usersInGroup),
    meetings: many(meetings),
}));

export const availabilities = pgTable(
    "availabilities",
    {
        memberId: text("member_id")
            .notNull()
            .references(() => members.id, { onDelete: "cascade" }),
        meetingId: uuid("meeting_id")
            .notNull()
            .references(() => meetings.id, { onDelete: "cascade" }),
        // meeting_day: uuid("meeting_day")
        //     .references(() => meetingDates.id, { onDelete: "cascade" })
        //     .notNull(),
        // blockLength: smallint("block_length").notNull().default(15),
        // availabilityString: text("availability_string").notNull(), // could be a char of length 24
        meetingAvailabilities: jsonb("meeting_availabilities")
            .notNull()
            .default([]), // Stores time slots
        status: attendanceEnum("status"),
    }, // user and neeting
    (table) => ({
        pk: primaryKey({ columns: [table.memberId, table.meetingId] }),
    })
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

export const usersInGroup = pgTable(
    "users_in_group",
    {
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        groupId: uuid("group_id")
            .notNull()
            .references(() => groups.id, { onDelete: "cascade" }),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.groupId, table.userId] }),
    })
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

export type SelectUser = InferSelectModel<typeof users>;

export type SelectSession = InferSelectModel<typeof sessions>;
export type InsertSession = InferInsertModel<typeof sessions>;
