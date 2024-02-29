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
} from "drizzle-orm/pg-core";

export const zotMeet = pgSchema("zotmeet");

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
  from_time: timestamp("from_time").notNull(),
  to_time: timestamp("to_time").notNull(),
  group_id: uuid("group_id").references(() => groups.id, { onDelete: "cascade" }),
});

export const groups = zotMeet.table("groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  created_at: timestamp("created_at"),
});

export const availabilities = zotMeet.table("availabilities", {
  block_length: smallint("block_length").notNull().default(15),
  day: date("day").notNull(),
  earliest_time: numeric("earliest_time"),
  latest_time: numeric("latest_time"),
  availability_string: text("availability_string").notNull(),
});

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
      userIdx: index("user_idx").on(table.user_id),
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
      userIdx: index("user_idx").on(table.user_id),
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
  keys: many(keys),
  sessions: many(sessions),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  usersInGroups: many(userGroupMembers),
  meetings: many(meetings),
}));

export const userGroupMemberRelations = relations(userGroupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [userGroupMembers.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [userGroupMembers.userId],
    references: [users.id],
  }),
}));

export const meetingsRelations = relations(meetings, ({ one }) => ({
  group: one(groups, {
    fields: [meetings.group_id],
    references: [groups.id],
  }),
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
