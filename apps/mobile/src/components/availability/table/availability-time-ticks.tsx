import { View } from "react-native";
import {
	DAY_HEADER_GAP,
	DAY_HEADER_HEIGHT,
	HOUR_HEIGHT,
	TIME_TICK_LINE_HEIGHT,
} from "@/components/availability/table/availability-table-metrics";
import { Text } from "@/components/ui/text";

/**
 * "9 AM", "12 PM", "1 PM" — the format the wireframe's time column uses.
 * Hours past 23 belong to a range that wraps past midnight and label the
 * next day's clock.
 */
function formatHour(hour: number): string {
	const clockHour = hour % 24;
	const twelveHour = clockHour % 12 === 0 ? 12 : clockHour % 12;
	return `${twelveHour} ${clockHour < 12 ? "AM" : "PM"}`;
}

interface AvailabilityTimeTicksProps {
	/** First labelled hour, 0–23. */
	startHour: number;
	/** Last labelled hour, inclusive; may exceed 23 when the range wraps midnight. */
	endHour: number;
}

/**
 * Native counterpart to the web app's
 * `components/availability/table/availability-time-ticks.tsx`. On the web
 * each tick is a `<td>` at the start of its hour's row; without a table the
 * ticks are one column, each label owning one hour of height and centred on
 * its hour line.
 */
export function AvailabilityTimeTicks({
	startHour,
	endHour,
}: AvailabilityTimeTicksProps) {
	const hours = Array.from(
		{ length: Math.max(0, endHour - startHour) + 1 },
		(_, i) => startHour + i,
	);
	const lastIndex = hours.length - 1;

	// The first label is centred on the top hour line, which sits under the
	// day header, so the column starts half a line box above it.
	const paddingTop =
		DAY_HEADER_HEIGHT + DAY_HEADER_GAP - TIME_TICK_LINE_HEIGHT / 2;

	return (
		<View className="w-[35px] items-end" style={{ paddingTop }}>
			{hours.map((hour, index) => (
				<Text
					className="text-right font-figtree-medium text-[11px] text-muted-foreground leading-4 tracking-[0.5px]"
					key={hour}
					style={{
						height: index === lastIndex ? TIME_TICK_LINE_HEIGHT : HOUR_HEIGHT,
					}}
				>
					{formatHour(hour)}
				</Text>
			))}
		</View>
	);
}
