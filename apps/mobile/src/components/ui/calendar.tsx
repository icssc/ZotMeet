import * as Haptics from "expo-haptics";
import { useCallback, useRef, useState } from "react";
import { type LayoutChangeEvent, Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/text";
import {
	addMonths,
	datesBetween,
	getMonthGrid,
	isSameDay,
	MONTH_NAMES,
	startOfDay,
	toDateKey,
	WEEKDAY_INITIALS,
} from "@/lib/date";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * A single 36x36 day in the grid — the "*Elements / Day Cell" component in
 * Figma, with its Enabled / Selected / Disabled states plus the outlined
 * "today" ring.
 *
 * `highlighted` is the in-progress drag range: the same role as the web
 * calendar's `isHighlighted`, shown while the finger is still down and before
 * the range is committed.
 */
export function DayCell({
	label,
	selected = false,
	highlighted = false,
	disabled = false,
	today = false,
	onPress,
}: {
	label: string;
	selected?: boolean;
	highlighted?: boolean;
	disabled?: boolean;
	today?: boolean;
	onPress?: () => void;
}) {
	return (
		<Pressable
			accessibilityLabel={label}
			accessibilityRole="button"
			accessibilityState={{ disabled, selected }}
			className={cn(
				"size-9 items-center justify-center overflow-hidden rounded-full",
				selected && "bg-primary",
				highlighted && !selected && "bg-slate-base",
				today && !selected && "border border-action-active",
				!disabled && !selected && !highlighted && "active:bg-muted",
			)}
			disabled={disabled}
			onPress={onPress}
		>
			<Text
				className={cn(
					"text-body2",
					selected
						? "text-primary-foreground"
						: highlighted
							? "text-gray-dark"
							: disabled
								? "text-text-disabled"
								: "text-foreground",
				)}
			>
				{label}
			</Text>
		</Pressable>
	);
}

/** Empty slot keeping the grid aligned where a week runs past the month. */
function EmptyCell() {
	return <View className="size-9" />;
}

type CellRect = { x: number; width: number };
type RowRect = { y: number; height: number };

/**
 * Native counterpart to MUI's `<DateCalendar>` — the "*Pickers / Date"
 * component in the wireframes.
 *
 * Selection mirrors the web calendar in
 * `src/components/creation/calendar/calendar-body-day.tsx`: press a day and
 * drag to sweep a range, and if the drag *started* on an already-selected day
 * the sweep clears that range instead of adding it. A plain tap is just a
 * one-day range.
 *
 * Like the web version, a drag that starts out mostly vertical is handed back
 * to the surrounding scroll view rather than selecting — otherwise the
 * calendar would trap every scroll that begins on top of it.
 */
export function Calendar({
	month,
	onMonthChange,
	selectedKeys,
	onSelectRange,
	minDate,
}: {
	month: Date;
	onMonthChange: (next: Date) => void;
	/** `YYYY-MM-DD` keys of the currently selected days. */
	selectedKeys: string[];
	/**
	 * Commits one sweep. `additive` is false when the gesture began on a day
	 * that was already selected, meaning the range should be cleared.
	 */
	onSelectRange: (keys: string[], additive: boolean) => void;
	/** Days before this are rendered disabled. Defaults to today. */
	minDate?: Date;
}) {
	const weeks = getMonthGrid(month);
	const today = startOfDay(new Date());
	const floor = minDate ? startOfDay(minDate) : today;

	// Measured geometry, so hit-testing never hard-codes the cell size and
	// survives a change to the grid's spacing classes.
	const rowRects = useRef<RowRect[]>([]);
	const cellRects = useRef<CellRect[][]>([]);

	const [anchor, setAnchor] = useState<Date | null>(null);
	const [cursor, setCursor] = useState<Date | null>(null);

	const measureRow = (row: number) => (e: LayoutChangeEvent) => {
		const { y, height } = e.nativeEvent.layout;
		rowRects.current[row] = { y, height };
	};

	const measureCell = (row: number, col: number) => (e: LayoutChangeEvent) => {
		const { x, width } = e.nativeEvent.layout;
		cellRects.current[row] ??= [];
		cellRects.current[row][col] = { x, width };
	};

	/** Grid-local point -> the day under it, or null for gaps and dead space. */
	const dayAt = useCallback(
		(x: number, y: number): Date | null => {
			const row = rowRects.current.findIndex(
				(r) => r && y >= r.y && y < r.y + r.height,
			);
			if (row === -1) return null;

			const cols = cellRects.current[row];
			if (!cols) return null;

			const col = cols.findIndex((c) => c && x >= c.x && x < c.x + c.width);
			if (col === -1) return null;

			return weeks[row]?.[col] ?? null;
		},
		[weeks],
	);

	const isSelectable = useCallback(
		(day: Date | null): day is Date => !!day && day >= floor,
		[floor],
	);

	/**
	 * Where the finger went down. Recorded on touch-down but not acted on: the
	 * gesture has not been claimed yet, and a vertical drag from here belongs to
	 * the scroll view, not to us.
	 */
	const touchDown = useRef<{ x: number; y: number } | null>(null);

	/**
	 * Mirrors `anchor` for the gesture callbacks. `onStart` and `onUpdate` can
	 * both fire before React re-renders, so reading the state here would still
	 * see `null` and drop the first day of every sweep.
	 */
	const anchorRef = useRef<Date | null>(null);

	/**
	 * The day the last tick fired for, so the haptic can sit outside the
	 * `setCursor` updater — updaters must be pure and React may re-run them.
	 */
	const lastTick = useRef<Date | null>(null);

	const begin = useCallback((x: number, y: number) => {
		touchDown.current = { x, y };
	}, []);

	/** The pan won the gesture, so the day under the touch-down point anchors. */
	const start = useCallback(() => {
		const point = touchDown.current;
		if (!point) return;
		const day = dayAt(point.x, point.y);
		if (!isSelectable(day)) return;
		anchorRef.current = day;
		lastTick.current = day;
		setAnchor(day);
		setCursor(day);
	}, [dayAt, isSelectable]);

	const extend = useCallback(
		(x: number, y: number) => {
			// No anchor means `start` rejected the touch-down day; `commit` will
			// discard this sweep, so it must not buzz along the way either.
			if (!anchorRef.current) return;
			const day = dayAt(x, y);
			if (!isSelectable(day)) return;
			// `onUpdate` fires on every finger movement, so bail unless the day
			// under it actually changed — otherwise the sweep re-renders (and
			// buzzes) many times a second on a single day.
			if (lastTick.current && isSameDay(lastTick.current, day)) return;
			lastTick.current = day;
			// One tick per day crossed, the way a native picker feels.
			Haptics.selectionAsync().catch(() => {});
			setCursor(day);
		},
		[dayAt, isSelectable],
	);

	const commit = useCallback(() => {
		touchDown.current = null;
		anchorRef.current = null;
		lastTick.current = null;
		// No anchor means the pan never activated — the touch was a tap, which
		// the day's own Pressable handles, or a scroll that we correctly let go.
		if (!anchor || !cursor) {
			setAnchor(null);
			setCursor(null);
			return;
		}
		const additive = !selectedKeys.includes(toDateKey(anchor));
		const keys = datesBetween(anchor, cursor)
			.filter((day) => day >= floor)
			.map(toDateKey);

		setAnchor(null);
		setCursor(null);
		if (keys.length > 0) onSelectRange(keys, additive);
	}, [anchor, cursor, floor, onSelectRange, selectedKeys]);

	// runOnJS: these callbacks touch React state and refs, so they belong on the
	// JS thread rather than the UI thread.
	const sweep = Gesture.Pan()
		.runOnJS(true)
		// Claim the gesture on horizontal intent and give it up on vertical
		// intent, matching the web calendar's dx/dy check.
		.activeOffsetX([-8, 8])
		.failOffsetY([-12, 12])
		.shouldCancelWhenOutside(false)
		.onBegin((e) => begin(e.x, e.y))
		.onStart(() => start())
		.onUpdate((e) => extend(e.x, e.y))
		.onFinalize(() => commit());

	const previewKeys =
		anchor && cursor
			? new Set(datesBetween(anchor, cursor).map(toDateKey))
			: null;

	/** A tap is a one-day sweep, so it reuses the same commit path. */
	const toggleSingle = (day: Date) => {
		const key = toDateKey(day);
		onSelectRange([key], !selectedKeys.includes(key));
	};

	return (
		<View className="w-full max-w-[320px] overflow-hidden">
			<View className="w-full flex-row items-center py-2 pt-4 pr-3 pl-6">
				<View className="flex-1 flex-row items-center gap-1.5">
					<Text className="font-figtree-medium text-body1 text-foreground">
						{MONTH_NAMES[month.getMonth()]}
					</Text>
					<Text className="font-figtree-medium text-body1 text-foreground">
						{month.getFullYear()}
					</Text>
					<IconButton accessibilityLabel="Select month" size="small">
						<Icon.ChevronDown className="text-action-active" size={24} />
					</IconButton>
				</View>
				<View className="flex-row gap-6">
					<IconButton
						accessibilityLabel="Previous month"
						onPress={() => onMonthChange(addMonths(month, -1))}
						size="small"
					>
						<Icon.ChevronLeft className="text-action-active" size={24} />
					</IconButton>
					<IconButton
						accessibilityLabel="Next month"
						onPress={() => onMonthChange(addMonths(month, 1))}
						size="small"
					>
						<Icon.ChevronRight className="text-action-active" size={24} />
					</IconButton>
				</View>
			</View>

			<View className="w-full flex-row justify-center gap-0.5">
				{WEEKDAY_INITIALS.map((initial, index) => (
					<View
						className="size-9 items-center justify-center"
						// Weekday initials repeat (S/T), so the index is the key.
						key={`${initial}-${index}`}
					>
						<Text className="text-body2 text-muted-foreground">{initial}</Text>
					</View>
				))}
			</View>

			<GestureDetector gesture={sweep}>
				<View className="w-full gap-0.5 pt-3">
					{weeks.map((week, row) => (
						<View
							className="flex-row justify-center gap-0.5"
							key={toDateKey(
								week.find((day): day is Date => day !== null) ?? today,
							)}
							onLayout={measureRow(row)}
						>
							{week.map((day, col) => {
								if (!day)
									return (
										<View key={`empty-${col}`} onLayout={measureCell(row, col)}>
											<EmptyCell />
										</View>
									);
								const key = toDateKey(day);
								return (
									<View key={key} onLayout={measureCell(row, col)}>
										<DayCell
											disabled={day < floor}
											highlighted={previewKeys?.has(key) ?? false}
											label={`${day.getDate()}`}
											onPress={() => toggleSingle(day)}
											selected={selectedKeys.includes(key)}
											today={isSameDay(day, today)}
										/>
									</View>
								);
							})}
						</View>
					))}
				</View>
			</GestureDetector>
		</View>
	);
}
