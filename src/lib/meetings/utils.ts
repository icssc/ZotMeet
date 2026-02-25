import type { SelectScheduledMeeting } from "@/db/schema";

interface TimeInterval {
	from: string;
	to: string;
}

export function groupScheduledBlocksByDate(
	blocks: SelectScheduledMeeting[] = [],
) {
	const map = new Map<string, SelectScheduledMeeting[]>();

	for (const block of blocks) {
		const key = block.scheduledDate.toISOString().split("T")[0];
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
			throw new Error("Non-contiguous time blocks detected");
		}
	}

	return { from, to };
};
