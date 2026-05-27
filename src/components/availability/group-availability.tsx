"use client";

import { alpha, useTheme } from "@mui/material/styles";
import { Fragment, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import {
	type BlockFill,
	EMPTY_FILL,
	GroupAvailabilityBlock,
} from "@/components/availability/group-availability-block";
import type { GridCellHandlers } from "@/components/availability/table/availability-block-cell";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";
import { useStudyRoomPreviewMaps } from "@/components/availability/table/study-room-hover-context";
import { applyScheduleSelection } from "@/lib/availability/schedule-selection";
import {
	formatScheduledTimeRange,
	generateCellKey,
	generateDateKey,
	getTimestampFromBlockIndex,
	spacerBeforeDate,
} from "@/lib/availability/utils";
import {
	type Member,
	rangeCoversCell,
	type SelectionStateType,
} from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

function proportionalFill(
	available: number,
	ifNeeded: number,
	denominator: number,
	primaryColor: string,
): BlockFill {
	if (denominator === 0) return EMPTY_FILL;
	return {
		solid:
			available > 0
				? { color: alpha(primaryColor, available / denominator) }
				: null,
		stripes: ifNeeded > 0 ? { opacity: ifNeeded / denominator } : null,
	};
}

function calculateBlockFill({
	block,
	hoveredMember,
	selectedMembers,
	numMembers,
	showBestTimes,
	maxAvailability,
	primaryColor,
	ifNeededBlock,
}: {
	block: string[];
	hoveredMember: string | null;
	selectedMembers: string[];
	numMembers: number;
	showBestTimes: boolean;
	maxAvailability: number;
	primaryColor: string;
	ifNeededBlock: string[];
}): BlockFill {
	if (selectedMembers.length) {
		const selectedAvailable = selectedMembers.filter((memberId) =>
			block.includes(memberId),
		).length;
		const selectedIfNeeded = selectedMembers.filter((memberId) =>
			ifNeededBlock.includes(memberId),
		).length;
		return proportionalFill(
			selectedAvailable,
			selectedIfNeeded,
			selectedMembers.length,
			primaryColor,
		);
	}

	if (hoveredMember) {
		return proportionalFill(
			block.includes(hoveredMember) ? 1 : 0,
			ifNeededBlock.includes(hoveredMember) ? 1 : 0,
			1,
			primaryColor,
		);
	}

	if (showBestTimes) {
		const combined = block.length + ifNeededBlock.length;
		if (combined === maxAvailability && maxAvailability > 0) {
			return proportionalFill(
				block.length,
				ifNeededBlock.length,
				numMembers,
				primaryColor,
			);
		}
		return EMPTY_FILL;
	}

	if (numMembers) {
		return proportionalFill(
			block.length,
			ifNeededBlock.length,
			numMembers,
			primaryColor,
		);
	}

	return EMPTY_FILL;
}

export interface SelectionEdges {
	top: boolean;
	right: boolean;
	bottom: boolean;
	left: boolean;
}

function edgesFor(
	range: SelectionStateType | undefined,
	zotDateIndex: number,
	blockIndex: number,
): SelectionEdges | null {
	if (!rangeCoversCell(range, zotDateIndex, blockIndex)) return null;
	// biome-ignore lint/style/noNonNullAssertion: rangeCoversCell guarantees range is defined
	const r = range!;
	return {
		top: blockIndex === r.earlierBlockIndex,
		bottom: blockIndex === r.laterBlockIndex,
		left: zotDateIndex === r.earlierDateIndex,
		right: zotDateIndex === r.laterDateIndex,
	};
}

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

	const maxAvailability = useMemo(() => {
		if (!showBestTimes || numMembers === 0) return 0;
		let max = 0;
		for (let i = 0; i < availabilityDates.length; i++) {
			const availDay = availabilityDates[i];
			const ifNeededDay = ifNeededDates[i];
			const timestamps = new Set<string>([
				...Object.keys(availDay?.groupAvailability ?? {}),
				...Object.keys(ifNeededDay?.groupAvailability ?? {}),
			]);
			for (const ts of timestamps) {
				const a = availDay?.groupAvailability[ts]?.length ?? 0;
				const n = ifNeededDay?.groupAvailability[ts]?.length ?? 0;
				max = Math.max(max, a + n);
			}
		}
		return max;
	}, [showBestTimes, numMembers, availabilityDates, ifNeededDates]);

	const timestampsByCell = useMemo(() => {
		const map = new Map<string, string>();
		for (let d = 0; d < availabilityDates.length; d++) {
			for (let b = 0; b < availabilityTimeBlocks.length; b++) {
				map.set(
					generateCellKey(d, b),
					getTimestampFromBlockIndex(
						b,
						d,
						fromTime,
						availabilityDates,
						timeZone,
					),
				);
			}
		}
		return map;
	}, [availabilityDates, availabilityTimeBlocks, fromTime, timeZone]);

	const spacers = spacerBeforeDate(currentPageAvailability.availabilities);
	const lastRowIndex = availabilityTimeBlocks.length - 1;
	const { hoverCellPreviewByKey, selectedCellPreviewByKey } =
		useStudyRoomPreviewMaps();

	return (
		<>
			{availabilityTimeBlocks.map((timeBlock, blockIndex) => {
				const isTopOfHour = timeBlock % 60 === 0;
				const isHalfHour = timeBlock % 60 === 30;
				const isLastRow = blockIndex === lastRowIndex;

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

								const draftEdges = edgesFor(
									draftRange,
									zotDateIndex,
									blockIndex,
								);
								const hoverEdges =
									draftEdges === null
										? edgesFor(hoverRange, zotDateIndex, blockIndex)
										: null;
								const committedEdges =
									draftRange === undefined &&
									hoverEdges === null &&
									!isScheduling
										? edgesFor(committedRange, zotDateIndex, blockIndex)
										: null;
								const selectionEdges =
									draftEdges ?? hoverEdges ?? committedEdges ?? null;

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
									primaryColor,
								});
								const blockIsScheduled =
									timestamp !== "" && displayScheduleTimestamps.has(timestamp);

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
								const isTopEdge =
									blockIsScheduled &&
									(!prevTimestamp ||
										!displayScheduleTimestamps.has(prevTimestamp));
								const isBottomEdge =
									blockIsScheduled &&
									(!nextTimestamp ||
										!displayScheduleTimestamps.has(nextTimestamp));

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
