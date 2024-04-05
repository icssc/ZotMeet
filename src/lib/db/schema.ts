import { relations } from "drizzle-orm";
import {
  text,
  uuid,
  pgSchema,
  timestamp,
  index,
  smallint,
  date,
  primaryKey,
  pgEnum,
  boolean,
  json,
} from "drizzle-orm/pg-core";

export const zotMeet = pgSchema("zotmeet");

export const attendanceEnum = pgEnum("attendance", ["accepted", "maybe", "declined"]);
export const memberEnum = pgEnum("member_type", ["guest", "user"]);

// Members encompasses anyone who uses ZotMeet, regardless of guest or user status.
export const members = zotMeet.table("members", {
  id: text("id").primaryKey(),
  type: memberEnum("type").notNull().default("guest"),
});

// Users encompasses Members who have created an account.
export const users = zotMeet.table("users", {
  id: text("id")
    .primaryKey()
    .references(() => members.id, { onDelete: "cascade" }),
  displayName: text("displayName").unique().notNull(),
  email: text("email").unique().notNull(),
  password: text("password"),
  created_at: timestamp("created_at"),
  authMethods: json("auth_methods").$type<string[]>().notNull(),
});

// Guests are Members who do not have an account and are bound to one specific meeting.
export const guests = zotMeet.table(
  "guests",
  {
    id: text("id").unique().notNull(),
    username: text("username").notNull(),
    meeting_id: uuid("meeting_id").references(() => meetings.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.username, table.meeting_id] }),
  }),
);

export const meetings = zotMeet.table("meetings", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location"),
  scheduled: boolean("scheduled"),
  from_time: timestamp("from_time").notNull(),
  to_time: timestamp("to_time").notNull(),
  group_id: uuid("group_id").references(() => groups.id, { onDelete: "cascade" }),
  host_id: text("host_id").references(() => members.id),
});

export const meetingDates = zotMeet.table(
  "meeting_dates",
  {
    id: uuid("id").unique().defaultRandom(),
    meeting_id: uuid("meeting_id").references(() => meetings.id, { onDelete: "cascade" }),
    date: timestamp("date").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.date] }),
  }),
);

export const groups = zotMeet.table("groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  created_at: timestamp("created_at"),
  created_by: text("user_id").references(() => users.id),
});

export const availabilities = zotMeet.table(
  "availabilities",
  {
    day: date("day").notNull(),
    member_id: text("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    meeting_day: uuid("meeting_day")
      .references(() => meetingDates.id, { onDelete: "cascade" })
      .notNull(),
    block_length: smallint("block_length").notNull().default(15),
    availability_string: text("availability_string").notNull(),
  }, // user and neeting
  (table) => ({
    pk: primaryKey({ columns: [table.member_id, table.meeting_day] }),
  }),
);
// meeting_day
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

export const membersInMeeting = zotMeet.table(
  "members_in_meeting",
  {
    memberId: text("member_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" }),
    attending: attendanceEnum("attendance"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.memberId, table.meetingId] }),
  }),
);

export const memberRelations = relations(members, ({ many }) => ({
  availabilities: many(availabilities),
  membersInMeeting: many(membersInMeeting),
}));

export const userRelations = relations(users, ({ one, many }) => ({
  oauthAccountsTable: one(oauthAccountsTable),
  usersInGroups: many(usersInGroup),
  sessions: many(sessions),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  usersInGroups: many(usersInGroup),
  meetings: many(meetings),
}));

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

export const membersInMeetingRelations = relations(membersInMeeting, ({ one }) => ({
  groups: one(meetings, {
    fields: [membersInMeeting.meetingId],
    references: [meetings.id],
  }),
  members: one(members, {
    fields: [membersInMeeting.memberId],
    references: [members.id],
  }),
}));

export const meetingsRelations = relations(meetings, ({ one, many }) => ({
  groups: one(groups, {
    fields: [meetings.group_id],
    references: [groups.id],
  }),
  members: one(members, {
    fields: [meetings.host_id],
    references: [members.id],
  }),
  availabilities: many(availabilities),
  membersInMeeting: many(membersInMeeting),
  meetingDates: many(meetingDates),
}));

export const meetingDateRelations = relations(meetingDates, ({ one }) => ({
  meetings: one(meetings, {
    fields: [meetingDates.meeting_id],
    references: [meetings.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  users: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const oauthRelations = relations(oauthAccountsTable, ({ one }) => ({
  users: one(users, {
    fields: [oauthAccountsTable.userId],
    references: [users.id],
  }),
}));
export const availabilitiesRelations = relations(availabilities, ({ one }) => ({
  meetingDates: one(meetingDates, {
    fields: [availabilities.meeting_day],
    references: [meetingDates.id],
  }),
  members: one(members, {
    fields: [availabilities.member_id],
    references: [members.id],
  }),
}));
