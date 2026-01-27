import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	members: {
		availabilities: r.many.availabilities({
			from: r.members.id,
			to: r.availabilities.memberId,
		}),
		users: r.one.users({
			from: r.members.id,
			to: r.users.memberId,
		}),
	},
	users: {
		oauthAccountsTable: r.many.oauthAccounts({
			from: r.users.id,
			to: r.oauthAccounts.userId,
		}),
		usersInGroups: r.many.usersInGroup({
			from: r.users.id,
			to: r.usersInGroup.userId,
		}),
		sessions: r.many.sessions({
			from: r.users.id,
			to: r.sessions.userId,
		}),
		members: r.one.members({
			from: r.users.memberId,
			to: r.members.id,
		}),
	},
	oauthAccounts: {
		users: r.one.users({
			from: r.oauthAccounts.userId,
			to: r.users.id,
		}),
	},
	sessions: {
		users: r.one.users({
			from: r.sessions.userId,
			to: r.users.id,
		}),
	},
	meetings: {
		groups: r.one.groups({
			from: r.meetings.group_id,
			to: r.groups.id,
		}),
		availabilities: r.many.availabilities({
			from: r.meetings.id,
			to: r.availabilities.meetingId,
		}),
	},
	groups: {
		usersInGroups: r.many.usersInGroup({
			from: r.groups.id,
			to: r.usersInGroup.groupId,
		}),
		meetings: r.many.meetings({
			from: r.groups.id,
			to: r.meetings.group_id,
		}),
	},
	availabilities: {
		members: r.one.members({
			from: r.availabilities.memberId,
			to: r.members.id,
		}),
		meetings: r.one.meetings({
			from: r.availabilities.meetingId,
			to: r.meetings.id,
		}),
	},
	usersInGroup: {
		groups: r.one.groups({
			from: r.usersInGroup.groupId,
			to: r.groups.id,
		}),
		users: r.one.users({
			from: r.usersInGroup.userId,
			to: r.users.id,
		}),
	},
}));
