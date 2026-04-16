import { formatLocalDateKey } from "@/lib/meetings/utils";
import type { ZotDate } from "@/lib/zotdate";

export const formatISOToLocalTime = (isoString: string): string => {
	return new Date(isoString)
		.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
			//timeZone: "UTC",
		})
		.toLowerCase();
};

const HALF_HOUR_MS = 30 * 60 * 1000;

/** Calendar day + clock from `time` (same semantics as date pickers + time pickers). */
export function mergeDateAndTime(date: Date, time: Date): Date {
	const d = new Date(date);
	d.setHours(
		time.getHours(),
		time.getMinutes(),
		time.getSeconds(),
		time.getMilliseconds(),
	);
	return d;
}

export type HalfHourInterval = { label: string; start: Date; end: Date };

/** One row of labels per half-hour block between start and end on `day` (local). */
export function buildHalfHourIntervals(
	day: Date,
	startTime: Date,
	endTime: Date,
): HalfHourInterval[] {
	const intervals: HalfHourInterval[] = [];
	const windowStart = mergeDateAndTime(day, startTime);
	const windowEnd = mergeDateAndTime(day, endTime);

	let current = windowStart;
	while (current < windowEnd) {
		const intervalEnd = new Date(
			Math.min(current.getTime() + HALF_HOUR_MS, windowEnd.getTime()),
		);
		intervals.push({
			label: formatISOToLocalTime(current.toISOString()),
			start: new Date(current),
			end: intervalEnd,
		});
		current = intervalEnd;
	}
	return intervals;
}

/** Slot start in [windowStart, windowEnd) — same rule as RoomResults. */
export function isSlotStartInQueryWindow(
	slotStartIso: string,
	windowStart: Date,
	windowEnd: Date,
): boolean {
	const t = new Date(slotStartIso);
	return t >= windowStart && t < windowEnd;
}

export function findSlotOverlappingInterval<
	T extends { start: string; end: string },
>(
	slots: T[],
	intervalStart: Date,
	intervalEnd: Date,
	windowStart: Date,
	windowEnd: Date,
): T | undefined {
	const candidates = slots.filter((s) =>
		isSlotStartInQueryWindow(s.start, windowStart, windowEnd),
	);
	const overlapping = candidates.filter((s) => {
		const ss = new Date(s.start);
		const se = new Date(s.end);
		return ss < intervalEnd && se > intervalStart;
	});
	overlapping.sort(
		(a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
	);
	return overlapping[0];
}

/** Earliest-starting slot whose interval overlaps `[rangeStart, rangeEnd)`. */
export function findFirstSlotOverlappingRange<
	T extends { start: string; end: string },
>(slots: T[], rangeStart: Date, rangeEnd: Date): T | undefined {
	const overlapping = slots.filter((s) => {
		const ss = new Date(s.start);
		const se = new Date(s.end);
		return ss < rangeEnd && se > rangeStart;
	});
	overlapping.sort(
		(a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
	);
	return overlapping[0];
}

// returns an array of formatted times in 30 min intervals
export const buildTimeArray = (
	slotStart: string,
	slotEnd: string,
): string[] => {
	const timestamps = [];

	const start = new Date(slotStart);
	const end = new Date(slotEnd);

	let current = start;
	while (current < end) {
		timestamps.push(formatISOToLocalTime(current.toISOString()));
		current = new Date(current.getTime() + HALF_HOUR_MS);
	}

	return timestamps;
};

export type SlotBucket<T> = {
	intervalLabel: string;
	intervalStart: Date;
	slots: T[];
};

// returns an array. each SlotBucket represents a 30 minute window.
// if a room uses 15-minute slots, two of them will fall under a single window
export function groupSlotsIntoIntervals<
	T extends { start: string; end: string },
>(slots: T[], intervals: HalfHourInterval[]): SlotBucket<T>[] {
	return intervals.map((interval) => {
		const matching = slots.filter((s) => {
			const ss = new Date(s.start);
			return ss >= interval.start && ss < interval.end;
		});
		matching.sort(
			(a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
		);
		return {
			intervalLabel: interval.label,
			intervalStart: interval.start,
			slots: matching,
		};
	});
}

// to fit api format, am/pm is needed
function formatRange(start: Date, end: Date) {
	const format = (d: Date) => {
		let hours = d.getHours();
		const minutes = d.getMinutes().toString().padStart(2, "0");

		const ampm = hours >= 12 ? "pm" : "am";
		hours = hours % 12;
		if (hours === 0) hours = 12;

		return `${hours}:${minutes}${ampm}`;
	};
	const rangeEnd = new Date(end.getTime() + 15 * 60 * 1000);
	return `${format(start)}-${format(rangeEnd)}`;
}

export function getBestTimeRanges(availabilityDates: ZotDate[]) {
	let max = 0;

	availabilityDates.forEach((date) => {
		Object.values(date.groupAvailability).forEach((memberIds) => {
			max = Math.max(max, (memberIds as string[]).length);
		});
	});

	const timestamps: string[] = [];

	availabilityDates.forEach((date) => {
		Object.entries(date.groupAvailability).forEach(
			([timestamp, memberIds]: [string, unknown]) => {
				const threshold = Math.max(1, max - 1); // allows near-best and single user availability
				if ((memberIds as string[]).length >= threshold) {
					timestamps.push(timestamp);
				}
			},
		);
	});

	if (!timestamps.length) return [];
	const sorted = [...timestamps].sort();
	const results: { date: string; time: string }[] = [];

	let start = new Date(sorted[0]);
	let prev = start;

	for (let i = 1; i < sorted.length; i++) {
		const curr = new Date(sorted[i]);

		const diffMinutes = (curr.getTime() - prev.getTime()) / 60000;

		const sameDay = formatLocalDateKey(curr) === formatLocalDateKey(prev);

		if (diffMinutes !== 15 || !sameDay) {
			results.push({
				date: formatLocalDateKey(start),
				time: formatRange(start, prev),
			});
			start = curr;
		}
		prev = curr;
	}

	results.push({
		date: formatLocalDateKey(start),
		time: formatRange(start, prev),
	});

	return results;
}

// helper function for capacity - move somewhere else?
export function getCapacityRange(capacities: string[]) {
	if (capacities.length === 0) return {};

	let min = Infinity;
	let max = -Infinity;

	for (const cap of capacities) {
		if (cap === "13+") {
			min = Math.min(min, 13);
			max = Infinity;
		} else {
			const [low, high] = cap.split("-").map(Number);
			min = Math.min(min, low);
			max = Math.max(max, high);
		}
	}

	return {
		capacityMin: min !== Infinity ? min : undefined,
		capacityMax: max !== Infinity ? max : undefined,
	};
}
