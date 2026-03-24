import type { StudyRooms } from "@/lib/types/studyrooms";

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
	const query: Record<string, string> = {
		dates: date,
		times: timeRange,
		...(location ? { location } : {}),
		...(capacityMin != null ? { capacityMin: String(capacityMin) } : {}),
		...(capacityMax != null ? { capacityMax: String(capacityMax) } : {}),
		...(isTechEnhanced != null
			? { isTechEnhanced: String(isTechEnhanced) }
			: {}),
	};
	const params = new URLSearchParams(query).toString();
	const apiUrl = `https://anteaterapi.com/v2/rest/studyRooms?${params}`;
	console.log("API URL:", apiUrl);
	const res = await fetch(apiUrl);
	if (!res.ok) {
		throw new Error(`API error: ${res.status} ${res.statusText}`);
	}
	const data: StudyRooms = await res.json();
	return { data: data.data };
}
