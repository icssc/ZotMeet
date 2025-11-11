import { StudyRooms, StudyRoomsByFilters } from "@/lib/types/studyrooms";

export async function getStudyRooms(dates: string, times: string) {
    const query: StudyRoomsByFilters = { dates, times };
    const params = new URLSearchParams(
        query as Record<string, string>
    ).toString();
    const apiUrl = `https://anteaterapi.com/v2/rest/studyRooms?${params}`;

    const res = await fetch(apiUrl);
    if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    const data: StudyRooms = await res.json();
    return { data: data.data };
}
