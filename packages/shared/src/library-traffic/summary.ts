/**
 * Library occupancy from Anteater API's `/v2/rest/libraryTraffic`, rolled up
 * from per-floor readings into one figure per library.
 */

import type { LibraryTrafficLocation } from "./schema";

export type TrafficLevel = "quiet" | "moderate" | "busy";

export type LibraryTrafficSummary = {
	libraryName: string;
	/** Fraction of capacity across its locations; `null` when none report one. */
	percentage: number | null;
	level: TrafficLevel | null;
	/** Its floors and sections, in floor order. */
	locations: LibraryTrafficLocation[];
	/** Newest reading among its locations. */
	updatedAt: Date | null;
};

export type LibraryTrafficOverview = {
	/** Busiest first. */
	libraries: LibraryTrafficSummary[];
	/**
	 * The oldest library's `updatedAt`, so the overview is only as fresh as
	 * its stalest library. Libraries with no dated reading are left out.
	 */
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

function median(values: number[]) {
	const sorted = [...values].sort((a, b) => a - b);
	const mid = sorted.length >> 1;
	return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Library occupancy weighted by each location's capacity, so a packed study
 * room doesn't outweigh a half-empty reading room. The API reports no
 * capacity, so it is estimated as `count / percentage`. A location at 0% gives
 * no estimate, but its seats still count: it borrows the median capacity of
 * the library's other locations and adds nobody.
 */
function getLibraryPercentage(locations: LibraryTrafficLocation[]) {
	let people = 0;
	let empty = 0;
	const capacities: number[] = [];
	for (const { trafficCount, trafficPercentage } of locations) {
		if (trafficPercentage === null) continue;
		if (trafficPercentage === 0) {
			empty++;
		} else if (trafficCount > 0) {
			people += trafficCount;
			capacities.push(trafficCount / trafficPercentage);
		}
	}
	if (capacities.length === 0) return empty > 0 ? 0 : null;
	const capacity =
		capacities.reduce((sum, c) => sum + c, 0) + empty * median(capacities);
	return people / capacity;
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

/** Basement first, then numbered floors, then anything unnumbered. */
function floorRank(locationName: string) {
	if (/^(basement|lower level)\b/i.test(locationName)) return 0;
	const floor = /^(\d+)(?:st|nd|rd|th)?\s+floor\b/i.exec(locationName);
	return floor ? Number(floor[1]) : Number.POSITIVE_INFINITY;
}

const byFloor = (a: LibraryTrafficLocation, b: LibraryTrafficLocation) =>
	floorRank(a.locationName) - floorRank(b.locationName) ||
	a.locationName.localeCompare(b.locationName, "en", { numeric: true });

export function summarizeLibraryTraffic(
	rows: LibraryTrafficLocation[],
): LibraryTrafficOverview {
	const byLibrary = new Map<string, LibraryTrafficLocation[]>();
	for (const row of rows) {
		const locations = byLibrary.get(row.libraryName);
		if (locations) locations.push(row);
		else byLibrary.set(row.libraryName, [row]);
	}

	const libraries = [...byLibrary].map(
		([libraryName, locations]): LibraryTrafficSummary => {
			const percentage = getLibraryPercentage(locations);
			return {
				libraryName,
				percentage,
				level: percentage === null ? null : getTrafficLevel(percentage),
				locations: [...locations].sort(byFloor),
				updatedAt: latestTimestamp(locations),
			};
		},
	);
	libraries.sort(
		(a, b) =>
			(b.percentage ?? -1) - (a.percentage ?? -1) ||
			a.libraryName.localeCompare(b.libraryName),
	);

	let oldest: Date | null = null;
	for (const { updatedAt } of libraries) {
		if (updatedAt && (oldest === null || updatedAt < oldest))
			oldest = updatedAt;
	}

	return { libraries, updatedAt: oldest };
}

export function isLibraryTrafficLive(updatedAt: Date | null, nowMs: number) {
	return (
		updatedAt !== null && nowMs - updatedAt.getTime() <= LIBRARY_TRAFFIC_LIVE_MS
	);
}
