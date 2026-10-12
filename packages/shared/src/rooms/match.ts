import { formatInTimeZone } from "date-fns-tz";
import {
	formatLocation,
	formatRoomChipLabel,
	stripRoomDurationSuffix,
} from "./names";

export interface StudyRoomSlotLike {
	start: string;
	end: string;
	url: string;
	isAvailable: boolean;
}

export interface StudyRoomLike {
	id: string;
	name: string;
	capacity: number | null;
	location: string;
	techEnhanced: boolean | null;
	url: string;
	slots: readonly StudyRoomSlotLike[];
}

/** Epoch ms, `end` exclusive. */
export interface TimeWindow {
	start: number;
	end: number;
}

export interface BookableSlot extends TimeWindow {
	url: string;
}

/** One physical room: its booking-length variants merged, blank entries dropped. */
export interface Room {
	/** `name|location`, stable across days, so a room is counted once. */
	key: string;
	/** "Sci Lib 471". */
	label: string;
	location: string;
	/** "Sci Lib"; the building name when it has no short form. */
	building: string;
	capacity: number | null;
	techEnhanced: boolean;
	url: string;
	/** Available slots, by start, one per start time. */
	slots: BookableSlot[];
	/** Available slots merged where they touch. */
	freeWindows: TimeWindow[];
}

export type RoomFitKind = "whole" | "partial";

export interface RoomFit {
	room: Room;
	kind: RoomFitKind;
	/** The room's longest free stretch inside the best time. */
	window: TimeWindow;
	minutes: number;
}

/** Shorter overlaps aren't worth listing: no slot is shorter than 15m. */
export const MIN_PARTIAL_MINUTES = 30;

/** Campus wall clock; the API reads `dates`/`times` in it. */
export const CAMPUS_TIME_ZONE = "America/Los_Angeles";

const QUERY_ROUNDING_MS = 30 * 60_000;

export function normalizeRooms(raw: readonly StudyRoomLike[]): Room[] {
	const byKey = new Map<
		string,
		{ room: Room; slotByStart: Map<number, BookableSlot> }
	>();

	for (const entry of raw) {
		const name = stripRoomDurationSuffix(entry.name);
		// The feed carries nameless, seatless placeholders; nobody can book them.
		if (!name || !entry.location) continue;

		const key = `${name}|${entry.location}`;
		let bucket = byKey.get(key);
		if (!bucket) {
			bucket = {
				room: {
					key,
					label: formatRoomChipLabel(entry.location, name),
					location: entry.location,
					building: formatLocation(entry.location),
					capacity: entry.capacity || null,
					techEnhanced: Boolean(entry.techEnhanced),
					url: entry.url,
					slots: [],
					freeWindows: [],
				},
				slotByStart: new Map(),
			};
			byKey.set(key, bucket);
		}

		for (const slot of entry.slots) {
			if (!slot.isAvailable) continue;
			const start = new Date(slot.start).getTime();
			const end = new Date(slot.end).getTime();
			const existing = bucket.slotByStart.get(start);
			// Keep the longest slot for a start; any variant's link books it.
			if (!existing || end > existing.end) {
				bucket.slotByStart.set(start, { start, end, url: slot.url });
			}
		}
	}

	return [...byKey.values()].map(({ room, slotByStart }) => {
		const slots = [...slotByStart.values()].sort((a, b) => a.start - b.start);
		return { ...room, slots, freeWindows: mergeWindows(slots) };
	});
}

export function mergeWindows(windows: readonly TimeWindow[]): TimeWindow[] {
	const sorted = [...windows].sort((a, b) => a.start - b.start);
	const merged: TimeWindow[] = [];
	for (const w of sorted) {
		const last = merged.at(-1);
		if (last && w.start <= last.end) {
			last.end = Math.max(last.end, w.end);
		} else {
			merged.push({ start: w.start, end: w.end });
		}
	}
	return merged;
}

/** Whole if one free window covers the best time; otherwise its longest overlap. */
export function fitRoom(room: Room, stretch: TimeWindow): RoomFit | null {
	let best: TimeWindow | null = null;
	for (const w of room.freeWindows) {
		if (w.start <= stretch.start && w.end >= stretch.end) {
			return {
				room,
				kind: "whole",
				window: { start: stretch.start, end: stretch.end },
				minutes: (stretch.end - stretch.start) / 60_000,
			};
		}
		const start = Math.max(w.start, stretch.start);
		const end = Math.min(w.end, stretch.end);
		if (end > start && (!best || end - start > best.end - best.start)) {
			best = { start, end };
		}
	}
	if (!best) return null;
	const minutes = (best.end - best.start) / 60_000;
	if (minutes < MIN_PARTIAL_MINUTES) return null;
	return { room, kind: "partial", window: best, minutes };
}

export function classifyRooms(
	rooms: readonly Room[],
	stretch: TimeWindow,
): { whole: RoomFit[]; partial: RoomFit[] } {
	const whole: RoomFit[] = [];
	const partial: RoomFit[] = [];
	for (const room of rooms) {
		const fit = fitRoom(room, stretch);
		if (fit?.kind === "whole") whole.push(fit);
		else if (fit) partial.push(fit);
	}
	return { whole, partial };
}

