"use client";

import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { CalendarBody } from "@/components/creation/calendar/calendar-body";
import { Separator } from "@/components/ui/separator";
import { WEEKDAYS } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";

function addCalendarMonth(
	month: number,
	year: number,
	delta: number,
): [number, number] {
	const d = new Date(year, month + delta, 1);
	return [d.getMonth(), d.getFullYear()];
}

interface CalendarMonthCarouselProps {
	currentMonth: number;
	currentYear: number;
	selectedDays: ZotDate[];
	updateSelectedRange: (startDate: ZotDate, endDate: ZotDate) => void;
	onNavigateBySwipe: (direction: -1 | 1) => void;
}

/**
 * Horizontal scroll-snap month navigation for touch: content tracks the finger
 * mid-gesture; release uses native momentum + snap. Resets to the “current”
 * slide when month state changes (chevrons or committed swipe).
 */
export function CalendarMonthCarousel({
	currentMonth,
	currentYear,
	selectedDays,
	updateSelectedRange,
	onNavigateBySwipe,
}: CalendarMonthCarouselProps) {
	const scrollRef = useRef<HTMLDivElement>(null);
	/** Suppresses settle handling while we programmatically re-center after month change. */
	const settleLockRef = useRef(true);

	const [prevMY, nextMY] = useMemo(() => {
		return [
			addCalendarMonth(currentMonth, currentYear, -1),
			addCalendarMonth(currentMonth, currentYear, 1),
		] as const;
	}, [currentMonth, currentYear]);

	const daysPrev = useMemo(
		() => ZotDate.generateZotDates(prevMY[0], prevMY[1], selectedDays),
		[prevMY, selectedDays],
	);

	const daysCurrent = useMemo(
		() => ZotDate.generateZotDates(currentMonth, currentYear, selectedDays),
		[currentMonth, currentYear, selectedDays],
	);

	const daysNext = useMemo(
		() => ZotDate.generateZotDates(nextMY[0], nextMY[1], selectedDays),
		[nextMY, selectedDays],
	);

	const snapScrollToCenter = useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;
		const w = el.clientWidth;
		if (w === 0) return;
		el.scrollLeft = w;
	}, []);

	const viewedMonthKey = `${currentYear}-${currentMonth}`;

	useLayoutEffect(() => {
		// Re-run when the viewed month changes (chevron or swipe) to snap the scroller back to the center panel.
		void viewedMonthKey;
		settleLockRef.current = true;
		snapScrollToCenter();
		requestAnimationFrame(() => {
			settleLockRef.current = false;
		});
	}, [viewedMonthKey, snapScrollToCenter]);

	const handleSettledScroll = useCallback(() => {
		if (settleLockRef.current) return;
		const el = scrollRef.current;
		if (!el) return;

		const w = el.clientWidth;
		if (w === 0) return;

		const approxIndex = Math.min(2, Math.max(0, Math.round(el.scrollLeft / w)));
		if (approxIndex === 0) {
			onNavigateBySwipe(-1);
		} else if (approxIndex === 2) {
			onNavigateBySwipe(1);
		}
	}, [onNavigateBySwipe]);

	useLayoutEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		const onScrollEnd = () => handleSettledScroll();

		let settleTimer: ReturnType<typeof setTimeout> | undefined;
		const onScroll = () => {
			if (settleTimer) clearTimeout(settleTimer);
			settleTimer = setTimeout(onScrollEnd, 100);
		};

		el.addEventListener("scrollend", onScrollEnd);
		el.addEventListener("scroll", onScroll, { passive: true });

		return () => {
			el.removeEventListener("scrollend", onScrollEnd);
			el.removeEventListener("scroll", onScroll);
			if (settleTimer) clearTimeout(settleTimer);
		};
	}, [handleSettledScroll]);

	const weekdayHeader = (
		<tr>
			{WEEKDAYS.map((dayOfWeek) => (
				<th className="px-0" key={dayOfWeek}>
					<div>
						<p className="w-full text-center font-light text-slate-medium text-sm uppercase">
							{dayOfWeek.slice(0, 1)}
						</p>
					</div>
					<Separator className="my-2 h-[2px] bg-slate-base" />
				</th>
			))}
		</tr>
	);

	return (
		<div
			ref={scrollRef}
			className="mt-5 flex w-full touch-pan-x snap-x snap-mandatory overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			style={{ WebkitOverflowScrolling: "touch" }}
		>
			<div className="w-full min-w-full shrink-0 snap-center snap-always">
				<table className="w-full table-fixed border-collapse">
					<thead>{weekdayHeader}</thead>
					<CalendarBody
						calendarDays={daysPrev}
						currentMonth={prevMY[0]}
						updateSelectedRange={updateSelectedRange}
						allowScrollParentGesture
					/>
				</table>
			</div>

			<div className="w-full min-w-full shrink-0 snap-center snap-always">
				<table className="w-full table-fixed border-collapse">
					<thead>{weekdayHeader}</thead>
					<CalendarBody
						calendarDays={daysCurrent}
						currentMonth={currentMonth}
						updateSelectedRange={updateSelectedRange}
						allowScrollParentGesture
					/>
				</table>
			</div>

			<div className="w-full min-w-full shrink-0 snap-center snap-always">
				<table className="w-full table-fixed border-collapse">
					<thead>{weekdayHeader}</thead>
					<CalendarBody
						calendarDays={daysNext}
						currentMonth={nextMY[0]}
						updateSelectedRange={updateSelectedRange}
						allowScrollParentGesture
					/>
				</table>
			</div>
		</div>
	);
}
