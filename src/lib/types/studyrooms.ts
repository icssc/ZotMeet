import { z } from "zod";
import type { paths } from "@/lib/types/anteater-api-types";

export type StudyRoomsByFilters =
	paths["/v2/rest/studyRooms"]["get"]["parameters"]["query"];

export type StudyRooms =
	paths["/v2/rest/studyRooms"]["get"]["responses"]["200"]["content"]["application/json"];

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

// Matches a trailing booking-duration label on a study-room name, e.g.
// "(1 hour)", "(2 hours)", "(90 minutes)", or "(1.5 hours)". Durations are
// normalized to minutes so half-hour variants (30/90) are handled, not just
// whole-hour labels.
const DURATION_SUFFIX_REGEX =
	/\s*\((\d+(?:\.\d+)?)\s*(hours?|hrs?|minutes?|mins?)\)\s*$/i;

export function stripRoomDurationSuffix(name: string): string {
	return name.replace(DURATION_SUFFIX_REGEX, "").trim();
}

export function parseRoomDuration(name: string): MeetingLength | null {
	const match = name.match(DURATION_SUFFIX_REGEX);
	if (!match) return null;
	const value = Number(match[1]);
	const isHours = match[2].toLowerCase().startsWith("h");
	const minutes = isHours ? value * 60 : value;
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

export const BUILDINGS = [
	"Anteater Learning Pavilion",
	"Science Library",
	"Langson Library",
	"Gateway Study Center",
	"Plaza Verde",
	"Multimedia Resources Center",
] as const;
export type Building = (typeof BUILDINGS)[number];

export const LOCATION_DISPLAY_NAMES: Record<Building, string> = {
	"Anteater Learning Pavilion": "ALP",
	"Science Library": "Sci Lib",
	"Langson Library": "Langson",
	"Gateway Study Center": "Gateway",
	"Plaza Verde": "PV",
	"Multimedia Resources Center": "MRC",
};

export function formatLocation(location: string): string {
	return LOCATION_DISPLAY_NAMES[location as Building] ?? location;
}

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
