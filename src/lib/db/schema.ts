import { relations } from "drizzle-orm";
import {
  text,
  uuid,
  pgSchema,
  timestamp,
  index,
  smallint,
  date,
  numeric,
  primaryKey,
  // json,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";

export const zotMeet = pgSchema("zotmeet");

export const attendanceEnum = pgEnum("attendance", ["accepted", "maybe", "declined"]);

export const users = zotMeet.table("user", {
  id: text("id").primaryKey(),
  displayName: text("displayName").notNull(),
  email: text("email").unique().notNull(),
  password: text("password"),
  created_at: timestamp("created_at"),
});

export const oauthAccountsTable = zotMeet.table(
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

export const meetings = zotMeet.table("meetings", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  description: text("description"),
  location: text("location"),
  scheduled: boolean("scheduled"),
  from_time: timestamp("from_time").notNull(),
  to_time: timestamp("to_time").notNull(),
  group_id: uuid("group_id").references(() => groups.id, { onDelete: "cascade" }),
  host_id: text("host_id").references(() => users.id),
});

export const groups = zotMeet.table("groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  created_at: timestamp("created_at"),
});

export const availabilities = zotMeet.table(
  "availabilities",
  {
    day: date("day").notNull(),
    user_id: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    block_length: smallint("block_length").notNull().default(15),
    meeting_id: uuid("meeting_id")
      .references(() => meetings.id, { onDelete: "cascade" })
      .notNull()
      .default("00000000-0000-0000-0000-000000000000"),
    earliest_time: numeric("earliest_time"),
    latest_time: numeric("latest_time"),
    availability_string: text("availability_string").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.user_id, table.day, table.meeting_id] }),
  }),
);

export const sessions = zotMeet.table(
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
  },
);

export const usersInGroup = zotMeet.table(
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
  }),
);

export const usersInMeeting = zotMeet.table(
  "users_in_meeting",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" }),
    attending: attendanceEnum("attendance"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.meetingId] }),
  }),
);

export const userRelations = relations(users, ({ many }) => ({
  usersInGroups: many(usersInGroup),
  sessions: many(sessions),
  availabilities: many(availabilities),
  usersInMeeting: many(usersInMeeting),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  usersInGroups: many(usersInGroup),
  meetings: many(meetings),
}));

export const userGroupMemberRelations = relations(usersInGroup, ({ one }) => ({
  groups: one(groups, {
    fields: [usersInGroup.groupId],
    references: [groups.id],
  }),
  users: one(users, {
    fields: [usersInGroup.userId],
    references: [users.id],
  }),
}));

export const userMeetingMemberRelations = relations(usersInMeeting, ({ one }) => ({
  groups: one(meetings, {
    fields: [usersInMeeting.meetingId],
    references: [meetings.id],
  }),
  users: one(users, {
    fields: [usersInMeeting.userId],
    references: [users.id],
  }),
}));

export const meetingsRelations = relations(meetings, ({ one, many }) => ({
  groups: one(groups, {
    fields: [meetings.group_id],
    references: [groups.id],
  }),
  users: one(users, {
    fields: [meetings.host_id],
    references: [users.id],
  }),
  availabilities: many(availabilities),
  usersInMeeting: many(usersInMeeting),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  users: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const availabilitiesRelations = relations(availabilities, ({ one }) => ({
  meetings: one(meetings, {
    fields: [availabilities.meeting_id],
    references: [meetings.id],
  }),
  users: one(users, {
    fields: [availabilities.user_id],
    references: [users.id],
  }),
}));

export type UserInsertSchema = typeof users.$inferInsert;
