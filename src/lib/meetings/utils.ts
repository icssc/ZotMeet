import type { SelectScheduledMeeting } from "@/db/schema";

interface TimeInterval {
	from: string;
	to: string;
}

function formatLocalDateKey(date: Date): string {
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
}

export function groupScheduledBlocksByDate(
	blocks: SelectScheduledMeeting[] = [],
) {
	const map = new Map<string, SelectScheduledMeeting[]>();

	for (const block of blocks) {
		const key = formatLocalDateKey(block.scheduledDate);
		if (!map.has(key)) map.set(key, []);
		map.get(key)!.push(block);
	}

	return [...map.entries()]
		.map(([dateKey, blocks]) => ({
			dateKey,
			date: blocks[0].scheduledDate,
			blocks,
		}))
		.sort((a, b) => a.date.getTime() - b.date.getTime());
}

// Merge 15-min contiguous blocks into a single interval
export const mergeContiguousTimeBlocks = (
	blocks: SelectScheduledMeeting[],
): TimeInterval | null => {
	if (blocks.length === 0) return null;

	// Sort by start time
	const sorted = [...blocks].sort((a, b) =>
		a.scheduledFromTime.localeCompare(b.scheduledFromTime),
	);

	const from = sorted[0].scheduledFromTime;
	let to = sorted[0].scheduledToTime;

	for (let i = 1; i < sorted.length; i++) {
		const block = sorted[i];

		if (block.scheduledFromTime === to) {
			to = block.scheduledToTime;
		} else {
			return null; // Non-contiguous blocks found
		}
	}

	return { from, to };
};
