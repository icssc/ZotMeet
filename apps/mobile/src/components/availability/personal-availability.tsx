import {
	type CurrentPageAvailability,
	generateCellKey,
	getRowChrome,
	type MeetingType,
	paintPersonalSelection,
	personalCellState,
	rangeCoversCell,
	type SelectionStateType,
	spacerBeforeDate,
	type ZotDate,
} from "@zotmeet/shared";
import { useCallback, useRef, useState } from "react";
import { type LayoutChangeEvent, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
	type AvailabilityDatePageNav,
	AvailabilityTableHeader,
} from "@/components/availability/table/availability-table-header";
import {
	BLOCK_HEIGHT,
	blockTop,
	DAY_HEADER_GAP,
	DAY_HEADER_HEIGHT,
} from "@/components/availability/table/availability-table-metrics";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";
import { PersonalAvailabilityBlock } from "@/components/availability/table/personal-availability-block";
import { StripeBackdrop } from "@/components/availability/table/stripe-backdrop";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

export interface PersonalAvailabilityProps {
	availabilityTimeBlocks: number[];
	fromTime: number;
	availabilityDates: ZotDate[];
	ifNeededDates: ZotDate[];
	currentPageAvailability: CurrentPageAvailability;
	meetingType: MeetingType;
	timeZone: string;
	memberId: string;
	datePageNav?: AvailabilityDatePageNav;
	onPaint: (next: {
		availabilityDates: ZotDate[];
		ifNeededDates: ZotDate[];
	}) => void;
}

const GRID_TOP = DAY_HEADER_HEIGHT + DAY_HEADER_GAP;

function cellFromPoint(
	x: number,
	y: number,
	columnWidth: number,
	columnCount: number,
	blockCount: number,
): { pageDateIndex: number; blockIndex: number } | null {
	const gridY = y - GRID_TOP;
	if (columnWidth <= 0 || columnCount <= 0 || gridY < 0) return null;
	const pageDateIndex = Math.min(
		columnCount - 1,
		Math.max(0, Math.floor(x / columnWidth)),
	);
	const blockIndex = Math.min(
		blockCount - 1,
		Math.max(0, Math.floor(gridY / BLOCK_HEIGHT)),
	);
	return { pageDateIndex, blockIndex };
}

function toRange(
	a: { zotDateIndex: number; blockIndex: number },
	b: { zotDateIndex: number; blockIndex: number },
): SelectionStateType {
	return {
		earlierDateIndex: Math.min(a.zotDateIndex, b.zotDateIndex),
		laterDateIndex: Math.max(a.zotDateIndex, b.zotDateIndex),
		earlierBlockIndex: Math.min(a.blockIndex, b.blockIndex),
		laterBlockIndex: Math.max(a.blockIndex, b.blockIndex),
	};
}

/**
 * Personal paint grid — native counterpart to the web's
 * `PersonalAvailability`. Drag (or tap) paints with the active `paintMode`
 * through shared `paintPersonalSelection`.
 */
