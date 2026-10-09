/**
 * Library occupancy from Anteater API's `/v2/rest/libraryTraffic`, rolled up
 * from per-floor readings into one figure per library.
 */

/** One floor or section, as the API returns it. */
export type LibraryTrafficLocation = {
	id: number;
	libraryName: string;
	locationName: string;
	/** People currently detected. */
	trafficCount: number;
	/** Fraction of stated capacity: 0 to 1, or above 1 when over-occupied. */
	trafficPercentage: number | null;
	/** ISO 8601 time of the reading. */
	timestamp: string | null;
};

export type LibraryTrafficResponse = {
	ok: true;
	data: LibraryTrafficLocation[];
};

export type TrafficLevel = "quiet" | "moderate" | "busy";

export type LibraryTrafficSummary = {
	libraryName: string;
	/** Fraction of capacity across its locations; `null` when none report one. */
	percentage: number | null;
	level: TrafficLevel | null;
	/** Its floors and sections, in floor order. */
	locations: LibraryTrafficLocation[];
};

export type LibraryTrafficOverview = {
	/** Busiest first. */
	libraries: LibraryTrafficSummary[];
	/** Newest reading across every location. */
	updatedAt: Date | null;
};

/** Readings at most this old count as live. */
export const LIBRARY_TRAFFIC_LIVE_MS = 30 * 60 * 1000;

const MODERATE_FROM = 0.4;
const BUSY_FROM = 0.7;

export function getTrafficLevel(percentage: number): TrafficLevel {
	if (percentage >= BUSY_FROM) return "busy";
	if (percentage >= MODERATE_FROM) return "moderate";
	return "quiet";
}

/**
 * Library occupancy weighted by each location's capacity, so a packed study
 * room doesn't outweigh a half-empty reading room. The API reports no
 * capacity, so it is estimated as `count / percentage`; locations at 0% give
 * no estimate and are left out (an empty location adds nobody anyway).
 */
function getLibraryPercentage(locations: LibraryTrafficLocation[]) {
	let people = 0;
	let capacity = 0;
	let reported = false;
	for (const { trafficCount, trafficPercentage } of locations) {
		if (trafficPercentage === null) continue;
		reported = true;
		if (trafficPercentage <= 0) continue;
		people += trafficCount;
		capacity += trafficCount / trafficPercentage;
	}
	if (!reported) return null;
	return capacity > 0 ? people / capacity : 0;
}

function latestTimestamp(locations: LibraryTrafficLocation[]) {
	let latest: number | null = null;
	for (const { timestamp } of locations) {
		if (!timestamp) continue;
		const ms = Date.parse(timestamp);
		if (!Number.isNaN(ms) && (latest === null || ms > latest)) latest = ms;
	}
	return latest === null ? null : new Date(latest);
}

const byFloor = (a: LibraryTrafficLocation, b: LibraryTrafficLocation) =>
	a.locationName.localeCompare(b.locationName, "en", { numeric: true });

export function summarizeLibraryTraffic(
	rows: LibraryTrafficLocation[],
): LibraryTrafficOverview {
	const byLibrary = new Map<string, LibraryTrafficLocation[]>();
	for (const row of rows) {
		byLibrary.set(row.libraryName, [
			...(byLibrary.get(row.libraryName) ?? []),
			row,
		]);
	}

	const libraries = [...byLibrary].map(
		([libraryName, locations]): LibraryTrafficSummary => {
			const percentage = getLibraryPercentage(locations);
			return {
				libraryName,
				percentage,
				level: percentage === null ? null : getTrafficLevel(percentage),
				locations: [...locations].sort(byFloor),
			};
		},
	);
	libraries.sort(
		(a, b) =>
			(b.percentage ?? -1) - (a.percentage ?? -1) ||
			a.libraryName.localeCompare(b.libraryName),
	);

	return { libraries, updatedAt: latestTimestamp(rows) };
}

export function isLibraryTrafficLive(updatedAt: Date | null, nowMs: number) {
	return (
		updatedAt !== null && nowMs - updatedAt.getTime() <= LIBRARY_TRAFFIC_LIVE_MS
	);
}
