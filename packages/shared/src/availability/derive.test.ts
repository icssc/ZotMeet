import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fromZonedTime } from "date-fns-tz";
import { generateTimeBlocks } from "../chrono/time";
import { deriveInitialAvailability } from "./derive";
import { isoStringForSlot } from "./grid";

describe("deriveInitialAvailability", () => {
	const timeZone = "America/New_York";
	// 9PM - 12:30 AM
	const timeBlocks = generateTimeBlocks(1260, 30);
	// Midnight Oct 12 and 13 in New York
	const dayOne = "2026-10-12T04:00:00.000Z";
	const dayTwo = "2026-10-13T04:00:00.000Z";

	function derive(meetingDates: string[], saved: string[]) {
		return deriveInitialAvailability({
			timezone: timeZone,
			meetingDates,
			userId: "member-1",
			allAvailabilities: [
				{
					memberId: "member-1",
					displayName: "Test Member",
					profilePicture: null,
					meetingAvailabilities: saved,
					ifNeededAvailabilities: [],
				},
			],
			availabilityTimeBlocks: timeBlocks,
			mode: "availabilities",
		});
	}

	it("files a time before midnight under its own day", () => {
		const saved = ["2026-10-13T03:45:00.000Z"]; // Oct 12 11:45 PM in New York
		const days = derive([dayOne], saved);

		assert.deepEqual(days[0].availability, saved);
		assert.deepEqual(Object.keys(days[0].groupAvailability), saved);
	});
	it("files a time after midnight under the day the window started", () => {
		const midnight = "2026-10-13T04:00:00.000Z"; // Oct 13, 12:00 AM in New York
		const midnightPlus15 = "2026-10-13T04:15:00.000Z"; // Oct 13, 12:15 AM in New York
		const saved = [midnight, midnightPlus15];
		const days = derive([dayOne], saved);

		assert.deepEqual(days[0].availability, saved);
		assert.deepEqual(Object.keys(days[0].groupAvailability), saved);
	});
	it("keeps each day's times apart when a meeting has two days", () => {
		//Both times are on Oct 13 in New York
		const endOfDayOne = "2026-10-13T04:00:00.000Z"; // 12:00 AM
		const startOfDayTwo = "2026-10-14T01:00:00.000Z"; //9:00 PM

		const saved = [endOfDayOne, startOfDayTwo];
		const days = derive([dayOne, dayTwo], saved);

		assert.deepEqual(days[0].availability, [endOfDayOne]);
		assert.deepEqual(days[1].availability, [startOfDayTwo]);
		assert.deepEqual(Object.keys(days[0].groupAvailability), [endOfDayOne]);
		assert.deepEqual(Object.keys(days[1].groupAvailability), [startOfDayTwo]);
	});
	it("loads every saved slot back into the day it was saved under", () => {
		const slotsFor = (date: string) =>
			timeBlocks.map((minutes) =>
				isoStringForSlot(
					fromZonedTime(`${date}T00:00:00`, timeZone),
					minutes,
					timeZone,
				),
			);

		const dayOneSlots = slotsFor("2026-10-12");
		const dayTwoSlots = slotsFor("2026-10-13");
		const saved = [...dayOneSlots, ...dayTwoSlots];

		const days = derive([dayOne, dayTwo], saved);

		assert.deepEqual(days[0].availability, dayOneSlots);
		assert.deepEqual(days[1].availability, dayTwoSlots);
		assert.deepEqual(Object.keys(days[0].groupAvailability), dayOneSlots);
		assert.deepEqual(Object.keys(days[1].groupAvailability), dayTwoSlots);
	});
});
