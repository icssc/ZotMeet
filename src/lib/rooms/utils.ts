export const formatISOToLocalTime = (isoString: string): string => {
	return new Date(isoString)
		.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
			timeZone: "America/Los_Angeles",
		})
		.toLowerCase();
};

const HALF_HOUR_MS = 30 * 60 * 1000;

/** Round `from` up to the next 30-min boundary. Rolls to next day if needed. */
export function getNextHalfHour(from: Date = new Date()): Date {
	const d = new Date(from);
	const remainder = d.getMinutes() % 30;
	if (remainder === 0 && d.getSeconds() === 0 && d.getMilliseconds() === 0)
		return d;
	d.setMinutes(d.getMinutes() + (remainder === 0 ? 30 : 30 - remainder), 0, 0);
	return d;
}

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
export const toLocalStr = (d: Date) => {
	const h = d.getHours();
	const m = d.getMinutes();
	return `${h % 12 || 12}:${m.toString().padStart(2, "0")}${h >= 12 ? "pm" : "am"}`;
};

const WINDOW_MS = 6 * 60 * 60 * 1000;

export function getDefaultWindow() {
	const now = new Date();
	const start = getNextHalfHour(now);

	const elevenPm = new Date(now);
	elevenPm.setHours(23, 0, 0, 0);

	if (start >= elevenPm) {
		const nextDay = new Date(now);
		nextDay.setDate(nextDay.getDate() + 1);
		nextDay.setHours(11, 0, 0, 0);
		const end = new Date(nextDay.getTime() + WINDOW_MS);
		return { start: nextDay, end };
	}

	const rawEnd = new Date(start.getTime() + WINDOW_MS);
	const end = rawEnd > elevenPm ? elevenPm : rawEnd;
	return { start, end };
}
