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
import * as Haptics from "expo-haptics";
import { useCallback, useMemo, useRef, useState } from "react";
import { type LayoutChangeEvent, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
	type AvailabilityDatePageNav,
	AvailabilityTableHeader,
} from "@/components/availability/table/availability-table-header";
import {
	BLOCK_HEIGHT,
	blockTop,
	DATE_GAP_WIDTH,
	DAY_HEADER_GAP,
	DAY_HEADER_HEIGHT,
} from "@/components/availability/table/availability-table-metrics";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";
import { PersonalAvailabilityBlock } from "@/components/availability/table/personal-availability-block";
import { StripeBackdrop } from "@/components/availability/table/stripe-backdrop";
import { TornEdge } from "@/components/availability/table/torn-edge";
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

/**
 * Left edge of each column. Columns are equal width, but one with a spacer
 * before it (a gap in the meeting's dates) starts `DATE_GAP_WIDTH` later, so
 * every column after a gap is offset — `x / columnWidth` alone would paint
 * the wrong column near a gap.
 */
function columnLeftEdges(
	columnWidth: number,
	spacers: readonly boolean[],
): number[] {
	let left = 0;
	return spacers.map((hasSpacerBefore) => {
		if (hasSpacerBefore) left += DATE_GAP_WIDTH;
		const edge = left;
		left += columnWidth;
		return edge;
	});
}

/**
 * The cell under a point. A point in a spacer is no cell when a selection is
 * starting (`snapToColumn` false); while a drag extends it snaps to the
 * nearer column, so sweeping across a gap does not stall the range.
 */
