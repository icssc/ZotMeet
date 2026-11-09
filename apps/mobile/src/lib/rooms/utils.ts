// Web counterpart: src/lib/rooms/utils.ts
// TEMPORARY STAND-INS: replace with web's implementations (or move both to
// @zotmeet/shared) so mobile and web bucket slots identically.
import type { StudyRooms } from "@zotmeet/shared";

type Slot = StudyRooms["data"][number]["slots"][number];

const HALF_HOUR_MS = 30 * 60 * 1000;

export function mergeDateAndTime(date: Date, time: Date): Date {
	return new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		time.getHours(),
		time.getMinutes(),
		0,
		0,
	);
}

export function buildHalfHourIntervals(date: Date, start: Date, end: Date) {
	const out: { label: string; start: Date; end: Date }[] = [];
	const s = mergeDateAndTime(date, start).getTime();
	const e = mergeDateAndTime(date, end).getTime();
	for (let t = s; t < e; t += HALF_HOUR_MS) {
		out.push({
			label: new Date(t).toLocaleTimeString([], {
				hour: "numeric",
				minute: "2-digit",
			}),
			start: new Date(t),
			end: new Date(t + HALF_HOUR_MS),
		});
	}
	return out;
}

export function groupSlotsIntoIntervals(
	slots: Slot[],
	intervals: ReturnType<typeof buildHalfHourIntervals>,
) {
	return intervals.map((iv) => ({
		intervalLabel: iv.label,
		slots: slots.filter((s) => {
			const t = new Date(s.start).getTime();
			return t >= iv.start.getTime() && t < iv.end.getTime();
		}),
	}));
}
