import { libraryTrafficResponseSchema } from "@zotmeet/shared";

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
	const parsed = libraryTrafficResponseSchema.safeParse(await res.json());
	if (!parsed.success) {
		throw new Error(
			`Unexpected library traffic response: ${parsed.error.message}`,
		);
	}
	return parsed.data.data;
}
