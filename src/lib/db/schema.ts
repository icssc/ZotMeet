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
} from "drizzle-orm/pg-core";

export const zotMeet = pgSchema("zotmeet");

export const users = zotMeet.table("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  displayName: text("displayName").unique().notNull(),
  email: text("email").unique().notNull(),
  created_at: timestamp("created_at"),
});

export const meetings = zotMeet.table("meetings", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  description: text("description"),
  location: text("location"),
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
      .default("0"),
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
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => {
    return {
      userIdx: index("user_idx_sessions").on(table.userId),
    };
  },
);

export const userGroupMembers = zotMeet.table(
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

export const userRelations = relations(users, ({ many }) => ({
  usersInGroups: many(userGroupMembers),
  sessions: many(sessions),
  availabilities: many(availabilities),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  usersInGroups: many(userGroupMembers),
  meetings: many(meetings),
}));

export const userGroupMemberRelations = relations(userGroupMembers, ({ one }) => ({
  groups: one(groups, {
    fields: [userGroupMembers.groupId],
    references: [groups.id],
  }),
  users: one(users, {
    fields: [userGroupMembers.userId],
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
