import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	type LibraryTrafficLocation,
	libraryTrafficResponseSchema,
} from "./schema";
import {
	getTrafficLevel,
	isLibraryTrafficLive,
	LIBRARY_TRAFFIC_LIVE_MS,
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

	it("gives empty locations the median capacity, and reads 0% when every one is empty", () => {
		const { libraries } = summarizeLibraryTraffic([
			// 20 of 40, and the empty iLab borrows 40 seats: 20 of 80.
			row("Science Library", "4th Floor", 20, 0.5),
			row("Science Library", "5th Floor - iLab", 0, 0),
			row("Gateway Study Center", "2nd Floor", 0, 0),
		]);
		assert.equal(libraries[0].libraryName, "Science Library");
		assert.equal(libraries[0].percentage, 0.25);
		assert.equal(libraries[1].percentage, 0);
	});

	it("borrows the median, not the mean, capacity", () => {
		const { libraries } = summarizeLibraryTraffic([
			// Capacities 10, 20 and 300; the empty floor borrows 20.
			row("Langson Library", "1st Floor", 5, 0.5),
			row("Langson Library", "2nd Floor", 10, 0.5),
			row("Langson Library", "3rd Floor", 150, 0.5),
			row("Langson Library", "4th Floor", 0, 0),
		]);
		assert.ok(Math.abs((libraries[0].percentage ?? 0) - 165 / 350) < 1e-9);
	});

	it("has no percentage when no location reports one", () => {
		const { libraries } = summarizeLibraryTraffic([
			row("Grunigen Medical Library", "Main", 12, null),
		]);
		assert.equal(libraries[0].percentage, null);
		assert.equal(libraries[0].level, null);
	});

	it("sorts busiest first and floors basement-up", () => {
		const { libraries } = summarizeLibraryTraffic([
			row("Gateway Study Center", "2nd Floor", 5, 0.1),
			row("Langson Library", "Lobby", 1, 0.8),
			row("Langson Library", "10th Floor", 1, 0.8),
			row("Langson Library", "2nd Floor - Holden Room", 1, 0.8),
			row("Langson Library", "2nd Floor", 1, 0.8),
			row("Langson Library", "1st Floor", 1, 0.8),
			row("Langson Library", "Basement", 1, 0.8),
		]);
		assert.deepEqual(
			libraries.map((l) => l.libraryName),
			["Langson Library", "Gateway Study Center"],
		);
		assert.deepEqual(
			libraries[0].locations.map((l) => l.locationName),
			[
				"Basement",
				"1st Floor",
				"2nd Floor",
				"2nd Floor - Holden Room",
				"10th Floor",
				"Lobby",
			],
		);
	});

	it("dates each library by its newest reading, and the overview by its stalest library", () => {
		const { libraries, updatedAt } = summarizeLibraryTraffic([
			row("A", "1", 1, 0.3, "2026-01-01T06:00:00.000Z"),
			row("A", "2", 1, 0.3, "2026-01-01T12:00:00.000Z"),
			row("B", "1", 1, 0.2, "2026-01-01T12:05:00.000Z"),
			row("C", "1", 1, 0.1, null),
		]);
		assert.deepEqual(
			libraries.map((l) => l.updatedAt?.toISOString() ?? null),
			["2026-01-01T12:00:00.000Z", "2026-01-01T12:05:00.000Z", null],
		);
		assert.equal(updatedAt?.toISOString(), "2026-01-01T12:00:00.000Z");
		assert.equal(summarizeLibraryTraffic([]).updatedAt, null);
	});
});

describe("libraryTrafficResponseSchema", () => {
	it("accepts the API's shape and rejects anything else", () => {
		const valid = {
			ok: true,
			data: [row("Langson Library", "1st Floor", 90, 0.52)],
		};
		assert.equal(libraryTrafficResponseSchema.safeParse(valid).success, true);
		assert.equal(
			libraryTrafficResponseSchema.safeParse({ ok: false, error: "down" })
				.success,
			false,
		);
		const { trafficCount: _, ...noCount } = valid.data[0];
		assert.equal(
			libraryTrafficResponseSchema.safeParse({ ok: true, data: [noCount] })
				.success,
			false,
		);
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
