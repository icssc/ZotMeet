import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	bookableSlots,
	classifyRooms,
	countRoomsFreeForAnyBestTime,
	filterRoomFits,
	formatDayAndWindow,
	formatWindow,
	groupSimilarRooms,
	normalizeRooms,
	type StudyRoomLike,
	sortRoomFits,
	studyRoomQueryFor,
} from "./match";

/** 2026-10-13, 1:00 PM PDT is 20:00Z. */
const at = (hour: number, minute = 0) => Date.UTC(2026, 9, 13, hour, minute);

function room(
	name: string,
	free: [number, number][],
	{
		location = "Science Library",
		capacity = 4,
		techEnhanced = false,
		slotMinutes = 30,
	}: Partial<{
		location: string;
		capacity: number;
		techEnhanced: boolean;
		slotMinutes: number;
	}> = {},
): StudyRoomLike {
	const slots = [];
	for (let t = at(19); t < at(23); t += slotMinutes * 60_000) {
		const end = t + slotMinutes * 60_000;
		const isAvailable = free.some(([s, e]) => t >= s && end <= e);
		slots.push({
			start: new Date(t).toISOString(),
			end: new Date(end).toISOString(),
			url: `https://spaces.lib.uci.edu/space/${name}?date=${new Date(t).toISOString()}`,
			isAvailable,
		});
	}
	return {
		id: name,
		name,
		capacity,
		location,
		techEnhanced,
		url: `https://spaces.lib.uci.edu/space/${name}`,
		slots,
	};
}

const stretch = { start: at(20), end: at(22) };

describe("normalizeRooms", () => {
	it("drops nameless placeholders and merges booking-length variants", () => {
		const rooms = normalizeRooms([
			room("Science 471 (1 hour)", [[at(20), at(21)]]),
			room("Science 471 (2 hours)", [[at(21), at(22)]]),
			{ ...room("", [[at(20), at(22)]]), location: "", capacity: 0 },
		]);
		assert.equal(rooms.length, 1);
		assert.equal(rooms[0].label, "Sci Lib 471");
		assert.deepEqual(rooms[0].freeWindows, [{ start: at(20), end: at(22) }]);
	});
});

describe("classifyRooms", () => {
	it("separates rooms free for the whole stretch from partly free ones", () => {
		const rooms = normalizeRooms([
			room("Science 471", [[at(19), at(23)]]),
			room("Science 402", [[at(20, 30), at(21, 30)]]),
			room("Science 403", [[at(21, 45), at(22)]], { slotMinutes: 15 }),
			room("Science 404", []),
		]);
		const { whole, partial } = classifyRooms(rooms, stretch);

		assert.deepEqual(
			whole.map((f) => [f.room.label, f.minutes]),
			[["Sci Lib 471", 120]],
		);
		// 403's 15 minutes is too short to list; 404 is never free.
		assert.deepEqual(
			partial.map((f) => [f.room.label, f.window, f.minutes]),
			[["Sci Lib 402", { start: at(20, 30), end: at(21, 30) }, 60]],
		);
	});

	it("keeps the longest overlap when a room is free twice", () => {
		const rooms = normalizeRooms([
			room("Science 471", [
				[at(20), at(20, 30)],
				[at(21), at(22)],
			]),
		]);
		const { partial } = classifyRooms(rooms, stretch);
		assert.deepEqual(partial[0].window, { start: at(21), end: at(22) });
	});
});

