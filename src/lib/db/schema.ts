import { relations } from "drizzle-orm";
import {
  text,
  uuid,
  pgSchema,
  timestamp,
  bigint,
  index,
  smallint,
  date,
  numeric,
  primaryKey,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";

export const zotMeet = pgSchema("zotmeet");

export const attendanceEnum = pgEnum("attendance", ["accepted", "maybe", "declined"]);

export const users = zotMeet.table("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  created_at: timestamp("created_at"),
});

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
  host_id: uuid("host_id").references(() => users.id),
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
    user_id: uuid("user_id")
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

export const keys = zotMeet.table(
  "keys",
  {
    id: text("id").primaryKey(),
    hashed_password: text("hashed_password"),
    user_id: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => {
    return {
      userIdxKeys: index("user_idx_keys").on(table.user_id),
    };
  },
);

export const sessions = zotMeet.table(
  "sessions",
  {
    id: text("id").primaryKey(),
    active_expires: bigint("active_expires", { mode: "bigint" }).notNull(),
    idle_expires: bigint("idle_expires", { mode: "bigint" }).notNull(),
    user_id: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => {
    return {
      userIdxSessions: index("user_idx_sessions").on(table.user_id),
    };
  },
);

export const usersInGroup = zotMeet.table(
  "users_in_group",
  {
    userId: uuid("user_id")
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
    userId: uuid("user_id")
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
  keys: many(keys),
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

export const keysRelations = relations(keys, ({ one }) => ({
  users: one(users, {
    fields: [keys.user_id],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  users: one(users, {
    fields: [sessions.user_id],
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
