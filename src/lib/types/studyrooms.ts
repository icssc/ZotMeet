import {
	type Building,
	parseRoomDurationMinutes,
	type StudyRoomLike,
} from "@zotmeet/shared";
import { z } from "zod";
import type { paths } from "@/lib/types/anteater-api-types";

// Room naming lives in `@zotmeet/shared`; re-exported so imports stay put.
export {
	BUILDINGS,
	type Building,
	extractRoomNumber,
	formatLocation,
	formatRoomChipLabel,
	LOCATION_DISPLAY_NAMES,
	stripRoomDurationSuffix,
} from "@zotmeet/shared";

export type StudyRoomsByFilters =
	paths["/v2/rest/studyRooms"]["get"]["parameters"]["query"];

export type StudyRooms =
	paths["/v2/rest/studyRooms"]["get"]["responses"]["200"]["content"]["application/json"];

/**
 * `@zotmeet/shared` matches rooms against a structural copy of an API entry;
 * this fails the typecheck if the generated API types drift from it.
 */
const _apiRoomMatchesShared: StudyRoomLike =
	null as unknown as StudyRooms["data"][number];
void _apiRoomMatchesShared;

export const MEETING_LENGTHS = [30, 60, 90, 120] as const;
export type MeetingLength = (typeof MEETING_LENGTHS)[number];
export const MeetingLengthSchema = z.union(
	MEETING_LENGTHS.map((m) => z.literal(m)) as [
		z.ZodLiteral<30>,
		z.ZodLiteral<60>,
		z.ZodLiteral<90>,
		z.ZodLiteral<120>,
	],
);

export function parseRoomDuration(name: string): MeetingLength | null {
	const minutes = parseRoomDurationMinutes(name);
	if (minutes == null) return null;
	const parsed = MeetingLengthSchema.safeParse(minutes);
	return parsed.success ? parsed.data : null;
}

// Structured capacity ranges so consumers never have to parse the label string.
// `max` is omitted for the open-ended bucket ("13+").
export const CAPACITY_RANGES = [
	{ label: "1-2", min: 1, max: 2 },
	{ label: "3-4", min: 3, max: 4 },
	{ label: "5-6", min: 5, max: 6 },
	{ label: "7-8", min: 7, max: 8 },
	{ label: "9-12", min: 9, max: 12 },
	{ label: "13+", min: 13 },
] as const;
export type Capacity = (typeof CAPACITY_RANGES)[number]["label"];
export const CAPACITIES: readonly Capacity[] = CAPACITY_RANGES.map(
	(r) => r.label,
);

export type RoomFilters = {
	capacities: Capacity[];
	buildings: Building[];
	lengths: MeetingLength[];
};

export const DEFAULT_ROOM_FILTERS: RoomFilters = {
	capacities: ["3-4"],
	buildings: [],
	lengths: [60],
};
