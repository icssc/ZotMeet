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