export function PersonalAvailability({
	availabilityTimeBlocks,
	fromTime,
	availabilityDates,
	ifNeededDates,
	currentPageAvailability,
	meetingType,
	timeZone,
	memberId,
	datePageNav,
	onPaint,
}: PersonalAvailabilityProps) {
	const { currentPage, itemsPerPage, paintMode } = useAvailabilityStore();
	const [draftRange, setDraftRange] = useState<
		SelectionStateType | undefined
	>();
	const [columnWidth, setColumnWidth] = useState(0);

	const anchorRef = useRef<{
		zotDateIndex: number;
		blockIndex: number;
	} | null>(null);
	const latestRangeRef = useRef<SelectionStateType | undefined>(undefined);

	const spacers = spacerBeforeDate(currentPageAvailability.availabilities);
	const lastIndex = currentPageAvailability.availabilities.length - 1;
	const columnHeight = blockTop(availabilityTimeBlocks.length);
	const columnCount = currentPageAvailability.availabilities.length;

	const onColumnLayout = (event: LayoutChangeEvent) =>
		setColumnWidth(event.nativeEvent.layout.width);

	const resolveCell = useCallback(
		(x: number, y: number) => {
			const hit = cellFromPoint(
				x,
				y,
				columnWidth,
				columnCount,
				availabilityTimeBlocks.length,
			);
			if (!hit) return null;
			const date = currentPageAvailability.availabilities[hit.pageDateIndex];
			if (!date) return null;
			return {
				zotDateIndex: hit.pageDateIndex + currentPage * itemsPerPage,
				blockIndex: hit.blockIndex,
			};
		},
		[
			availabilityTimeBlocks.length,
			columnCount,
			columnWidth,
			currentPage,
			currentPageAvailability.availabilities,
			itemsPerPage,
		],
	);

	const begin = useCallback(
		(x: number, y: number) => {
			const cell = resolveCell(x, y);
			if (!cell) return;
			anchorRef.current = cell;
			const range = toRange(cell, cell);
			latestRangeRef.current = range;
			setDraftRange(range);
		},
		[resolveCell],
	);

	const extend = useCallback(
		(x: number, y: number) => {
			const anchor = anchorRef.current;
			if (!anchor) return;
			const cell = resolveCell(x, y);
			if (!cell) return;
			const range = toRange(anchor, cell);
			latestRangeRef.current = range;
			setDraftRange(range);
		},
		[resolveCell],
	);

	const commit = useCallback(() => {
		const range = latestRangeRef.current;
		anchorRef.current = null;
		latestRangeRef.current = undefined;
		setDraftRange(undefined);
		if (!range) return;
		onPaint(
			paintPersonalSelection({
				availabilityDates,
				ifNeededDates,
				mode: paintMode,
				range,
				memberId,
				fromTimeMinutes: fromTime,
				timeZone,
			}),
		);
	}, [
		availabilityDates,
		fromTime,
		ifNeededDates,
		memberId,
		onPaint,
		paintMode,
		timeZone,
	]);

	// Claim vertical pans so painting wins over the surrounding ScrollView.
	const paintGesture = Gesture.Pan()
		.runOnJS(true)
		.minDistance(0)
		.activeOffsetY([-4, 4])
		.shouldCancelWhenOutside(false)
		.onBegin((e) => begin(e.x, e.y))
		.onUpdate((e) => extend(e.x, e.y))
		.onFinalize(() => commit());

	return (
		<View className="w-full flex-row gap-2">
			<AvailabilityTimeTicks availabilityTimeBlocks={availabilityTimeBlocks} />

			<GestureDetector gesture={paintGesture}>
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
										<View style={{ height: DAY_HEADER_HEIGHT }} />
									)}

									<View
										className="w-full bg-paper"
										onLayout={pageDateIndex === 0 ? onColumnLayout : undefined}
										style={{ height: columnHeight }}
									>
										{selectedDate ? (
											<>
												<StripeBackdrop
													height={columnHeight}
													width={columnWidth}
												/>
												{availabilityTimeBlocks.map((timeBlock, blockIndex) => {
													const state = personalCellState(
														selectedDate,
														ifNeededDate,
														blockIndex,
													);
													return (
														<PersonalAvailabilityBlock
															blockIndex={blockIndex}
															chrome={getRowChrome(
																timeBlock,
																blockIndex,
																availabilityTimeBlocks.length,
															)}
															hasSpacerBefore={
																hasSpacerBefore || pageDateIndex === 0
															}
															isAvailable={state.isAvailable}
															isIfNeeded={state.isIfNeeded}
															isInDraftRange={rangeCoversCell(
																draftRange,
																zotDateIndex,
																blockIndex,
															)}
															key={`${generateCellKey(zotDateIndex, blockIndex)}-${timeBlock}`}
															paintMode={paintMode}
														/>
													);
												})}
											</>
										) : null}
									</View>
								</View>
							);
						},
					)}
				</View>
			</GestureDetector>
		</View>
	);
}
