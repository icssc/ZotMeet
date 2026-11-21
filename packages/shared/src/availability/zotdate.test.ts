import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fromZonedTime } from "date-fns-tz";
import { ZotDate } from "./zotdate";

describe("ZotDate.toTimeBlockString", () => {
	it("formats a morning time", () => {
		assert.equal(ZotDate.toTimeBlockString(540, false), "9:00 AM");
		assert.equal(ZotDate.toTimeBlockString(540, true), "9 AM");
		assert.equal(ZotDate.toTimeBlockString(570, false), "9:30 AM");
	});
	it("formats noon as 12 PM", () => {
		assert.equal(ZotDate.toTimeBlockString(720, false), "12:00 PM");
		assert.equal(ZotDate.toTimeBlockString(720, true), "12 PM");
	});
	it("formats 0 minutes as 12 AM", () => {
		assert.equal(ZotDate.toTimeBlockString(0, false), "12:00 AM");
		assert.equal(ZotDate.toTimeBlockString(0, true), "12 AM");
	});
	it("formats 1440 minutes as 12 AM", () => {
		assert.equal(ZotDate.toTimeBlockString(1440, false), "12:00 AM");
		assert.equal(ZotDate.toTimeBlockString(1440, true), "12 AM");
	});
	it("formats a time past 1440 minutes as a time of day", () => {
		assert.equal(ZotDate.toTimeBlockString(1455, false), "12:15 AM");
		assert.equal(ZotDate.toTimeBlockString(1500, false), "1:00 AM");
	});
});

describe("ZotDate.setBlockAvailabilities", () => {
	const timeZone = "America/New_York";
	const columnFor = (earliestTime: number, latestTime: number) =>
		new ZotDate(
			fromZonedTime("2026-10-12T00:00:00", timeZone),
			earliestTime,
			latestTime,
			false,
			[],
			{},
			timeZone,
		);

	it("clears a slot after midnight", () => {
		const column = columnFor(1260, 1470); // 9 PM - 12:30 AM
		column.setBlockAvailabilities(10, 13, true);
		assert.equal(column.availability.length, 4);

		column.setBlockAvailabilities(10, 13, false);
		assert.deepEqual(column.availability, []);
	});

	it("keeps the slots outside the cleared range", () => {
		const column = columnFor(1260, 1470); // 9 PM - 12:30 AM
		column.setBlockAvailabilities(10, 13, true);
		assert.equal(column.availability.length, 4);
		column.setBlockAvailabilities(11, 12, false);
		assert.deepEqual(column.availability, [
			"2026-10-13T03:30:00.000Z", // 11:30 PM
			"2026-10-13T04:15:00.000Z", // 12:15 AM
		]);
	});

	it("clears slots in a column inside one day", () => {
		const column = columnFor(540, 1020); // 9 AM - 5 PM
		column.setBlockAvailabilities(0, 3, true);
		assert.equal(column.availability.length, 4);
		column.setBlockAvailabilities(1, 2, false);
		assert.deepEqual(column.availability, [
			"2026-10-12T13:00:00.000Z",
			"2026-10-12T13:45:00.000Z",
		]);
	});
});
