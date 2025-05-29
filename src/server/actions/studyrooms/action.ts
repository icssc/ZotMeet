import type { paths } from "@/lib/types/anteater-api-types";

type studyRoomsByFilters =
    paths["/v2/rest/studyRooms"]["get"]["parameters"]["query"];

type studyRooms =
    paths["/v2/rest/studyRooms"]["get"]["responses"]["200"]["content"]["application/json"];

export async function getStudyRoomProps(dates: string, times: string) {
    const query: studyRoomsByFilters = { dates, times };
    const params = new URLSearchParams(
        query as Record<string, string>
    ).toString();
    const apiUrl = `https://anteaterapi.com/v2/rest/studyRooms?${params}`;

    const res = await fetch(apiUrl);

    if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const data: studyRooms = await res.json();

    return {
        props: { data },
    };
}