/** Natural order without `Intl.Collator`: "Sci Lib 2" before "Sci Lib 10". */
function compareNatural(a: string, b: string): number {
	const re = /(\d+)|(\D+)/g;
	const pa = a.match(re) ?? [];
	const pb = b.match(re) ?? [];
	for (let i = 0; i < Math.min(pa.length, pb.length); i++) {
		const x = pa[i];
		const y = pb[i];
		if (x === y) continue;
		const nx = Number(x);
		const ny = Number(y);
		if (!Number.isNaN(nx) && !Number.isNaN(ny)) return nx - ny;
		return x < y ? -1 : 1;
	}
	return pa.length - pb.length;
}

/**
 * 0: seats the group without being oversized (up to double, or 2 spare);
 * 1: oversized; 2: too small or unknown.
 */
export function seatFit(capacity: number | null, groupSize: number): number {
	if (capacity == null || capacity < groupSize) return 2;
	const roomy = Math.max(groupSize * 2, groupSize + 2);
	return capacity <= roomy ? 0 : 1;
}

export function sortRoomFits(
	fits: readonly RoomFit[],
	groupSize: number,
): RoomFit[] {
	return [...fits].sort(
		(a, b) =>
			seatFit(a.room.capacity, groupSize) -
				seatFit(b.room.capacity, groupSize) ||
			b.minutes - a.minutes ||
			compareNatural(a.room.building, b.room.building) ||
			compareNatural(a.room.label, b.room.label),
	);
}

export interface RoomFitGroup {
	key: string;
	/** The row's room, first in sort order. */
	lead: RoomFit;
	/** Same building, seats, tech and free window; the "+5 similar" chip. */
	similar: RoomFit[];
}

/** Groups a sorted list, keeping the position of each group's first room. */
export function groupSimilarRooms(fits: readonly RoomFit[]): RoomFitGroup[] {
	const groups = new Map<string, RoomFitGroup>();
	for (const fit of fits) {
		const { room, window } = fit;
		const key = [
			room.location,
			room.capacity ?? "?",
			room.techEnhanced,
			window.start,
			window.end,
		].join("|");
		const group = groups.get(key);
		if (group) group.similar.push(fit);
		else groups.set(key, { key, lead: fit, similar: [] });
	}
	return [...groups.values()];
}

export interface RoomFitFilters {
	minSeats?: number | null;
	location?: string | null;
	minMinutes?: number | null;
}

export function filterRoomFits(
	fits: readonly RoomFit[],
	{ minSeats, location, minMinutes }: RoomFitFilters,
): RoomFit[] {
	return fits.filter(
		(fit) =>
			(!minSeats || (fit.room.capacity ?? 0) >= minSeats) &&
			(!location || fit.room.location === location) &&
			(!minMinutes || fit.minutes >= minMinutes),
	);
}

/** Slots a booking can start on: available, overlapping the window, by start. */
export function bookableSlots(room: Room, window: TimeWindow): BookableSlot[] {
	return room.slots.filter((s) => s.start < window.end && s.end > window.start);
}

export function countRoomsFreeForAnyBestTime(
	roomsByStretch: ReadonlyMap<string, readonly Room[]>,
	stretches: readonly (TimeWindow & { id: string })[],
): number {
	const keys = new Set<string>();
	for (const stretch of stretches) {
		for (const room of roomsByStretch.get(stretch.id) ?? []) {
			if (fitRoom(room, stretch)?.kind === "whole") keys.add(room.key);
		}
	}
	return keys.size;
}

function formatCampusClock(ms: number): string {
	const [h, m, ampm] = formatInTimeZone(ms, CAMPUS_TIME_ZONE, "h mm a").split(
		" ",
	);
	return `${h}:${m}${ampm.toLowerCase()}`;
}

/**
 * The API query for a best time, in campus wall clock and widened to the
 * half hour: a 1:15 start still needs the 1:00–1:30 slot to count as free.
 */
export function studyRoomQueryFor(stretch: TimeWindow): {
	date: string;
	timeRange: string;
} {
	const start =
		Math.floor(stretch.start / QUERY_ROUNDING_MS) * QUERY_ROUNDING_MS;
	const end = Math.ceil(stretch.end / QUERY_ROUNDING_MS) * QUERY_ROUNDING_MS;
	return {
		date: formatInTimeZone(start, CAMPUS_TIME_ZONE, "yyyy-MM-dd"),
		timeRange: `${formatCampusClock(start)}-${formatCampusClock(end)}`,
	};
}

/** "1:00–3:00 PM", or "11:30 AM–1:00 PM" across noon, in `timeZone`. */
export function formatWindow(window: TimeWindow, timeZone: string): string {
	const startMeridiem = formatInTimeZone(window.start, timeZone, "a");
	const endMeridiem = formatInTimeZone(window.end, timeZone, "a");
	const end = formatInTimeZone(window.end, timeZone, "h:mm a");
	const start = formatInTimeZone(
		window.start,
		timeZone,
		startMeridiem === endMeridiem ? "h:mm" : "h:mm a",
	);
	return `${start}–${end}`;
}

/** "Tue, Oct 13 · 1:00–3:00 PM". */
export function formatDayAndWindow(
	window: TimeWindow,
	timeZone: string,
): string {
	return `${formatInTimeZone(window.start, timeZone, "EEE, MMM d")} · ${formatWindow(window, timeZone)}`;
}

/** "1:00 PM". */
export function formatClock(ms: number, timeZone: string): string {
	return formatInTimeZone(ms, timeZone, "h:mm a");
}
