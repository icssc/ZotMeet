import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatClock, formatMinutes, formatWindow } from "./format";

const TZ = "America/Los_Angeles";
/** 2026-10-13, 1:00 PM PDT is 20:00Z. */
const at = (hour: number, minute = 0) => Date.UTC(2026, 9, 13, hour, minute);

describe("formatMinutes", () => {
	it("drops a zero part", () => {
		assert.equal(formatMinutes(30), "30m");
		assert.equal(formatMinutes(60), "1h");
		assert.equal(formatMinutes(150), "2h 30m");
	});
});

describe("formatWindow", () => {
	it("shares the meridiem when it can", () => {
		assert.equal(
			formatWindow({ start: at(20), end: at(22) }, TZ),
			"1:00–3:00 PM",
		);
		assert.equal(
			formatWindow({ start: at(18, 30), end: at(20) }, TZ),
			"11:30 AM–1:00 PM",
		);
	});
});

describe("formatClock", () => {
	it("reads in the given time zone", () => {
		assert.equal(formatClock(at(20), TZ), "1:00 PM");
		assert.equal(formatClock(at(20), "UTC"), "8:00 PM");
	});
});
