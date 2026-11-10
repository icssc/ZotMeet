import type { StudyRooms } from "@zotmeet/shared";

export async function fetchStudyRoomsShared(
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

	const res = await fetch(apiUrl, { signal });
	if (!res.ok) {
		throw new Error(`API error: ${res.status} ${res.statusText}`);
	}
	const data: StudyRooms = await res.json();
	return { data: data.data };
}
