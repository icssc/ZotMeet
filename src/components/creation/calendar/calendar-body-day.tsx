import type { Dispatch, SetStateAction } from "react";
import { useCallback, useRef } from "react";
import { CalendarBodyDayCell } from "@/components/creation/calendar/calendar-body-day-cell";
import { ZotDate } from "@/lib/zotdate";

interface CalendarBodyDayProps {
	calendarDay: ZotDate;
	startDaySelection: ZotDate | undefined;
	setStartDaySelection: Dispatch<SetStateAction<ZotDate | undefined>>;
	endDaySelection: ZotDate | undefined;
	setEndDaySelection: Dispatch<SetStateAction<ZotDate | undefined>>;
	currentMonth: number;
	updateSelectedRange: (startDate: ZotDate, endDate: ZotDate) => void;
}

export function CalendarBodyDay({
	calendarDay,
	startDaySelection,
	setStartDaySelection,
	endDaySelection,
	setEndDaySelection,
	currentMonth,
	updateSelectedRange,
}: CalendarBodyDayProps) {
	const isDraggingRef = useRef(false);

	const isHighlighted =
		startDaySelection &&
		endDaySelection &&
		calendarDay.determineDayWithinBounds(startDaySelection, endDaySelection);

	const isCurrentMonth = currentMonth === calendarDay.getMonth();

	/* Confirms the current highlight selection and updates calendar accordingly */
	const handleEndSelection = useCallback(() => {
		try {
			if (startDaySelection && endDaySelection) {
				updateSelectedRange(startDaySelection, endDaySelection);
			} else if (startDaySelection) {
				updateSelectedRange(startDaySelection, calendarDay);
			}
		} catch (err) {
			console.error(err);
		}
		setStartDaySelection(undefined);
		setEndDaySelection(undefined);
	}, [
		startDaySelection,
		endDaySelection,
		updateSelectedRange,
		calendarDay,
		setStartDaySelection,
		setEndDaySelection,
	]);

	// Pointer event handlers
	const handlePointerDown = useCallback(
		(e: React.PointerEvent<HTMLButtonElement>) => {
			const target = e.currentTarget;
			target.setPointerCapture(e.pointerId);

			isDraggingRef.current = true;
			setStartDaySelection(calendarDay);
			setEndDaySelection(calendarDay);
		},
		[calendarDay, setStartDaySelection, setEndDaySelection],
	);

	const handlePointerMove = useCallback(
		(e: React.PointerEvent<HTMLButtonElement>) => {
			if (!isDraggingRef.current || !startDaySelection) return;

			// Get element under pointer
			const element = document.elementFromPoint(e.clientX, e.clientY);
			if (!element) return;

			const touchingDay = element.getAttribute("data-day");
			if (touchingDay) {
				const day = ZotDate.extractDayFromElement(element);
				if (day) {
					setEndDaySelection(day);
				}
			}
		},
		[startDaySelection, setEndDaySelection],
	);

	const handlePointerUp = useCallback(
		(e: React.PointerEvent<HTMLButtonElement>) => {
			if (!isDraggingRef.current) return;

			const target = e.currentTarget;
			if (target.hasPointerCapture(e.pointerId)) {
				target.releasePointerCapture(e.pointerId);
			}

			isDraggingRef.current = false;
			handleEndSelection();
		},
		[handleEndSelection],
	);

	return (
		<td>
			<button
				type="button"
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				className="relative flex w-full cursor-pointer select-none justify-center py-2 [touch-action:none]"
			>
				<CalendarBodyDayCell
					isHighlighted={!!isHighlighted}
					calendarDay={calendarDay}
					isCurrentMonth={isCurrentMonth}
				/>
			</button>
		</td>
	);
}
