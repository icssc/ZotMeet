import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isValidStartEndTimes } from "./time";

describe("isValidStartEndTimes", () => {
	it("accepts an end time after the start time", () => {
		assert.equal(isValidStartEndTimes("09:00:00", "17:00:00"), true);
		assert.equal(isValidStartEndTimes("09:00:00", "23:45:00"), true);
	});
	it("treats a 12 AM end time as the end of the day", () => {
		assert.equal(isValidStartEndTimes("09:00:00", "00:00:00"), true);
		assert.equal(isValidStartEndTimes("23:45:00", "00:00:00"), true);
	});
	it("treats a 12 AM start time as the start of the day", () => {
		assert.equal(isValidStartEndTimes("00:00:00", "09:00:00"), true);
	});
	it("rejects an end time before the start time", () => {
		assert.equal(isValidStartEndTimes("17:00:00", "09:00:00"), false);
		assert.equal(isValidStartEndTimes("17:00:00", "00:15:00"), false);
	});
	it("rejects equal start and end times", () => {
		assert.equal(isValidStartEndTimes("09:00:00", "09:00:00"), false);
		assert.equal(isValidStartEndTimes("00:00:00", "00:00:00"), false);
	});
});
