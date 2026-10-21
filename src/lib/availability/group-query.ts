/*
 * Moved to `@zotmeet/shared` so the Expo app can answer "who is free in this
 * range" the same way; re-exported here to keep this module's import path stable.
 */
export {
	computeGroupMembersForRange,
	type GroupMembersForRange,
	type MemberRangeStatus,
	statusForMember,
} from "@zotmeet/shared";
