/**
 * Availability grid vocabulary shared by the web and Expo apps. The member
 * shapes are kept by hand (this package cannot import the Drizzle schema); the
 * web's `lib/types/availability.ts` pins them to the DB row types at
 * typecheck so a column change surfaces there rather than as drift here.
 */

export type AvailabilityBlockType = {
	zotDateIndex: number;
	blockIndex: number;
};

export type AvailabilityView = "group" | "personal" | "schedule";

/** An inclusive rectangle of grid cells, in (date index, block index) space. */
export type SelectionStateType = {
	earlierDateIndex: number;
	laterDateIndex: number;
	earlierBlockIndex: number;
	laterBlockIndex: number;
};

export function rangeCoversCell(
	range: SelectionStateType | undefined,
	zotDateIndex: number,
	blockIndex: number,
): boolean {
	if (!range) return false;
	return (
		range.earlierDateIndex <= zotDateIndex &&
		zotDateIndex <= range.laterDateIndex &&
		range.earlierBlockIndex <= blockIndex &&
		blockIndex <= range.laterBlockIndex
	);
}

/** One member's saved response to a meeting — the `availabilities` row plus who they are. */
export type MemberMeetingAvailability = {
	memberId: string;
	/** ISO slot strings, one per 15-minute block the member marked available. */
	meetingAvailabilities: string[];
	ifNeededAvailabilities: string[];
	displayName: string;
	profilePicture: string | null;
};

export type Member = Pick<
	MemberMeetingAvailability,
	"memberId" | "displayName" | "profilePicture"
>;
