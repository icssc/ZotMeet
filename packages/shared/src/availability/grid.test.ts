import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isoStringForSlot } from "./grid";

describe("isoStringForSlot", () => {
	const day = new Date("2026-10-05T12:00:00.000Z");

	it("returns the same day for a time before midnight", () => {
		assert.equal(
			isoStringForSlot(day, 1380, "America/New_York"),
			"2026-10-06T03:00:00.000Z",
		);
	});
	it("rolls 1440 minutes into midnight of the next day", () => {
		assert.equal(
			isoStringForSlot(day, 1440, "America/New_York"),
			"2026-10-06T04:00:00.000Z",
		);
	});
	it("rolls a time after midnight into the next day", () => {
		assert.equal(
			isoStringForSlot(day, 1455, "America/New_York"),
			"2026-10-06T04:15:00.000Z",
		);
		assert.equal(
			isoStringForSlot(day, 1500, "America/New_York"),
			"2026-10-06T05:00:00.000Z",
		);
	});
});
