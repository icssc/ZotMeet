"use client";

import { useTheme } from "@mui/material/styles";
import {
	calculateBlockFill,
	computeMaxAvailability,
	scheduledEdgesFor,
	selectionEdgesFor,
} from "@zotmeet/shared";
import { Fragment, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { GroupAvailabilityBlock } from "@/components/availability/group-availability-block";
import type { GridCellHandlers } from "@/components/availability/table/availability-block-cell";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";
import { useStudyRoomPreviewMaps } from "@/components/availability/table/study-room-hover-context";
import { applyScheduleSelection } from "@/lib/availability/schedule-selection";
import {
	buildTimestampsByCell,
	formatScheduledTimeRange,
	generateCellKey,
	generateDateKey,
	getRowChrome,
	spacerBeforeDate,
} from "@/lib/availability/utils";
import type { Member } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

interface GroupAvailabilityProps {
	meetingTitle?: string;
	availabilityTimeBlocks: number[];
	fromTime: number;
	availabilityDates: ZotDate[];
	ifNeededDates: ZotDate[];
	currentPageAvailability: {
		availabilities: (ZotDate | null)[];
		ifNeeded: (ZotDate | null)[];
	};
	members: Member[];
	onMouseLeave: () => void;
	isScheduling: boolean;
	timeZone: string;
	handlers: GridCellHandlers;
}

export function GroupAvailability({
	meetingTitle,
	availabilityTimeBlocks,
	fromTime,
	availabilityDates,
	ifNeededDates,
	currentPageAvailability,
	members,
	onMouseLeave,
	isScheduling,
	timeZone,
	handlers,
}: GroupAvailabilityProps) {
	const theme = useTheme();
	const primaryColor = theme.palette.primary.main;

	const {
		currentPage,
		itemsPerPage,
		hoveredMember,
		selectedMembers,
		draftRange,
		hoverRange,
		committedRange,
		scheduledTimes,
		pendingAdds,
		pendingRemovals,
		showBestTimes,
	} = useAvailabilityStore(
		useShallow((state) => ({
			currentPage: state.currentPage,
			itemsPerPage: state.itemsPerPage,
			hoveredMember: state.hoveredMember,
			selectedMembers: state.selectedMembers,
			draftRange: state.draftRange,
			hoverRange: state.hoverRange,
			committedRange: state.committedRange,
			scheduledTimes: state.scheduledTimes,
			pendingAdds: state.pendingAdds,
			pendingRemovals: state.pendingRemovals,
			showBestTimes: state.enabled,
		})),
	);

	const numMembers = members.length;

	/** Live drag preview uses draftRange; otherwise pending/committed schedule times. */
	const displayScheduleTimestamps = useMemo(() => {
		if (isScheduling && draftRange) {
			return new Set(
				applyScheduleSelection({
					availabilityDates,
					range: draftRange,
					fromTimeMinutes: fromTime,
					timeZone,
				}),
			);
		}
		const effective = new Set([...scheduledTimes, ...pendingAdds]);
		for (const ts of pendingRemovals) {
			effective.delete(ts);
		}
		return effective;
	}, [
		isScheduling,
		draftRange,
		scheduledTimes,
		pendingAdds,
		pendingRemovals,
		availabilityDates,
		fromTime,
		timeZone,
	]);

	const { scheduledTimeRange, scheduledBlockCount } = useMemo(() => {
		return {
			scheduledTimeRange: formatScheduledTimeRange([
				...displayScheduleTimestamps,
			]),
			scheduledBlockCount: displayScheduleTimestamps.size,
		};
	}, [displayScheduleTimestamps]);

	const maxAvailability = useMemo(
		() =>
			showBestTimes && numMembers > 0
				? computeMaxAvailability(availabilityDates, ifNeededDates)
				: 0,
		[showBestTimes, numMembers, availabilityDates, ifNeededDates],
	);

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
	const { hoverCellPreviewByKey, selectedCellPreviewByKey } =
		useStudyRoomPreviewMaps();

	return (
		<>
			{availabilityTimeBlocks.map((timeBlock, blockIndex) => {
				const { isTopOfHour, isHalfHour, isLastRow } = getRowChrome(
					timeBlock,
					blockIndex,
					availabilityTimeBlocks.length,
				);

				return (
					<tr key={`block-${timeBlock}`}>
						<AvailabilityTimeTicks timeBlock={timeBlock} />
						{currentPageAvailability.availabilities.map(
							(selectedDate, pageDateIndex) => {
								const ifNeededDate =
									currentPageAvailability.ifNeeded[pageDateIndex];
								const key = generateDateKey({
									selectedDate,
									timeBlock,
									pageDateIndex,
								});

								if (!selectedDate) {
									// Hidden spacer columns treat hover-in as a grid-leave.
									return (
										<Fragment key={key}>
											{spacers[pageDateIndex] && (
												<td
													className="w-3 bg-paper md:w-4"
													aria-hidden="true"
													onMouseEnter={onMouseLeave}
												/>
											)}
											<td className="bg-paper" onMouseEnter={onMouseLeave} />
										</Fragment>
									);
								}

								const zotDateIndex = pageDateIndex + currentPage * itemsPerPage;

								const selectionEdges = selectionEdgesFor({
									draftRange,
									hoverRange,
									committedRange,
									isScheduling,
									zotDateIndex,
									blockIndex,
								});

								const timestamp =
									timestampsByCell.get(
										generateCellKey(zotDateIndex, blockIndex),
									) ?? "";

								const block = selectedDate.groupAvailability[timestamp] || [];
								const ifNeededBlock =
									ifNeededDate?.groupAvailability[timestamp] || [];
								const fill = calculateBlockFill({
									block,
									hoveredMember,
									selectedMembers,
									numMembers,
									showBestTimes,
									maxAvailability,
									ifNeededBlock,
								});

								const prevTimestamp =
									blockIndex > 0
										? (timestampsByCell.get(
												generateCellKey(zotDateIndex, blockIndex - 1),
											) ?? "")
										: "";
								const nextTimestamp =
									blockIndex < availabilityTimeBlocks.length - 1
										? (timestampsByCell.get(
												generateCellKey(zotDateIndex, blockIndex + 1),
											) ?? "")
										: "";
								const {
									isScheduled: blockIsScheduled,
									isTopEdge,
									isBottomEdge,
								} = scheduledEdgesFor({
									timestamp,
									prevTimestamp,
									nextTimestamp,
									scheduledTimestamps: displayScheduleTimestamps,
								});

								const tableCellStyles = cn(
									isTopOfHour ? "border-t-[1px] border-t-gray-base" : "",
									isHalfHour
										? "border-t border-t-gray-base [border-top-style:dotted]"
										: "",
									isLastRow ? "border-b-[1px]" : "",
									isHalfHour && !fill.stripes && "bg-paper",
								);

								const cellKey = generateCellKey(zotDateIndex, blockIndex);
								const roomPreview =
									hoverCellPreviewByKey.get(cellKey) ??
									selectedCellPreviewByKey.get(cellKey) ??
									null;
								const isRoomTopEdge = Boolean(roomPreview?.edges.top);
								const isRoomCovered = Boolean(roomPreview);
								const hasOverlayStack =
									isTopEdge ||
									isRoomTopEdge ||
									blockIsScheduled ||
									isRoomCovered;

								return (
									<Fragment key={key}>
										{spacers[pageDateIndex] && (
											<td className="w-3 bg-paper md:w-4" aria-hidden="true" />
										)}
										<td
											className={cn(
												"px-0 py-0",
												hasOverlayStack && "overflow-visible",
												// Schedule layers above room layers; both above availability fill.
												isTopEdge && "relative z-40",
												blockIsScheduled && !isTopEdge && "relative z-30",
												isRoomTopEdge && !blockIsScheduled && "relative z-20",
												isRoomCovered &&
													!isRoomTopEdge &&
													!blockIsScheduled &&
													"relative z-10",
											)}
										>
											<GroupAvailabilityBlock
												className={cn(
													"group-availability-block block",
													isScheduling &&
														"cursor-row-resize [touch-action:none]",
												)}
												onPointerDown={handlers.onPointerDown}
												onPointerMove={handlers.onPointerMove}
												onPointerUp={handlers.onPointerUp}
												onPointerCancel={handlers.onPointerCancel}
												onKeyDown={handlers.onKeyDown}
												onHoverCell={handlers.onCellHover}
												fill={fill}
												primaryColor={primaryColor}
												isScheduled={blockIsScheduled}
												isScheduledTopEdge={isTopEdge}
												isScheduledBottomEdge={isBottomEdge}
												scheduledMeetingTitle={
													isTopEdge ? meetingTitle : undefined
												}
												scheduledTimeRange={
													isTopEdge ? scheduledTimeRange : undefined
												}
												scheduledBlockCount={
													isTopEdge ? scheduledBlockCount : undefined
												}
												tableCellStyles={tableCellStyles}
												hasSpacerBefore={spacers[pageDateIndex]}
												dateIndex={zotDateIndex}
												blockIndex={blockIndex}
												selectionEdges={selectionEdges}
												isScheduling={isScheduling}
											/>
										</td>
									</Fragment>
								);
							},
						)}
					</tr>
				);
			})}
		</>
	);
}
