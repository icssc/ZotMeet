import { z } from "zod";
import type { paths } from "@/lib/types/anteater-api-types";

export type StudyRoomsByFilters =
	paths["/v2/rest/studyRooms"]["get"]["parameters"]["query"];

export type StudyRooms =
	paths["/v2/rest/studyRooms"]["get"]["responses"]["200"]["content"]["application/json"];

export const MeetingLengthSchema = z.union([
	z.literal(30),
	z.literal(60),
	z.literal(90),
	z.literal(120),
]);
export type MeetingLength = z.infer<typeof MeetingLengthSchema>;
export const MEETING_LENGTHS = [30, 60, 90, 120] as const;

export const CAPACITIES = ["1-2", "3-4", "5-6", "7-8", "9-12", "13+"] as const;
export type Capacity = (typeof CAPACITIES)[number];

export const BUILDINGS = [
	"Anteater Learning Pavilion",
	"Science Library",
	"Langson Library",
	"Gateway Study Center",
	"Plaza Verde",
	"Multimedia Resources Center",
	"Ayala Science Library",
] as const;
export type Building = (typeof BUILDINGS)[number];
