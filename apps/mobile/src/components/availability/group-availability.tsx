import {
	type BlockFill,
	buildTimestampsByCell,
	type CurrentPageAvailability,
	calculateBlockFill,
	generateCellKey,
	getRowChrome,
	type MeetingType,
	type Member,
	sliceCurrentPageAvailability,
	spacerBeforeDate,
	type ZotDate,
} from "@zotmeet/shared";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	FlatList,
	type LayoutChangeEvent,
	type NativeScrollEvent,
	type NativeSyntheticEvent,
	View,
} from "react-native";
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
	ifNeededDates: ZotDate[];
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
 * The day columns sit in a horizontal pager, one page per `itemsPerPage`
 * dates, so a swipe drags the grid along under the finger and snaps to the
 * next page the way Google Calendar's day view does; the tick column stays
 * put. The store's `currentPage` remains the source of truth — the arrows
 * change it and the pager follows, and a settled swipe writes it back.
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
	ifNeededDates,
	members,
	meetingType,
	timeZone,
	datePageNav,
}: GroupAvailabilityProps) {
	const currentPage = useAvailabilityStore((s) => s.currentPage);
	const itemsPerPage = useAvailabilityStore((s) => s.itemsPerPage);
	const setCurrentPage = useAvailabilityStore((s) => s.setCurrentPage);

	const pages = useMemo(() => {
		const pageCount = Math.max(
			1,
			Math.ceil(availabilityDates.length / itemsPerPage),
		);
		return Array.from({ length: pageCount }, (_, page) =>
			sliceCurrentPageAvailability(
				availabilityDates,
				ifNeededDates,
				page,
				itemsPerPage,
			),
		);
	}, [availabilityDates, ifNeededDates, itemsPerPage]);

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

	// Each page is exactly as wide as the pager, so `pagingEnabled` snaps to
	// whole pages; the width comes from layout, so nothing renders until it
	// is known.
	const [pageWidth, setPageWidth] = useState(0);
	const onPagerLayout = (event: LayoutChangeEvent) =>
		setPageWidth(event.nativeEvent.layout.width);

	const listRef = useRef<FlatList<CurrentPageAvailability>>(null);
	// The page the pager is showing (or scrolling to), so an arrow press
	// scrolls and a swipe that already landed there does not scroll again.
	const settledPageRef = useRef(currentPage);

	useEffect(() => {
		if (pageWidth === 0 || settledPageRef.current === currentPage) return;
		settledPageRef.current = currentPage;
		listRef.current?.scrollToIndex({ index: currentPage, animated: true });
	}, [currentPage, pageWidth]);

	// A resize (rotation) leaves the offset on the old page width; re-snap.
	useEffect(() => {
		if (pageWidth === 0) return;
		listRef.current?.scrollToIndex({
			index: settledPageRef.current,
			animated: false,
		});
	}, [pageWidth]);

	// Commit a page once the offset rests on it. Native reports the end of a
	// swipe through `onMomentumScrollEnd`; react-native-web never emits that
	// event, so `onScroll` is watched too and only whole-page offsets count.
	const syncPageFromOffset = useCallback(
		(event: NativeSyntheticEvent<NativeScrollEvent>) => {
			if (pageWidth === 0) return;
			const offset = event.nativeEvent.contentOffset.x;
			const page = Math.round(offset / pageWidth);
			if (Math.abs(offset - page * pageWidth) > 1) return;
			if (page === settledPageRef.current) return;
			settledPageRef.current = page;
			setCurrentPage(page);
		},
		[pageWidth, setCurrentPage],
	);

	const getItemLayout = useCallback(
		(_: unknown, index: number) => ({
			length: pageWidth,
			offset: pageWidth * index,
			index,
		}),
		[pageWidth],
	);

	return (
		<View className="w-full flex-row gap-2">
			<AvailabilityTimeTicks availabilityTimeBlocks={availabilityTimeBlocks} />

			<View className="flex-1" onLayout={onPagerLayout}>
				{pageWidth > 0 ? (
					<FlatList
						data={pages}
						getItemLayout={getItemLayout}
						horizontal
						initialScrollIndex={currentPage}
						keyExtractor={(_, page) => String(page)}
						onMomentumScrollEnd={syncPageFromOffset}
						onScroll={syncPageFromOffset}
						pagingEnabled
						ref={listRef}
						renderItem={({ item, index }) => (
							<GroupAvailabilityPage
								availabilityTimeBlocks={availabilityTimeBlocks}
								datePageNav={datePageNav}
								meetingType={meetingType}
								numMembers={members.length}
								page={index}
								pageAvailability={item}
								timestampsByCell={timestampsByCell}
								width={pageWidth}
							/>
						)}
						scrollEventThrottle={16}
						showsHorizontalScrollIndicator={false}
						windowSize={3}
					/>
				) : null}
			</View>
		</View>
	);
}

interface GroupAvailabilityPageProps {
	availabilityTimeBlocks: number[];
	datePageNav?: AvailabilityDatePageNav;
	meetingType: MeetingType;
	numMembers: number;
	page: number;
	pageAvailability: CurrentPageAvailability;
	timestampsByCell: Map<string, string>;
	width: number;
}

/** One pager page: `itemsPerPage` day columns, each under its own header. */
function GroupAvailabilityPage({
	availabilityTimeBlocks,
	datePageNav,
	meetingType,
	numMembers,
	page,
	pageAvailability,
	timestampsByCell,
	width,
}: GroupAvailabilityPageProps) {
	const itemsPerPage = useAvailabilityStore((s) => s.itemsPerPage);

	const spacers = spacerBeforeDate(pageAvailability.availabilities);
	const lastIndex = pageAvailability.availabilities.length - 1;
	const columnHeight = blockTop(availabilityTimeBlocks.length);

	// The stripe backdrop is sized from the column's measured width.
	const [columnWidth, setColumnWidth] = useState(0);
	const onColumnLayout = (event: LayoutChangeEvent) =>
		setColumnWidth(event.nativeEvent.layout.width);

	return (
		<View className="flex-row" style={{ width }}>
			{pageAvailability.availabilities.map((selectedDate, pageDateIndex) => {
				const ifNeededDate = pageAvailability.ifNeeded[pageDateIndex];
				const zotDateIndex = pageDateIndex + page * itemsPerPage;
				const hasSpacerBefore = spacers[pageDateIndex];

				return (
					<View
						className={`flex-1 items-center ${hasSpacerBefore ? "ml-3" : ""}`}
						key={
							selectedDate ? selectedDate.valueOf() : `padding-${pageDateIndex}`
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
									<StripeBackdrop height={columnHeight} width={columnWidth} />
									{availabilityTimeBlocks.map((timeBlock, blockIndex) => {
										const timestamp =
											timestampsByCell.get(
												generateCellKey(zotDateIndex, blockIndex),
											) ?? "";
										const fill: BlockFill = calculateBlockFill({
											block: selectedDate.groupAvailability[timestamp] ?? [],
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
												hasSpacerBefore={hasSpacerBefore || pageDateIndex === 0}
												key={timeBlock}
											/>
										);
									})}
								</>
							)}
						</View>
					</View>
				);
			})}
		</View>
	);
}
