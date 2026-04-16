import type { paths } from "@/lib/types/anteater-api-types";

export type StudyRoomsByFilters =
	paths["/v2/rest/studyRooms"]["get"]["parameters"]["query"];

export type StudyRooms =
	paths["/v2/rest/studyRooms"]["get"]["responses"]["200"]["content"]["application/json"];

export interface RoomResult {
	id: string;
	name: string;
	capacity?: number;
	building?: string;
	bookingUrl?: string;
}
