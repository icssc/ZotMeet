import type { paths } from "@/lib/types/anteater-api-types";
 
type studyRoomsByFilters = paths["/v2/rest/courses"]["get"]["parameters"]["query"];

  export async function getStudyRoomProps() {
  try {
    const res = await fetch('https://anteaterapi.com/v2/rest/studyRooms');

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const data: studyRoomsByFilters = await res.json();

    return {
      props: { data },
    };
  } catch (error) {
    console.error('Fetch error:', error.message);

    return {
      props: {
        data: null,
        error: error.message || 'Unknown error',
      },
    };
  }
}