function cellFromPoint(
	x: number,
	y: number,
	columnWidth: number,
	columnLefts: readonly number[],
	blockCount: number,
	snapToColumn: boolean,
): { pageDateIndex: number; blockIndex: number } | null {
	const gridY = y - GRID_TOP;
	if (columnWidth <= 0 || columnLefts.length === 0 || gridY < 0) return null;

	let pageDateIndex = 0;
	for (let i = columnLefts.length - 1; i > 0; i--) {
		if (x >= columnLefts[i]) {
			pageDateIndex = i;
			break;
		}
	}
	const isLast = pageDateIndex === columnLefts.length - 1;
	const pastRightEdge = x >= columnLefts[pageDateIndex] + columnWidth;
	if (pastRightEdge && !isLast) {
		if (!snapToColumn) return null;
		const gapMiddle = columnLefts[pageDateIndex + 1] - DATE_GAP_WIDTH / 2;
		if (x >= gapMiddle) pageDateIndex += 1;
	}

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
	const currentPage = useAvailabilityStore((s) => s.currentPage);
	const itemsPerPage = useAvailabilityStore((s) => s.itemsPerPage);
	const paintMode = useAvailabilityStore((s) => s.paintMode);
	const [draftRange, setDraftRange] = useState<
		SelectionStateType | undefined
	>();
	const [columnWidth, setColumnWidth] = useState(0);

	const anchorRef = useRef<{
		zotDateIndex: number;
		blockIndex: number;
	} | null>(null);
	const latestRangeRef = useRef<SelectionStateType | undefined>(undefined);

	// A pan reports many points per cell; only a change of cell is a change of
	// range, and only that should reach React — or the thumb. Painting ticks
	// once per cell crossed, like a picker wheel; clearing is silent.
	const updateDraftRange = useCallback(
		(range: SelectionStateType) => {
			const prev = latestRangeRef.current;
			latestRangeRef.current = range;
			if (
				prev &&
				prev.earlierDateIndex === range.earlierDateIndex &&
				prev.laterDateIndex === range.laterDateIndex &&
				prev.earlierBlockIndex === range.earlierBlockIndex &&
				prev.laterBlockIndex === range.laterBlockIndex
			) {
				return;
			}
			if (paintMode !== "unavailable") {
				Haptics.selectionAsync().catch(() => {});
			}
			setDraftRange(range);
		},
		[paintMode],
	);

	const spacers = useMemo(
		() => spacerBeforeDate(currentPageAvailability.availabilities),
		[currentPageAvailability.availabilities],
	);
	const columnLefts = useMemo(
		() => columnLeftEdges(columnWidth, spacers),
		[columnWidth, spacers],
	);
	// Stable per-row objects, so the memoised cells see unchanged props.
	const rowChromes = useMemo(
		() =>
			availabilityTimeBlocks.map((timeBlock, blockIndex) =>
				getRowChrome(timeBlock, blockIndex, availabilityTimeBlocks.length),
			),
		[availabilityTimeBlocks],
	);
	// Saved state per visible cell. `personalCellState` formats an ISO string
	// per lookup (a timezone round-trip), so it runs when the data changes,
	// never per pointer move.
	const cellStates = useMemo(
		() =>
			currentPageAvailability.availabilities.map(
				(selectedDate, pageDateIndex) =>
					selectedDate
						? availabilityTimeBlocks.map((_, blockIndex) =>
								personalCellState(
									selectedDate,
									currentPageAvailability.ifNeeded[pageDateIndex],
									blockIndex,
								),
							)
						: [],
			),
		[currentPageAvailability, availabilityTimeBlocks],
	);
	const lastIndex = currentPageAvailability.availabilities.length - 1;
	const columnHeight = blockTop(availabilityTimeBlocks.length);

	const onColumnLayout = (event: LayoutChangeEvent) =>
		setColumnWidth(event.nativeEvent.layout.width);

	const resolveCell = useCallback(
		(x: number, y: number, snapToColumn: boolean) => {
			const hit = cellFromPoint(
				x,
				y,
				columnWidth,
				columnLefts,
				availabilityTimeBlocks.length,
				snapToColumn,
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
			columnLefts,
			columnWidth,
			currentPage,
			currentPageAvailability.availabilities,
			itemsPerPage,
		],
	);

	const begin = useCallback(
		(x: number, y: number) => {
			const cell = resolveCell(x, y, false);
			if (!cell) return;
			anchorRef.current = cell;
			updateDraftRange(toRange(cell, cell));
		},
		[resolveCell, updateDraftRange],
	);

	const extend = useCallback(
		(x: number, y: number) => {
			const anchor = anchorRef.current;
			if (!anchor) return;
			const cell = resolveCell(x, y, true);
			if (!cell) return;
			updateDraftRange(toRange(anchor, cell));
		},
		[resolveCell, updateDraftRange],
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

	// The gesture is built once and reads the latest handlers through a ref:
	// rebuilding it on every draft update would re-attach it mid-drag.
	const handlersRef = useRef({ begin, extend, commit });
	handlersRef.current = { begin, extend, commit };

	// Claim vertical pans so painting wins over the surrounding ScrollView.
	const paintGesture = useMemo(
		() =>
			Gesture.Pan()
				.runOnJS(true)
				.minDistance(0)
				.activeOffsetY([-4, 4])
				.shouldCancelWhenOutside(false)
				.onBegin((e) => handlersRef.current.begin(e.x, e.y))
				.onUpdate((e) => handlersRef.current.extend(e.x, e.y))
				.onFinalize(() => handlersRef.current.commit()),
		[],
	);

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
									className="flex-1 items-center"
									key={
										selectedDate
											? selectedDate.valueOf()
											: `padding-${pageDateIndex}`
									}
									style={{
										gap: DAY_HEADER_GAP,
										marginLeft: hasSpacerBefore ? DATE_GAP_WIDTH : 0,
									}}
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
													const state = cellStates[pageDateIndex][blockIndex];
													return (
														<PersonalAvailabilityBlock
															blockIndex={blockIndex}
															chrome={rowChromes[blockIndex]}
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
												{pageDateIndex === 0 && !datePageNav?.isFirstPage ? (
													<TornEdge height={columnHeight} side="left" />
												) : null}
												{pageDateIndex === lastIndex &&
												!datePageNav?.isLastPage ? (
													<TornEdge height={columnHeight} side="right" />
												) : null}
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
