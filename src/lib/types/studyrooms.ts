import type { paths } from "@/lib/types/anteater-api-types";

export type StudyRoomsByFilters =
	paths["/v2/rest/studyRooms"]["get"]["parameters"]["query"];

export type StudyRooms =
	paths["/v2/rest/studyRooms"]["get"]["responses"]["200"]["content"]["application/json"];

// Single room item from the API
export type StudyRoomFromApi = StudyRooms["data"][number];

// Grouped structure used by the UI
export type GroupedRooms = {
	location: string;
	rooms: {
		id: string;
		name: string;
		capacity: number;
	}[];
}[];
