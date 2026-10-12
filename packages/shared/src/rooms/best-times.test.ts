import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ZotDate } from "../availability/zotdate";
import {
	computeBestTimes,
	formatBestTimeNote,
	formatMinutes,
} from "./best-times";

const TZ = "UTC";
/** Grid starts at noon UTC, 15-minute rows. */
const FROM = 12 * 60;
const BLOCKS = 16;

function slot(day: number, row: number): string {
	return new Date(Date.UTC(2026, 9, day, 12, row * 15)).toISOString();
}

/** A day column where `rows[i]` lists who is free in row `i`. */
function column(day: number, rows: Record<number, string[]>): ZotDate {
	const group: Record<string, string[]> = {};
	for (const [row, ids] of Object.entries(rows)) {
		group[slot(day, Number(row))] = ids;
	}
	return new ZotDate(
		new Date(Date.UTC(2026, 9, day)),
		0,
		1440,
		false,
		[],
		group,
	);
}

function rowsOf(from: number, to: number, ids: string[]) {
	const rows: Record<number, string[]> = {};
	for (let r = from; r < to; r++) rows[r] = ids;
	return rows;
}

const empty = (day: number) => column(day, {});
const members = ["a", "b", "c", "d"];

describe("computeBestTimes", () => {
	it("returns nothing before anyone responds", () => {
		assert.deepEqual(
			computeBestTimes({
				availabilityDates: [empty(13)],
				ifNeededDates: [empty(13)],
				memberIds: members,
				fromTimeMinutes: FROM,
				blockCount: BLOCKS,
				timeZone: TZ,
			}),
			[],
		);
	});

	it("ranks by people free, then by length, then by start", () => {
		const avail = [
			// Oct 13: everyone for 1h at rows 0–3, then everyone for 2h at rows 8–15.
			column(13, { ...rowsOf(0, 4, members), ...rowsOf(8, 16, members) }),
			// Oct 14: everyone for 1h at rows 4–7.
			column(14, rowsOf(4, 8, members)),
		];
		const result = computeBestTimes({
			availabilityDates: avail,
			ifNeededDates: [empty(13), empty(14)],
			memberIds: members,
			fromTimeMinutes: FROM,
			blockCount: BLOCKS,
			timeZone: TZ,
		});

		assert.deepEqual(
			result.map((t) => [t.rank, t.dateIndex, t.startBlock, t.minutes]),
			[
				[1, 0, 8, 120],
				[2, 0, 0, 60],
				[3, 1, 4, 60],
			],
		);
		assert.equal(result[0].start, Date.parse(slot(13, 8)));
		assert.equal(result[0].end, Date.parse(slot(13, 16)));
		assert.deepEqual(result[0].missingMemberIds, []);
	});

	it("counts if-needed as free, like the Best Times toggle", () => {
		const result = computeBestTimes({
			availabilityDates: [column(13, rowsOf(0, 4, ["a", "b"]))],
			ifNeededDates: [column(13, rowsOf(0, 4, ["c"]))],
			memberIds: members,
			fromTimeMinutes: FROM,
			blockCount: BLOCKS,
			timeZone: TZ,
		});
		assert.equal(result.length, 1);
		assert.deepEqual(result[0].freeMemberIds, ["a", "b", "c"]);
		assert.deepEqual(result[0].missingMemberIds, ["d"]);
	});

	it("splits a run where the people free change", () => {
		const result = computeBestTimes({
			availabilityDates: [
				column(13, {
					...rowsOf(0, 2, ["a", "b", "c"]),
					...rowsOf(2, 4, ["a", "b", "d"]),
				}),
			],
			ifNeededDates: [empty(13)],
			memberIds: members,
			fromTimeMinutes: FROM,
			blockCount: BLOCKS,
			timeZone: TZ,
		});
		assert.deepEqual(
			result.map((t) => [t.startBlock, t.blockCount, t.missingMemberIds]),
			[
				[0, 2, ["d"]],
				[2, 2, ["c"]],
			],
		);
	});

	it("widens to one below the peak with slack, ranking the peak first", () => {
		const avail = [
			column(13, {
				...rowsOf(0, 2, members),
				...rowsOf(4, 12, ["a", "b", "c"]),
			}),
		];
		const input = {
			availabilityDates: avail,
			ifNeededDates: [empty(13)],
			memberIds: members,
			fromTimeMinutes: FROM,
			blockCount: BLOCKS,
			timeZone: TZ,
		};
		assert.equal(computeBestTimes(input).length, 1);
		assert.deepEqual(
			computeBestTimes({ ...input, slack: 1 }).map((t) => [
				t.freeMemberIds.length,
				t.minutes,
			]),
			[
				[4, 30],
				[3, 120],
			],
		);
	});

	it("caps the list at the limit", () => {
		const rows: Record<number, string[]> = {};
		for (let r = 0; r < BLOCKS; r += 2) rows[r] = members;
		const result = computeBestTimes({
			availabilityDates: [column(13, rows)],
			ifNeededDates: [empty(13)],
			memberIds: members,
			fromTimeMinutes: FROM,
			blockCount: BLOCKS,
			timeZone: TZ,
			limit: 3,
		});
		assert.deepEqual(
			result.map((t) => t.rank),
			[1, 2, 3],
		);
	});
});

describe("formatBestTimeNote", () => {
	it("names who is missing", () => {
		assert.equal(formatBestTimeNote([], 120), "Everyone · 2h");
		assert.equal(formatBestTimeNote(["Erin"], 120), "Erin busy · 2h");
		assert.equal(
			formatBestTimeNote(["Erin", "Sam"], 90),
			"Erin & Sam busy · 1h 30m",
		);
		assert.equal(formatBestTimeNote(["A", "B", "C"], 45), "3 busy · 45m");
	});

	it("formats minutes", () => {
		assert.equal(formatMinutes(30), "30m");
		assert.equal(formatMinutes(60), "1h");
		assert.equal(formatMinutes(150), "2h 30m");
	});
});
