import {
	type BlockFill,
	buildTimestampsByCell,
	type CurrentPageAvailability,
	calculateBlockFill,
	generateCellKey,
	getRowChrome,
	type MeetingType,
	type Member,
	spacerBeforeDate,
	type ZotDate,
} from "@zotmeet/shared";
import { useMemo, useState } from "react";
import { type LayoutChangeEvent, View } from "react-native";
import { AvailabilityBlock } from "@/components/availability/table/availability-block";
import {
	type AvailabilityDatePageNav,
	AvailabilityTableHeader,
} from "@/components/availability/table/availability-table-header";
import {
	blockTop,
	DAY_HEADER_GAP,
	DAY_HEADER_HEIGHT,
} from "@/components/availability/table/availability-table-metrics";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";
import { StripeBackdrop } from "@/components/availability/table/stripe-backdrop";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

export interface GroupAvailabilityProps {
	availabilityTimeBlocks: number[];
	fromTime: number;
	availabilityDates: ZotDate[];
	currentPageAvailability: CurrentPageAvailability;
	members: Member[];
	meetingType: MeetingType;
	timeZone: string;
	datePageNav?: AvailabilityDatePageNav;
}

/**
 * Native counterpart to the web app's
 * `components/availability/group-availability.tsx`: the body of the
 * availability table. The web emits `<tr>`s of time tick + one block per date;
 * without a table this is a tick column beside one flex column per date, each
 * carrying its own header (see `AvailabilityTableHeader`).
 *
 * Every cell's fill is the shared `calculateBlockFill`, fed exactly what the
 * web feeds it; only the drawing differs. The web's member filter, hover, and
 * best-times inputs are not in the mobile store yet, so they are passed as
 * their idle values (best-times is what would need `ifNeededDates` and
 * `computeMaxAvailability` here).
 */
export function GroupAvailability({
	availabilityTimeBlocks,
	fromTime,
	availabilityDates,
	currentPageAvailability,
	members,
	meetingType,
	timeZone,
	datePageNav,
}: GroupAvailabilityProps) {
	const { currentPage, itemsPerPage } = useAvailabilityStore();
	const numMembers = members.length;

	const timestampsByCell = useMemo(
		() =>
			buildTimestampsByCell(
				availabilityDates,
				availabilityTimeBlocks.length,
				fromTime,
				timeZone,
			),
		[availabilityDates, availabilityTimeBlocks, fromTime, timeZone],
	);

	const spacers = spacerBeforeDate(currentPageAvailability.availabilities);
	const lastIndex = currentPageAvailability.availabilities.length - 1;
	const columnHeight = blockTop(availabilityTimeBlocks.length);

	// The stripe backdrop is sized from the column's measured width.
	const [columnWidth, setColumnWidth] = useState(0);
	const onColumnLayout = (event: LayoutChangeEvent) =>
		setColumnWidth(event.nativeEvent.layout.width);

	return (
		<View className="w-full flex-row gap-2">
			<AvailabilityTimeTicks availabilityTimeBlocks={availabilityTimeBlocks} />

			<View className="flex-1 flex-row">
				{currentPageAvailability.availabilities.map(
					(selectedDate, pageDateIndex) => {
						const ifNeededDate =
							currentPageAvailability.ifNeeded[pageDateIndex];
						const zotDateIndex = pageDateIndex + currentPage * itemsPerPage;
						const hasSpacerBefore = spacers[pageDateIndex];

						return (
							<View
								className={`flex-1 items-center ${hasSpacerBefore ? "ml-3" : ""}`}
								key={
									selectedDate
										? selectedDate.valueOf()
										: `padding-${pageDateIndex}`
								}
								style={{ gap: DAY_HEADER_GAP }}
							>
								{selectedDate ? (
									<AvailabilityTableHeader
										dateHeader={selectedDate.day}
										datePageNav={datePageNav}
										isFirstColumn={pageDateIndex === 0}
										isLastColumn={pageDateIndex === lastIndex}
										meetingType={meetingType}
									/>
								) : (
									// The last page pads to full width with empty paper columns,
									// as the web's `<td className="bg-paper" />` does.
									<View style={{ height: DAY_HEADER_HEIGHT }} />
								)}

								<View
									className="w-full bg-paper"
									onLayout={pageDateIndex === 0 ? onColumnLayout : undefined}
									style={{ height: columnHeight }}
								>
									{selectedDate && (
										<>
											<StripeBackdrop
												height={columnHeight}
												width={columnWidth}
											/>
											{availabilityTimeBlocks.map((timeBlock, blockIndex) => {
												const timestamp =
													timestampsByCell.get(
														generateCellKey(zotDateIndex, blockIndex),
													) ?? "";
												const fill: BlockFill = calculateBlockFill({
													block:
														selectedDate.groupAvailability[timestamp] ?? [],
													ifNeededBlock:
														ifNeededDate?.groupAvailability[timestamp] ?? [],
													hoveredMember: null,
													selectedMembers: [],
													numMembers,
													showBestTimes: false,
													maxAvailability: 0,
												});

												return (
													<AvailabilityBlock
														blockIndex={blockIndex}
														chrome={getRowChrome(
															timeBlock,
															blockIndex,
															availabilityTimeBlocks.length,
														)}
														fill={fill}
														hasSpacerBefore={
															hasSpacerBefore || pageDateIndex === 0
														}
														key={timeBlock}
													/>
												);
											})}
										</>
									)}
								</View>
							</View>
						);
					},
				)}
			</View>
		</View>
	);
}
