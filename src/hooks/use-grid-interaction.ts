"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import type { GridCellHandlers } from "@/components/availability/table/availability-block-cell";
import {
	type GridCell,
	useGridDragSelection,
} from "@/hooks/use-grid-drag-selection";
import {
	type PaintMode,
	paintPersonalSelection,
} from "@/lib/availability/paint-selection";
import { applyScheduleSelection } from "@/lib/availability/schedule-selection";
import type { SelectionStateType } from "@/lib/types/availability";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

type AvailabilityView = "group" | "personal" | "schedule";

interface UseGridInteractionArgs {
	availabilityView: AvailabilityView;
	paintMode: PaintMode;
	availabilityDates: ZotDate[];
	ifNeededDates: ZotDate[];
	setAvailabilityDates: React.Dispatch<React.SetStateAction<ZotDate[]>>;
	setIfNeededDates: React.Dispatch<React.SetStateAction<ZotDate[]>>;
	userMemberId: string | undefined;
	fromTimeMinutes: number;
	userTimezone: string;
}

export interface UseGridInteractionResult {
	handlers: Omit<GridCellHandlers, "onCellHover">;
	gridHandlers: GridCellHandlers;
	handleMouseLeave: () => void;
}

function rangesEqual(
	a: SelectionStateType | undefined,
	b: SelectionStateType | undefined,
): boolean {
	if (!a || !b) return false;
	return (
		a.earlierDateIndex === b.earlierDateIndex &&
		a.laterDateIndex === b.laterDateIndex &&
		a.earlierBlockIndex === b.earlierBlockIndex &&
		a.laterBlockIndex === b.laterBlockIndex
	);
}

/**
 * Owns the interaction half of the availability feature:
 * - commit dispatcher (personal paint / schedule replace / group lock-unlock),
 * - the single `useGridDragSelection` instance feeding all views,
 * - group hover preview (`hoverRange`),
 * - mobile drawer + drag-leave lifecycle,
 * - global Escape shortcut to clear selection.
 *
 * Returns stable `handlers` / `gridHandlers` / `handleMouseLeave` references
 * so downstream consumers can use them directly in `useMemo` deps without
 * churn.
 */
export function useGridInteraction({
	availabilityView,
	paintMode,
	availabilityDates,
	ifNeededDates,
	setAvailabilityDates,
	setIfNeededDates,
	userMemberId,
	fromTimeMinutes,
	userTimezone,
}: UseGridInteractionArgs): UseGridInteractionResult {
	const {
		committedRange,
		setDraftRange,
		setHoverRange,
		setCommittedRange,
		setIsMobileDrawerOpen,
		resetSelection,
		replaceEntireSelection,
	} = useAvailabilityStore(
		useShallow((state) => ({
			committedRange: state.committedRange,
			setDraftRange: state.setDraftRange,
			setHoverRange: state.setHoverRange,
			setCommittedRange: state.setCommittedRange,
			setIsMobileDrawerOpen: state.setIsMobileDrawerOpen,
			resetSelection: state.resetSelection,
			replaceEntireSelection: state.replaceEntireSelection,
		})),
	);

	const groupSelectionIsLocked =
		availabilityView === "group" && committedRange !== undefined;

	const handleCommit = (
		range: SelectionStateType,
		{ isTap }: { isTap: boolean; start: GridCell; end: GridCell },
	) => {
		setDraftRange(undefined);

		if (availabilityView === "personal") {
			if (!userMemberId) return;
			const next = paintPersonalSelection({
				availabilityDates,
				ifNeededDates,
				mode: paintMode,
				range,
				memberId: userMemberId,
				fromTimeMinutes,
				timeZone: userTimezone,
			});
			setAvailabilityDates(next.availabilityDates);
			setIfNeededDates(next.ifNeededDates);
			setCommittedRange(range);
			return;
		}

		if (availabilityView === "schedule") {
			const timestamps = applyScheduleSelection({
				availabilityDates,
				range,
				fromTimeMinutes,
				timeZone: userTimezone,
			});
			if (timestamps.length > 0) {
				replaceEntireSelection(timestamps);
			}
			setCommittedRange(range);
			return;
		}

		const existing = useAvailabilityStore.getState().committedRange;
		if (isTap && existing && rangesEqual(existing, range)) {
			setCommittedRange(undefined);
			setIsMobileDrawerOpen(false);
			return;
		}
		setCommittedRange(range);
		setIsMobileDrawerOpen(true);
	};

	const handlers = useGridDragSelection({
		lockToStartRow: availabilityView === "schedule",
		onDragStart: () => {
			setCommittedRange(undefined);
			setHoverRange(undefined);
		},
		onDragUpdate: (range) => setDraftRange(range),
		onCommit: handleCommit,
		onCancel: () => setDraftRange(undefined),
	});

	const handleCellHover = useCallback(
		(cell: GridCell) => {
			if (availabilityView !== "group") return;
			if (groupSelectionIsLocked) return;
			setHoverRange({
				earlierDateIndex: cell.zotDateIndex,
				laterDateIndex: cell.zotDateIndex,
				earlierBlockIndex: cell.blockIndex,
				laterBlockIndex: cell.blockIndex,
			});
		},
		[availabilityView, groupSelectionIsLocked, setHoverRange],
	);

	const gridHandlers = useMemo<GridCellHandlers>(
		() => ({ ...handlers, onCellHover: handleCellHover }),
		[handlers, handleCellHover],
	);

	const handleMouseLeave = useCallback(() => {
		if (availabilityView === "group" && !groupSelectionIsLocked) {
			setIsMobileDrawerOpen(false);
			resetSelection();
		}
		setHoverRange(undefined);
	}, [
		availabilityView,
		groupSelectionIsLocked,
		setIsMobileDrawerOpen,
		resetSelection,
		setHoverRange,
	]);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key !== "Escape") return;
			resetSelection();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [resetSelection]);

	return { handlers, gridHandlers, handleMouseLeave };
}
