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
	const startPosRef = useRef<{ x: number; y: number } | null>(null);

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

	const handlePointerDown = useCallback(
		(e: React.PointerEvent<HTMLButtonElement>) => {
			startPosRef.current = { x: e.clientX, y: e.clientY };
			isDraggingRef.current = false;
			setStartDaySelection(calendarDay);
			setEndDaySelection(calendarDay);
		},
		[calendarDay, setStartDaySelection, setEndDaySelection],
	);

	const handlePointerMove = useCallback(
		(e: React.PointerEvent<HTMLButtonElement>) => {
			if (!startDaySelection || !startPosRef.current) return;

			if (!isDraggingRef.current) {
				const dx = Math.abs(e.clientX - startPosRef.current.x);
				const dy = Math.abs(e.clientY - startPosRef.current.y);

				if (dx < 5 && dy < 5) return;

				if (dy > dx) {
					startPosRef.current = null;
					setStartDaySelection(undefined);
					setEndDaySelection(undefined);
					return;
				}

				e.currentTarget.setPointerCapture(e.pointerId);
				isDraggingRef.current = true;
			}

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
		[startDaySelection, setStartDaySelection, setEndDaySelection],
	);

	const handlePointerUp = useCallback(
		(e: React.PointerEvent<HTMLButtonElement>) => {
			if (!startPosRef.current && !isDraggingRef.current) return;

			startPosRef.current = null;
			const target = e.currentTarget;
			if (target.hasPointerCapture(e.pointerId)) {
				target.releasePointerCapture(e.pointerId);
			}
			isDraggingRef.current = false;
			handleEndSelection();
		},
		[handleEndSelection],
	);

	const handlePointerCancel = useCallback(() => {
		startPosRef.current = null;
		isDraggingRef.current = false;
		setStartDaySelection(undefined);
		setEndDaySelection(undefined);
	}, [setStartDaySelection, setEndDaySelection]);

	return (
		<td className="py-2 md:py-0">
			<button
				type="button"
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerCancel={handlePointerCancel}
				className="relative flex w-full cursor-pointer select-none justify-center py-2 [touch-action:pan-y]"
				data-day={calendarDay.getDay()}
				data-month={calendarDay.getMonth()}
				data-year={calendarDay.getYear()}
				data-selected={calendarDay.isSelected}
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
