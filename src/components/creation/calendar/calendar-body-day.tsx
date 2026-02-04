import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useRef } from "react";
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

	/**
	 * Updates the current highlight selection whenever a mobile user drags on the calendar
	 * @param {TouchEvent} e - Touch event from a mobile user
	 */
	const handleTouchMove = (e: React.TouchEvent<HTMLButtonElement>) => {
		const touchingElement = document.elementFromPoint(
			e.touches[0].clientX,
			e.touches[0].clientY,
		);

		if (!touchingElement) return;

		const touchingDay = touchingElement.getAttribute("data-day");

		if (startDaySelection && touchingDay) {
			const day = ZotDate.extractDayFromElement(touchingElement);
			setEndDaySelection(day ?? undefined);
		}
	};

	const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
		if (e.cancelable) {
			e.preventDefault();
		}
		setStartDaySelection(calendarDay);
	};

	const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
		if (e.cancelable) {
			e.preventDefault();
		}

		handleEndSelection();
	};

	const handleMouseMove = () => {
		if (startDaySelection) {
			setEndDaySelection(calendarDay);
		}
	};

	const handleMouseDown = () => {
		isDraggingRef.current = true;
		setStartDaySelection(calendarDay);
	};

	// global mouse event listeners for drag tracking
	useEffect(() => {
		if (!startDaySelection) return;

		const handleGlobalMouseMove = (e: MouseEvent) => {
			if (!isDraggingRef.current) return;

			const element = document.elementFromPoint(e.clientX, e.clientY);
			if (!element) return;

			const touchingDay = element.getAttribute("data-day");
			if (touchingDay) {
				const day = ZotDate.extractDayFromElement(element);
				if (day) {
					setEndDaySelection(day);
				}
			}
		};

		const handleGlobalMouseUp = () => {
			if (isDraggingRef.current) {
				isDraggingRef.current = false;
				handleEndSelection();
			}
		};

		document.addEventListener("mousemove", handleGlobalMouseMove);
		document.addEventListener("mouseup", handleGlobalMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleGlobalMouseMove);
			document.removeEventListener("mouseup", handleGlobalMouseUp);
		};
	}, [startDaySelection, handleEndSelection, setEndDaySelection]);

	return (
		<td>
			<button
				type="button"
				onTouchMove={handleTouchMove}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
				onMouseMove={handleMouseMove}
				onMouseDown={handleMouseDown}
				className="relative flex w-full cursor-pointer select-none justify-center py-2 [touch-action:pinch-zoom]"
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
