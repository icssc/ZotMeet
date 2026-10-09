import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	getTrafficLevel,
	isLibraryTrafficLive,
	LIBRARY_TRAFFIC_LIVE_MS,
	type LibraryTrafficLocation,
	summarizeLibraryTraffic,
} from "./summary";

let nextId = 0;
const row = (
	libraryName: string,
	locationName: string,
	trafficCount: number,
	trafficPercentage: number | null,
	timestamp: string | null = "2026-01-01T12:00:00.000Z",
): LibraryTrafficLocation => ({
	id: nextId++,
	libraryName,
	locationName,
	trafficCount,
	trafficPercentage,
	timestamp,
});

describe("getTrafficLevel", () => {
	it("splits at 40% and 70%", () => {
		assert.equal(getTrafficLevel(0), "quiet");
		assert.equal(getTrafficLevel(0.39), "quiet");
		assert.equal(getTrafficLevel(0.4), "moderate");
		assert.equal(getTrafficLevel(0.69), "moderate");
		assert.equal(getTrafficLevel(0.7), "busy");
		assert.equal(getTrafficLevel(1.2), "busy");
	});
});

describe("summarizeLibraryTraffic", () => {
	it("weights each location by its estimated capacity", () => {
		const { libraries } = summarizeLibraryTraffic([
			// 10 of 100 and 45 of 50: 55 of 150.
			row("Langson Library", "1st Floor", 10, 0.1),
			row("Langson Library", "2nd Floor", 45, 0.9),
		]);
		assert.equal(libraries.length, 1);
		assert.ok(Math.abs((libraries[0].percentage ?? 0) - 55 / 150) < 1e-9);
		assert.equal(libraries[0].level, "quiet");
	});

	it("skips empty locations, and reads 0% when every one is empty", () => {
		const { libraries } = summarizeLibraryTraffic([
			row("Science Library", "4th Floor", 20, 0.5),
			row("Science Library", "5th Floor - iLab", 0, 0),
			row("Gateway Study Center", "2nd Floor", 0, 0),
		]);
		assert.equal(libraries[0].libraryName, "Science Library");
		assert.equal(libraries[0].percentage, 0.5);
		assert.equal(libraries[1].percentage, 0);
	});

	it("has no percentage when no location reports one", () => {
		const { libraries } = summarizeLibraryTraffic([
			row("Grunigen Medical Library", "Main", 12, null),
		]);
		assert.equal(libraries[0].percentage, null);
		assert.equal(libraries[0].level, null);
	});

	it("sorts busiest first and floors in numeric order", () => {
		const { libraries } = summarizeLibraryTraffic([
			row("Gateway Study Center", "2nd Floor", 5, 0.1),
			row("Langson Library", "10th Floor", 1, 0.8),
			row("Langson Library", "2nd Floor", 1, 0.8),
			row("Langson Library", "Basement", 1, 0.8),
		]);
		assert.deepEqual(
			libraries.map((l) => l.libraryName),
			["Langson Library", "Gateway Study Center"],
		);
		assert.deepEqual(
			libraries[0].locations.map((l) => l.locationName),
			["2nd Floor", "10th Floor", "Basement"],
		);
	});

	it("dates the overview by its newest reading", () => {
		const { updatedAt } = summarizeLibraryTraffic([
			row("A", "1", 1, 0.1, "2026-01-01T12:00:00.000Z"),
			row("B", "1", 1, 0.1, "2026-01-01T12:05:00.000Z"),
			row("C", "1", 1, 0.1, null),
		]);
		assert.equal(updatedAt?.toISOString(), "2026-01-01T12:05:00.000Z");
		assert.equal(summarizeLibraryTraffic([]).updatedAt, null);
	});
});

describe("isLibraryTrafficLive", () => {
	it("is live only within the window", () => {
		const at = new Date("2026-01-01T12:00:00.000Z");
		const ms = at.getTime();
		assert.equal(isLibraryTrafficLive(at, ms + LIBRARY_TRAFFIC_LIVE_MS), true);
		assert.equal(
			isLibraryTrafficLive(at, ms + LIBRARY_TRAFFIC_LIVE_MS + 1),
			false,
		);
		assert.equal(isLibraryTrafficLive(null, ms), false);
	});
});
