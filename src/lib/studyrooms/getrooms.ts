import type { StudyRooms, StudyRoomsByFilters } from "@/lib/types/studyrooms";

export async function fetchStudyRooms({
	date,
	timeRange,
	location,
}: {
	date: string;
	timeRange: string;
	location?: string;
}) {
	const query: StudyRoomsByFilters = {
		dates: date,
		times: timeRange,
		...(location ? { location } : {}),
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
