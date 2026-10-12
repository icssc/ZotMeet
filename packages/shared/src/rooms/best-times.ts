import { getTimestampFromBlockIndex } from "../availability/grid";
import type { ZotDate } from "../availability/zotdate";
import { BLOCK_LENGTH } from "../chrono/time";

export interface BestTime {
	/** `${dateIndex}_${startBlock}`; stable while the grid's data is. */
	id: string;
	/** 1-based, in ranked order; the number drawn on the heatmap badge. */
	rank: number;
	dateIndex: number;
	startBlock: number;
	/** Rows covered, so the last row is `startBlock + blockCount - 1`. */
	blockCount: number;
	/** Epoch ms; `end` is exclusive. */
	start: number;
	end: number;
	minutes: number;
	freeMemberIds: string[];
	missingMemberIds: string[];
}

export interface ComputeBestTimesInput {
	availabilityDates: readonly ZotDate[];
	ifNeededDates: readonly ZotDate[];
	/** Everyone the "x/y free" total counts. */
	memberIds: readonly string[];
	fromTimeMinutes: number;
	blockCount: number;
	timeZone?: string;
	/**
	 * How far below the peak a slot may fall and still count. 0 is the Best
	 * Times toggle's rule; "Show more times" passes 1.
	 */
	slack?: number;
	limit?: number;
}

export const DEFAULT_BEST_TIME_LIMIT = 5;

function freeMembersAt(
	availabilityDay: ZotDate | undefined,
	ifNeededDay: ZotDate | undefined,
	timestamp: string,
): string[] {
	const ids = new Set<string>([
		...(availabilityDay?.groupAvailability[timestamp] ?? []),
		...(ifNeededDay?.groupAvailability[timestamp] ?? []),
	]);
	return [...ids].sort();
}

export function computeBestTimes({
	availabilityDates,
	ifNeededDates,
	memberIds,
	fromTimeMinutes,
	blockCount,
	timeZone,
	slack = 0,
	limit = DEFAULT_BEST_TIME_LIMIT,
}: ComputeBestTimesInput): BestTime[] {
	const cells: { timestamp: string; free: string[] }[][] = [];
	let peak = 0;
	for (let d = 0; d < availabilityDates.length; d++) {
		const column: { timestamp: string; free: string[] }[] = [];
		for (let b = 0; b < blockCount; b++) {
			const timestamp = getTimestampFromBlockIndex(
				b,
				d,
				fromTimeMinutes,
				availabilityDates,
				timeZone,
			);
			const free = freeMembersAt(
				availabilityDates[d],
				ifNeededDates[d],
				timestamp,
			);
			peak = Math.max(peak, free.length);
			column.push({ timestamp, free });
		}
		cells.push(column);
	}
	if (peak === 0) return [];

	const threshold = Math.max(1, peak - slack);
	const stretches: Omit<BestTime, "rank">[] = [];

	for (let d = 0; d < cells.length; d++) {
		const column = cells[d];
		let b = 0;
		while (b < column.length) {
			const first = column[b];
			if (first.free.length < threshold) {
				b++;
				continue;
			}
			const key = first.free.join(",");
			let next = b + 1;
			while (next < column.length && column[next].free.join(",") === key) {
				next++;
			}
			const start = new Date(first.timestamp).getTime();
			const rows = next - b;
			const minutes = rows * BLOCK_LENGTH;
			stretches.push({
				id: `${d}_${b}`,
				dateIndex: d,
				startBlock: b,
				blockCount: rows,
				start,
				end: start + minutes * 60_000,
				minutes,
				freeMemberIds: first.free,
				missingMemberIds: memberIds.filter((id) => !first.free.includes(id)),
			});
			b = next;
		}
	}

	stretches.sort(
		(a, b) =>
			b.freeMemberIds.length - a.freeMemberIds.length ||
			b.minutes - a.minutes ||
			a.start - b.start,
	);

	return stretches
		.slice(0, limit)
		.map((stretch, index) => ({ ...stretch, rank: index + 1 }));
}

/** "2h", "1h 30m", "45m". */
export function formatMinutes(minutes: number): string {
	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;
	if (hours === 0) return `${rest}m`;
	return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

/** The note under a best time: "Everyone · 2h", "Erin busy · 2h", "3 busy · 1h". */
export function formatBestTimeNote(
	missingNames: readonly string[],
	minutes: number,
): string {
	const who =
		missingNames.length === 0
			? "Everyone"
			: missingNames.length <= 2
				? `${missingNames.join(" & ")} busy`
				: `${missingNames.length} busy`;
	return `${who} · ${formatMinutes(minutes)}`;
}
