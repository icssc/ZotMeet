import type { MeetingType } from "@zotmeet/shared";
import { View } from "react-native";
import { AvailabilityBlock } from "@/components/availability/table/availability-block";
import {
	type AvailabilityDatePageNav,
	AvailabilityTableHeader,
} from "@/components/availability/table/availability-table-header";
import { DAY_HEADER_GAP } from "@/components/availability/table/availability-table-metrics";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";

export interface GroupAvailabilityProps {
	/** The dates on the current page — two at a time on mobile — as local midnights. */
	currentPageAvailability: Date[];
	meetingType: MeetingType;
	/** First labelled hour, 0–23. */
	startHour: number;
	/**
	 * Last labelled hour. May exceed 23 for a range that wraps past midnight;
	 * the grid draws `endHour - startHour` blocks either way.
	 */
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
 * Presentational for now — no availability is painted into the cells, and
 * the rows are whole hours rather than the web's 15-minute blocks, so a
 * meeting that starts or ends mid-hour shows up to 59 extra minutes of grid.
 */
export function GroupAvailability({
	currentPageAvailability,
	meetingType,
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
						key={dateHeader.getTime()}
						style={{ gap: DAY_HEADER_GAP }}
					>
						<AvailabilityTableHeader
							dateHeader={dateHeader}
							datePageNav={datePageNav}
							isFirstColumn={index === 0}
							isLastColumn={index === lastIndex}
							meetingType={meetingType}
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
