import { BLOCK_LENGTH, TimeConstants, ZotDate } from "@zotmeet/shared";
import { View } from "react-native";
import {
	blockTop,
	DAY_HEADER_GAP,
	DAY_HEADER_HEIGHT,
	TIME_TICK_LINE_HEIGHT,
} from "@/components/availability/table/availability-table-metrics";
import { Text } from "@/components/ui/text";

interface AvailabilityTimeTicksProps {
	/** The grid's rows, as minutes past midnight — `generateTimeBlocks` output. */
	availabilityTimeBlocks: readonly number[];
}

/**
 * Native counterpart to the web app's
 * `components/availability/table/availability-time-ticks.tsx`. On the web
 * each tick is a `<td>` at the start of its hour's row; without a table the
 * ticks are one column, each label absolutely placed so it is centred on its
 * hour line. A grid that ends on the hour gets a closing label too, as the
 * hour line it sits on is the last block's bottom edge.
 */
export function AvailabilityTimeTicks({
	availabilityTimeBlocks,
}: AvailabilityTimeTicksProps) {
	const ticks: { minutes: number; y: number }[] = [];
	availabilityTimeBlocks.forEach((timeBlock, blockIndex) => {
		const minutesInDay = timeBlock % TimeConstants.MINUTES_PER_DAY;
		if (minutesInDay % 60 === 0) {
			ticks.push({ minutes: minutesInDay, y: blockTop(blockIndex) });
		}
	});
	const lastBlock = availabilityTimeBlocks.at(-1);
	if (lastBlock !== undefined) {
		const endMinutes =
			(lastBlock + BLOCK_LENGTH) % TimeConstants.MINUTES_PER_DAY;
		if (endMinutes % 60 === 0) {
			ticks.push({
				minutes: endMinutes,
				y: blockTop(availabilityTimeBlocks.length),
			});
		}
	}

	// Labels are centred on their hour line; the grid's top edge sits under
	// the day header.
	const gridTop = DAY_HEADER_HEIGHT + DAY_HEADER_GAP;
	const height = gridTop + blockTop(availabilityTimeBlocks.length);

	return (
		<View className="w-[35px]" style={{ height }}>
			{ticks.map(({ minutes, y }) => (
				<Text
					className="absolute right-0 text-right font-figtree-medium text-[11px] text-muted-foreground leading-4 tracking-[0.5px]"
					key={y}
					style={{ top: gridTop + y - TIME_TICK_LINE_HEIGHT / 2 }}
				>
					{ZotDate.toTimeBlockString(minutes, true)}
				</Text>
			))}
		</View>
	);
}
