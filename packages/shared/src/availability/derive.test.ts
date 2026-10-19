import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { generateTimeBlocks } from "../chrono/time";
import {
	buildZotDateRowsForMeetingDays,
	deriveInitialAvailability,
} from "./derive";
import { isoStringForSlot } from "./grid";

const pacificTimeZone = "America/Los_Angeles";
const tokyoTimeZone = "Asia/Tokyo";

describe("deriveInitialAvailability", () => {
	const timeZone = "America/New_York";
	// 9 PM - 12:30 AM
	const timeBlocks = generateTimeBlocks(1260, 30);
	// 12 AM, Oct 12 and 13, New York
	const dayOne = "2026-10-12T04:00:00.000Z";
	const dayTwo = "2026-10-13T04:00:00.000Z";

	function derive(
		meetingDates: string[],
		saved: string[],
		zone = timeZone,
		blocks = timeBlocks,
	) {
		return deriveInitialAvailability({
			timezone: zone,
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
			availabilityTimeBlocks: blocks,
			mode: "availabilities",
		});
	}

	it("files a time before midnight under its own day", () => {
		const saved = ["2026-10-13T03:45:00.000Z"]; // 11:45 PM, Oct 12, New York
		const days = derive([dayOne], saved);

		assert.deepEqual(days[0].availability, saved);
		assert.deepEqual(Object.keys(days[0].groupAvailability), saved);
	});
	it("files a time after midnight under the day the window started", () => {
		const midnight = "2026-10-13T04:00:00.000Z"; // 12 AM, Oct 13, New York
		const midnightPlus15 = "2026-10-13T04:15:00.000Z"; // 12:15 AM, Oct 13, New York
		const saved = [midnight, midnightPlus15];
		const days = derive([dayOne], saved);

		assert.deepEqual(days[0].availability, saved);
		assert.deepEqual(Object.keys(days[0].groupAvailability), saved);
	});
	it("keeps each day's times apart when a meeting has two days", () => {
		const endOfDayOne = "2026-10-13T04:00:00.000Z"; // 12 AM, Oct 13, New York
		const startOfDayTwo = "2026-10-14T01:00:00.000Z"; // 9 PM, Oct 13, New York

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

	it("preserves the meeting day when UTC and local dates agree", () => {
		const meetingDate = "2026-10-26T07:00:00.000Z"; // 12 AM, Oct 26, Pacific
		const saved = ["2026-10-26T20:00:00.000Z"]; // 1 PM, Oct 26, Pacific
		const pacificTimeBlocks = generateTimeBlocks(540, 1020); // 9 AM - 5 PM

		const days = derive(
			[meetingDate],
			saved,
			pacificTimeZone,
			pacificTimeBlocks,
		);

		assert.equal(
			formatInTimeZone(days[0].day, pacificTimeZone, "yyyy-MM-dd"),
			"2026-10-26",
		);
		assert.deepEqual(days[0].availability, saved);
		assert.deepEqual(Object.keys(days[0].groupAvailability), saved);
	});
	it("preserves the local meeting day when its UTC date is the day before", () => {
		const tokyoMeetingDate = "2026-10-25T15:00:00.000Z"; // 12 AM, Oct 26, Tokyo
		const saved = ["2026-10-26T04:00:00.000Z"]; // 1 PM, Oct 26, Tokyo
		const tokyoTimeBlocks = generateTimeBlocks(540, 1020); // 9 AM - 5 PM

		const days = derive(
			[tokyoMeetingDate],
			saved,
			tokyoTimeZone,
			tokyoTimeBlocks,
		);

		assert.equal(
			formatInTimeZone(days[0].day, tokyoTimeZone, "yyyy-MM-dd"),
			"2026-10-26",
		);
		assert.deepEqual(days[0].availability, saved);
		assert.deepEqual(Object.keys(days[0].groupAvailability), saved);
	});
	it("shifts the meeting day when viewed in a timezone where it starts the next day", () => {
		const pacificMeetingDate = "2026-10-26T07:00:00.000Z"; // 12 AM, Oct 26, Pacific
		const saved = ["2026-10-26T20:00:00.000Z"]; // 1 PM, Oct 26, Pacific
		const tokyoTimeBlocks = generateTimeBlocks(60, 540); // 9 AM - 5 PM Pacific = 1 AM - 9 AM Tokyo

		const days = derive(
			[pacificMeetingDate],
			saved,
			tokyoTimeZone,
			tokyoTimeBlocks,
		);

		assert.equal(
			formatInTimeZone(days[0].day, tokyoTimeZone, "yyyy-MM-dd"),
			"2026-10-27",
		);
		assert.deepEqual(days[0].availability, saved);
		assert.deepEqual(Object.keys(days[0].groupAvailability), saved);
	});
	it("keeps a days-of-the-week meeting on its weekday in every timezone", () => {
		const sundayAnchorDate = "2023-01-01T00:00:00.000Z"; // Sunday
		const tokyoTimeBlocks = generateTimeBlocks(120, 600); // 9 AM - 5 PM Pacific = 2 AM - 10 AM Tokyo

		const days = derive([sundayAnchorDate], [], tokyoTimeZone, tokyoTimeBlocks);

		assert.equal(
			formatInTimeZone(days[0].day, tokyoTimeZone, "yyyy-MM-dd"),
			"2023-01-01",
		);
	});
});

describe("buildZotDateRowsForMeetingDays", () => {
	const pacificMeetingDate = "2026-10-26T07:00:00.000Z"; // 12 AM, Oct 26, Pacific

	it("preserves the meeting day when UTC and local dates agree", () => {
		const pacificTimeBlocks = generateTimeBlocks(540, 1020); // 9 AM - 5 PM

		const days = buildZotDateRowsForMeetingDays(
			[pacificMeetingDate],
			pacificTimeBlocks,
			pacificTimeZone,
		);

		assert.equal(
			formatInTimeZone(days[0].day, pacificTimeZone, "yyyy-MM-dd"),
			"2026-10-26",
		);
	});
	it("shifts the meeting day when viewed in a timezone where it starts the next day", () => {
		const tokyoTimeBlocks = generateTimeBlocks(60, 540); // 9 AM - 5 PM Pacific = 1 AM - 9 AM Tokyo

		const days = buildZotDateRowsForMeetingDays(
			[pacificMeetingDate],
			tokyoTimeBlocks,
			tokyoTimeZone,
		);

		assert.equal(
			formatInTimeZone(days[0].day, tokyoTimeZone, "yyyy-MM-dd"),
			"2026-10-27",
		);
	});
});
