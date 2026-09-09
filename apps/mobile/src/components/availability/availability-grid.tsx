import * as Haptics from "expo-haptics";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import { type LayoutChangeEvent, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { HatchFill } from "@/components/availability/stripes";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/text";
import {
	type AvailabilityStatus,
	hourLabels,
	SLOTS_PER_HOUR,
	type SlotKey,
	type SlotPos,
	slotsBetween,
	toColumnDate,
	toSlotKey,
	WEEKDAY_ABBR,
} from "@/lib/availability";
import { cn } from "@/lib/utils";

/**
 * Geometry from the "calendar with controls" component in the wireframes
 * (Figma 361:5105). An hour block is 42px and splits into two half-hour cells
 * on a dashed centre line; the label gutter is 35px.
 */
const HOUR_HEIGHT = 42;
const SLOT_HEIGHT = HOUR_HEIGHT / SLOTS_PER_HOUR;
const GUTTER_WIDTH = 35;
/** Half the 16px line height of a boundary label, to centre it on its line. */
const LABEL_OFFSET = 8;

/** A run of adjacent cells sharing one status, drawn as a single block. */
type Run = { start: number; end: number; status: AvailabilityStatus };

/**
 * Groups a column's cells into contiguous same-status runs. The design outlines
 * a painted region once rather than per cell — the hatched 10–11 AM block and
 * the solid 11 AM–1 PM block below it each carry their own dashed border — so
 * the border follows the run, not the half hour.
 */
function runsFor(
	statusAt: (slotIndex: number) => AvailabilityStatus | undefined,
	slotCount: number,
): Run[] {
	const runs: Run[] = [];
	for (let slot = 0; slot < slotCount; slot++) {
		const status = statusAt(slot);
		if (!status || status === "unavailable") continue;
		const last = runs.at(-1);
		if (last && last.end === slot - 1 && last.status === status)
			last.end = slot;
		else runs.push({ start: slot, end: slot, status });
	}
	return runs;
}

/** One painted region: a dashed primary outline over a solid or hatched fill. */
function AvailabilityBlock({ run }: { run: Run }) {
	return (
		<View
			className={cn(
				"absolute right-0 left-0 overflow-hidden border-2 border-primary border-dashed",
				run.status === "available" && "bg-primary-outline",
			)}
			pointerEvents="none"
			style={{
				top: run.start * SLOT_HEIGHT,
				height: (run.end - run.start + 1) * SLOT_HEIGHT,
			}}
		>
			{run.status === "if-needed" ? <HatchFill /> : null}
		</View>
	);
}

/** The THUR / 1/1 pair above a column. */
function ColumnHeading({ day }: { day: Date }) {
	return (
		<View className="h-11 w-20 items-center">
			<Text className="font-figtree-medium text-[11px] text-foreground tracking-[0.5px]">
				{WEEKDAY_ABBR[day.getDay()]}
			</Text>
			<Text className="font-figtree-medium text-[16px] text-foreground leading-6 tracking-[0.15px]">
				{toColumnDate(day)}
			</Text>
		</View>
	);
}

/**
 * The two-day availability grid — "calendar with controls", variant `2 day`.
 *
 * Painting mirrors the sweep in `@/components/ui/calendar`: press and drag to
 * cover a range, one haptic tick per cell crossed, committed on release. The
 * range here is a rectangle rather than a run of days, so a drag that crosses
 * into the second column paints both.
 *
 * Unlike the calendar, the sweep is *vertical* — the same axis the surrounding
 * scroll view wants — so there is no offset threshold that can separate the
 * two. The screen resolves it instead by locking the scroll while `editable`
 * is set, which is why painting is a distinct mode in the design rather than
 * something you can do from the browsing screen.
 */
export function AvailabilityGrid({
	days,
	startHour = 9,
	endHour = 23,
	statuses,
	editable = false,
	activeStatus,
	onPaint,
	onPreviousDays,
	onNextDays,
}: {
	/** The visible columns, normally two. */
	days: Date[];
	/** First and last gridline, as 24h hours. */
	startHour?: number;
	endHour?: number;
	statuses: Record<SlotKey, AvailabilityStatus>;
	/** Only an editable grid claims the drag gesture. */
	editable?: boolean;
	/** The status a sweep paints, from the floating bar. */
	activeStatus?: AvailabilityStatus;
	onPaint?: (keys: SlotKey[], status: AvailabilityStatus) => void;
	onPreviousDays?: () => void;
	onNextDays?: () => void;
}) {
	const rows = endHour - startHour;
	const slotCount = rows * SLOTS_PER_HOUR;
	const labels = hourLabels(startHour, endHour);

	// Measured rather than derived from the flex layout, so hit-testing keeps
	// working if the column count or the card padding changes.
	const columnRects = useRef<{ x: number; width: number }[]>([]);
	const [anchor, setAnchor] = useState<SlotPos | null>(null);
	const [cursor, setCursor] = useState<SlotPos | null>(null);

	const measureColumn = (index: number) => (e: LayoutChangeEvent) => {
		const { x, width } = e.nativeEvent.layout;
		columnRects.current[index] = { x, width };
	};

	/** Grid-local point -> the cell under it, clamped to the grid. */
	const slotAt = useCallback(
		(x: number, y: number): SlotPos | null => {
			const dayIndex = columnRects.current.findIndex(
				(rect) => rect && x >= rect.x && x < rect.x + rect.width,
			);
			if (dayIndex === -1) return null;

			const slotIndex = Math.floor(y / SLOT_HEIGHT);
			if (slotIndex < 0 || slotIndex >= slotCount) return null;

			return { dayIndex, slotIndex };
		},
		[slotCount],
	);

	const touchDown = useRef<{ x: number; y: number } | null>(null);

	const start = useCallback(() => {
		const point = touchDown.current;
		if (!point) return;
		const slot = slotAt(point.x, point.y);
		if (!slot) return;
		Haptics.selectionAsync().catch(() => {});
		setAnchor(slot);
		setCursor(slot);
	}, [slotAt]);

	const extend = useCallback(
		(x: number, y: number) => {
			const slot = slotAt(x, y);
			if (!slot) return;
			setCursor((current) => {
				if (
					current &&
					current.dayIndex === slot.dayIndex &&
					current.slotIndex === slot.slotIndex
				) {
					return current;
				}
				Haptics.selectionAsync().catch(() => {});
				return slot;
			});
		},
		[slotAt],
	);

	const commit = useCallback(() => {
		touchDown.current = null;
		if (!anchor || !cursor || !activeStatus) {
			setAnchor(null);
			setCursor(null);
			return;
		}
		const keys = slotsBetween(anchor, cursor)
			.map(({ dayIndex, slotIndex }) => {
				const day = days[dayIndex];
				return day ? toSlotKey(day, slotIndex) : null;
			})
			.filter((key): key is SlotKey => key !== null);

		setAnchor(null);
		setCursor(null);
		if (keys.length > 0) onPaint?.(keys, activeStatus);
	}, [activeStatus, anchor, cursor, days, onPaint]);

	// runOnJS: every callback touches React state and refs, so they belong on
	// the JS thread — the same trade the calendar's sweep makes.
	const sweep = Gesture.Pan()
		.runOnJS(true)
		.enabled(editable && !!activeStatus)
		.shouldCancelWhenOutside(false)
		.onBegin((e) => {
			touchDown.current = { x: e.x, y: e.y };
		})
		.onStart(() => start())
		.onUpdate((e) => extend(e.x, e.y))
		.onFinalize(() => commit());

	/** Cells covered by the sweep still in progress, shown before commit. */
	const preview =
		anchor && cursor && activeStatus
			? new Set(
					slotsBetween(anchor, cursor).map(
						({ dayIndex, slotIndex }) => `${dayIndex}#${slotIndex}`,
					),
				)
			: null;

	const statusFor = (dayIndex: number, slotIndex: number) => {
		if (preview?.has(`${dayIndex}#${slotIndex}`)) return activeStatus;
		const day = days[dayIndex];
		return day ? statuses[toSlotKey(day, slotIndex)] : undefined;
	};

	return (
		<View className="w-full rounded-[8px] border border-paper-outline bg-paper px-3 pt-3 pb-5">
			<View className="flex-row gap-2">
				<View style={{ width: GUTTER_WIDTH }}>
					{/* Clears the column headings, which the gutter has no row for. */}
					<View className="h-11" />
					<View style={{ height: rows * HOUR_HEIGHT }}>
						{labels.map((label, index) => (
							<Text
								className="absolute w-full text-right font-figtree-medium text-[#918d89] text-[11px] leading-4 tracking-[0.5px]"
								key={label}
								style={{ top: index * HOUR_HEIGHT - LABEL_OFFSET }}
							>
								{label}
							</Text>
						))}
					</View>
				</View>

				<View className="flex-1">
					<View className="h-11 flex-row items-start">
						{days.map((day, index) => (
							<View
								className="flex-1 flex-row items-start justify-center gap-3"
								key={day.toISOString()}
							>
								{index === 0 ? (
									<IconButton
										accessibilityLabel="Previous days"
										onPress={onPreviousDays}
										size="sm"
									>
										<ChevronLeft className="text-action-active" size={20} />
									</IconButton>
								) : null}
								<ColumnHeading day={day} />
								{index === days.length - 1 ? (
									<IconButton
										accessibilityLabel="Next days"
										onPress={onNextDays}
										size="sm"
									>
										<ChevronRight className="text-action-active" size={20} />
									</IconButton>
								) : null}
							</View>
						))}
					</View>

					<GestureDetector gesture={sweep}>
						<View
							className="flex-row border border-paper-outline"
							style={{ height: rows * HOUR_HEIGHT }}
						>
							{days.map((day, dayIndex) => (
								<View
									className={cn(
										"flex-1",
										dayIndex < days.length - 1 &&
											"border-paper-outline border-r",
									)}
									key={day.toISOString()}
									onLayout={measureColumn(dayIndex)}
								>
									{Array.from({ length: rows }, (_, row) => (
										<View
											className={cn(
												"border-paper-outline",
												row < rows - 1 && "border-b",
											)}
											key={`${day.toISOString()}-${row}`}
											style={{ height: HOUR_HEIGHT }}
										>
											{/* The dashed half-hour rule inside each block. */}
											<View
												className="border-paper-outline border-b border-dashed"
												style={{ height: SLOT_HEIGHT }}
											/>
										</View>
									))}
									{runsFor(
										(slotIndex) => statusFor(dayIndex, slotIndex),
										slotCount,
									).map((run) => (
										<AvailabilityBlock
											key={`${run.start}-${run.status}`}
											run={run}
										/>
									))}
								</View>
							))}
						</View>
					</GestureDetector>
				</View>
			</View>
		</View>
	);
}
