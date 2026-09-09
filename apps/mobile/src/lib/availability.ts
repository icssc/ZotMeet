/**
 * Slot maths for the availability grid — the time-of-day counterpart to the
 * day maths in `./date.ts`.
 *
 * The grid in the wireframes ("[Meetings] Add Availability", Figma 211:12549)
 * is a column per day and a row per half hour. A cell is addressed by the day
 * it belongs to and its index within that day, and stored under a flat
 * `YYYY-MM-DD#index` key so a selection is a plain string-keyed record — the
 * same reasoning behind `toDateKey`, and it survives a timezone change.
 */

import { toDateKey } from "./date";

/**
 * The three states a cell can hold. `unavailable` is the absence of a
 * response, so it is stored as a deletion rather than a value — see
 * `paintSlots`.
 */
export type AvailabilityStatus = "available" | "if-needed" | "unavailable";

/** Every cell is half an hour, matching the dashed mid-line in each block. */
export const SLOT_MINUTES = 30;
export const SLOTS_PER_HOUR = 60 / SLOT_MINUTES;

/** A cell, as the grid addresses it before flattening to a key. */
export type SlotPos = { dayIndex: number; slotIndex: number };

/** `YYYY-MM-DD#index`. */
export type SlotKey = string;

export function toSlotKey(day: Date, slotIndex: number): SlotKey {
	return `${toDateKey(day)}#${slotIndex}`;
}

/**
 * Four letters, not three: the column headers in the wireframe read THUR, so
 * the abbreviation is the design's rather than `toLocaleDateString`'s.
 */
export const WEEKDAY_ABBR = [
	"SUN",
	"MON",
	"TUE",
	"WED",
	"THUR",
	"FRI",
	"SAT",
] as const;

/** `1/1` — the sub-label under the weekday, unpadded as in the design. */
export function toColumnDate(day: Date): string {
	return `${day.getMonth() + 1}/${day.getDate()}`;
}

/**
 * `9 AM`, `12 PM`, `11 PM`. Hours are 0–24 so the closing label of a range
 * ending at midnight reads `12 AM` rather than wrapping to `12 PM`.
 */
export function toHourLabel(hour: number): string {
	const wrapped = hour % 24;
	const period = wrapped < 12 ? "AM" : "PM";
	const display = wrapped % 12 === 0 ? 12 : wrapped % 12;
	return `${display} ${period}`;
}

/**
 * The boundary labels down the left edge. A grid of N hours has N+1 gridlines,
 * and the labels sit on the lines rather than inside the rows, which is why
 * this is one longer than the row count.
 */
export function hourLabels(startHour: number, endHour: number): string[] {
	return Array.from({ length: endHour - startHour + 1 }, (_, i) =>
		toHourLabel(startHour + i),
	);
}

/** Consecutive days starting at `from`, the window the two columns show. */
export function daysFrom(from: Date, count: number): Date[] {
	return Array.from(
		{ length: count },
		(_, i) => new Date(from.getFullYear(), from.getMonth(), from.getDate() + i),
	);
}

/** The same day window moved by `amount` days, for the ‹ › controls. */
export function shiftDays(from: Date, amount: number): Date {
	return new Date(from.getFullYear(), from.getMonth(), from.getDate() + amount);
}

/**
 * Every cell in the rectangle spanned by two corners, inclusive — a sweep can
 * run in any direction, and crossing into a second column paints both.
 */
export function slotsBetween(a: SlotPos, b: SlotPos): SlotPos[] {
	const [dayFrom, dayTo] =
		a.dayIndex <= b.dayIndex
			? [a.dayIndex, b.dayIndex]
			: [b.dayIndex, a.dayIndex];
	const [slotFrom, slotTo] =
		a.slotIndex <= b.slotIndex
			? [a.slotIndex, b.slotIndex]
			: [b.slotIndex, a.slotIndex];

	const out: SlotPos[] = [];
	for (let dayIndex = dayFrom; dayIndex <= dayTo; dayIndex++) {
		for (let slotIndex = slotFrom; slotIndex <= slotTo; slotIndex++) {
			out.push({ dayIndex, slotIndex });
		}
	}
	return out;
}

/**
 * Applies one committed sweep. Painting `unavailable` clears the cells rather
 * than recording a value, so an untouched grid and a grid painted entirely
 * unavailable are the same object — the wireframe draws both as empty.
 */
export function paintSlots(
	current: Record<SlotKey, AvailabilityStatus>,
	keys: SlotKey[],
	status: AvailabilityStatus,
): Record<SlotKey, AvailabilityStatus> {
	const next = { ...current };
	for (const key of keys) {
		if (status === "unavailable") delete next[key];
		else next[key] = status;
	}
	return next;
}
