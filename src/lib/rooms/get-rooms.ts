import { fetchStudyRoomsShared } from "@zotmeet/shared";
import type { StudyRooms } from "@/lib/types/studyrooms";
export async function fetchStudyRooms(
	{
		date,
		timeRange,
		location,
		capacityMin,
		capacityMax,
		isTechEnhanced,
	}: {
		date: string;
		timeRange: string;
		location?: string;
		capacityMin?: number;
		capacityMax?: number;
		isTechEnhanced?: boolean;
	},
	{ signal }: { signal?: AbortSignal } = {},
) {
	return fetchStudyRoomsShared(
		{ date, timeRange, location, capacityMin, capacityMax, isTechEnhanced },
		{ signal },
	);
}