describe("sortRoomFits + groupSimilarRooms", () => {
	const rooms = normalizeRooms([
		room("Science 10", [[at(20), at(22)]], { capacity: 4 }),
		room("Science 2", [[at(20), at(22)]], { capacity: 4 }),
		room("Gateway 2101", [[at(20), at(22)]], {
			location: "Gateway Study Center",
			capacity: 4,
		}),
		room("ALP 2510", [[at(20), at(22)]], {
			location: "Anteater Learning Pavilion",
			capacity: 10,
		}),
		room("Science 176", [[at(20), at(22)]], { capacity: 2 }),
		room("Science 277", [[at(20), at(22)]], {
			capacity: 4,
			techEnhanced: true,
		}),
	]);
	const { whole } = classifyRooms(rooms, stretch);

	it("puts rooms that fit the group first, then building, then name", () => {
		assert.deepEqual(
			sortRoomFits(whole, 4).map((f) => f.room.label),
			[
				"Gateway 2101",
				"Sci Lib 2",
				"Sci Lib 10",
				"Sci Lib 277",
				// Oversized for 4, then too small.
				"ALP 2510",
				"Sci Lib 176",
			],
		);
	});

	it("groups same building, seats, tech and window under the first room", () => {
		const groups = groupSimilarRooms(sortRoomFits(whole, 4));
		assert.deepEqual(
			groups.map((g) => [
				g.lead.room.label,
				g.similar.map((f) => f.room.label),
			]),
			[
				["Gateway 2101", []],
				["Sci Lib 2", ["Sci Lib 10"]],
				["Sci Lib 277", []],
				["ALP 2510", []],
				["Sci Lib 176", []],
			],
		);
	});

	it("filters by seats, building and free length; empty filters keep all", () => {
		assert.equal(filterRoomFits(whole, {}).length, whole.length);
		assert.deepEqual(
			filterRoomFits(whole, { minSeats: 5 }).map((f) => f.room.label),
			["ALP 2510"],
		);
		assert.equal(
			filterRoomFits(whole, { location: "Gateway Study Center" }).length,
			1,
		);
		assert.equal(filterRoomFits(whole, { minMinutes: 150 }).length, 0);
	});
});

describe("bookableSlots", () => {
	it("lists the free slots inside the room's window, each with its link", () => {
		const [r] = normalizeRooms([room("Science 471", [[at(19), at(23)]])]);
		const slots = bookableSlots(r, stretch);
		assert.deepEqual(
			slots.map((s) => new Date(s.start).toISOString().slice(11, 16)),
			["20:00", "20:30", "21:00", "21:30"],
		);
		assert.match(slots[0].url, /date=2026-10-13T20:00/);
	});

	it("supports 15-minute rooms", () => {
		const [r] = normalizeRooms([
			room("GML Quiet Room", [[at(20), at(21)]], {
				location: "Grunigen Medical Library",
				slotMinutes: 15,
			}),
		]);
		assert.equal(bookableSlots(r, { start: at(20), end: at(21) }).length, 4);
	});
});

describe("countRoomsFreeForAnyBestTime", () => {
	it("counts distinct rooms free for a whole best time, once each", () => {
		const day1 = normalizeRooms([
			room("Science 471", [[at(20), at(22)]]),
			room("Science 402", [[at(20), at(21)]]),
		]);
		const day2 = normalizeRooms([
			room("Science 471", [[at(20), at(22)]]),
			room("Science 403", [[at(20), at(22)]]),
		]);
		const stretches = [
			{ id: "0_0", ...stretch },
			{ id: "1_0", ...stretch },
		];
		const byStretch = new Map([
			["0_0", day1],
			["1_0", day2],
		]);
		assert.equal(countRoomsFreeForAnyBestTime(byStretch, stretches), 2);
		assert.equal(countRoomsFreeForAnyBestTime(new Map(), stretches), 0);
	});
});

describe("studyRoomQueryFor", () => {
	it("asks in campus time, widened to the half hour", () => {
		assert.deepEqual(studyRoomQueryFor({ start: at(20, 15), end: at(22) }), {
			date: "2026-10-13",
			timeRange: "1:00pm-3:00pm",
		});
	});
});

describe("formatWindow", () => {
	it("shares the meridiem when it can", () => {
		const tz = "America/Los_Angeles";
		assert.equal(formatWindow(stretch, tz), "1:00–3:00 PM");
		assert.equal(
			formatWindow({ start: at(18, 30), end: at(20) }, tz),
			"11:30 AM–1:00 PM",
		);
		assert.equal(formatDayAndWindow(stretch, tz), "Tue, Oct 13 · 1:00–3:00 PM");
	});
});
