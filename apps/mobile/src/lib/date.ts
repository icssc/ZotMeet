/**
 * Minimal calendar maths for the native date picker. The web app uses
 * `date-fns`, which is not a dependency of `@zotmeet/mobile`; these few
 * helpers cover everything the month grid needs without adding one.
 *
 * Dates are handled in local time and keyed by `YYYY-MM-DD`, so a selection
 * survives timezone conversion (unlike an ISO instant).
 */

export const MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
] as const;

/** Sunday-first, matching the wireframe's S M T W T F S header row. */
export const WEEKDAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"] as const;

/** Local-time `YYYY-MM-DD`, used as the stable key for a selected day. */
export function toDateKey(date: Date): string {
	const month = `${date.getMonth() + 1}`.padStart(2, "0");
	const day = `${date.getDate()}`.padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}

export function startOfMonth(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function startOfDay(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addMonths(date: Date, amount: number): Date {
	return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function isSameDay(a: Date, b: Date): boolean {
	return toDateKey(a) === toDateKey(b);
}

/**
 * The month laid out as calendar weeks. Leading and trailing slots are `null`
 * rather than spill-over days, which is how the wireframe renders them — the
 * first row is right-aligned and the last row trails off.
 */
export function getMonthGrid(month: Date): (Date | null)[][] {
	const first = startOfMonth(month);
	const daysInMonth = new Date(
		month.getFullYear(),
		month.getMonth() + 1,
		0,
	).getDate();

	const cells: (Date | null)[] = [
		...Array.from({ length: first.getDay() }, () => null),
		...Array.from(
			{ length: daysInMonth },
			(_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1),
		),
	];

	while (cells.length % 7 !== 0) cells.push(null);

	return Array.from({ length: cells.length / 7 }, (_, row) =>
		cells.slice(row * 7, row * 7 + 7),
	);
}

/**
 * Every date from `a` to `b` inclusive, in ascending order, regardless of
 * which endpoint came first — a drag sweep can run backwards.
 *
 * Steps through local calendar fields rather than adding 24h, so a range that
 * crosses a DST boundary still yields one entry per calendar day.
 */
export function datesBetween(a: Date, b: Date): Date[] {
	const [from, to] = a <= b ? [a, b] : [b, a];
	const out: Date[] = [];
	const cursor = startOfDay(from);
	const last = startOfDay(to);
	while (cursor <= last) {
		out.push(new Date(cursor));
		cursor.setDate(cursor.getDate() + 1);
	}
	return out;
}
