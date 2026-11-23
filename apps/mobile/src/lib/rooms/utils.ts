import type { StudyRooms } from "@zotmeet/shared";

type Slot = StudyRooms["data"][number]["slots"][number];

const HALF_HOUR_MS = 30 * 60 * 1000;

export const WINDOW_MS = 6 * 60 * 60 * 1000;

export function getNextHalfHour(from: Date = new Date()): Date {
	const d = new Date(from);
	const remainder = d.getMinutes() % 30;
	if (remainder === 0 && d.getSeconds() === 0 && d.getMilliseconds() === 0)
		return d;
	d.setMinutes(d.getMinutes() + (remainder === 0 ? 30 : 30 - remainder), 0, 0);
	return d;
}
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
			end: new Date(Math.min(t + HALF_HOUR_MS, e)),
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
