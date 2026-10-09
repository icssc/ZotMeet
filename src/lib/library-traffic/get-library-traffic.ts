import type { LibraryTrafficResponse } from "@zotmeet/shared";

export async function fetchLibraryTraffic({
	signal,
}: {
	signal?: AbortSignal;
} = {}) {
	const res = await fetch("https://anteaterapi.com/v2/rest/libraryTraffic", {
		signal,
	});
	if (!res.ok) {
		throw new Error(`API error: ${res.status} ${res.statusText}`);
	}
	const data: LibraryTrafficResponse = await res.json();
	return data.data;
}
