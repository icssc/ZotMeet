import type { StudyRooms, StudyRoomsByFilters } from "@/lib/types/studyrooms";

export async function fetchStudyRooms({
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
}) {
	const query: StudyRoomsByFilters = {
		dates: date,
		times: timeRange,
		...(location ? { location } : {}),
		...(capacityMin != null ? { capacityMin } : {}),
		...(capacityMax != null ? { capacityMax } : {}),
		...(isTechEnhanced != null ? { isTechEnhanced } : {}),
	};
	const params = new URLSearchParams(
		query as Record<string, string>,
	).toString();
	const apiUrl = `https://anteaterapi.com/v2/rest/studyRooms?${params}`;
	console.log("fetchStudyRooms →", apiUrl);

	const res = await fetch(apiUrl);
	if (!res.ok) {
		throw new Error(`API error: ${res.status} ${res.statusText}`);
	}
	const data: StudyRooms = await res.json();
	return { data: data.data };
}
