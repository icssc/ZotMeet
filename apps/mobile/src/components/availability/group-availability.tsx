import { View } from "react-native";
import { AvailabilityBlock } from "@/components/availability/table/availability-block";
import {
	type AvailabilityDateHeader,
	type AvailabilityDatePageNav,
	AvailabilityTableHeader,
} from "@/components/availability/table/availability-table-header";
import { DAY_HEADER_GAP } from "@/components/availability/table/availability-table-metrics";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";

export interface GroupAvailabilityProps {
	/** The dates on the current page — two at a time on mobile. */
	currentPageAvailability: AvailabilityDateHeader[];
	/** First labelled hour, 0–23. */
	startHour: number;
	/** Last labelled hour, 0–23. The grid draws `endHour - startHour` blocks. */
	endHour: number;
	datePageNav?: AvailabilityDatePageNav;
}

/**
 * Native counterpart to the web app's
 * `components/availability/group-availability.tsx`: the body of the
 * availability table. The web emits `<tr>`s of time tick + one block per date;
 * without a table this is a tick column beside one flex column per date, each
 * carrying its own header (see `AvailabilityTableHeader`).
 *
 * Presentational for now — no availability is painted into the cells.
 */
export function GroupAvailability({
	currentPageAvailability,
	startHour,
	endHour,
	datePageNav,
}: GroupAvailabilityProps) {
	const hourCount = Math.max(0, endHour - startHour);
	const hours = Array.from({ length: hourCount }, (_, i) => startHour + i);
	const lastIndex = currentPageAvailability.length - 1;

	return (
		<View className="w-full flex-row gap-2">
			<AvailabilityTimeTicks endHour={endHour} startHour={startHour} />

			<View className="flex-1 flex-row">
				{currentPageAvailability.map((dateHeader, index) => (
					<View
						className="flex-1 items-center"
						key={`${dateHeader.weekday}-${dateHeader.date}`}
						style={{ gap: DAY_HEADER_GAP }}
					>
						<AvailabilityTableHeader
							dateHeader={dateHeader}
							datePageNav={datePageNav}
							isFirstColumn={index === 0}
							isLastColumn={index === lastIndex}
						/>
						<View className="w-full bg-paper">
							{hours.map((hour, hourIndex) => (
								<AvailabilityBlock
									isLastRow={hourIndex === hourCount - 1}
									key={hour}
								/>
							))}
						</View>
					</View>
				))}
			</View>
		</View>
	);
}
