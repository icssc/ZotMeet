"use client";

import type React from "react";
import { useCallback, useMemo, useRef } from "react";
import type { SelectionStateType } from "@/lib/types/availability";

export interface GridCell {
	zotDateIndex: number;
	blockIndex: number;
}

export interface UseGridDragSelectionOptions {
	lockToStartRow?: boolean;
	tapThreshold?: number;
	onDragStart?: (cell: GridCell) => void;
	onDragUpdate?: (
		range: SelectionStateType,
		ctx: { start: GridCell; end: GridCell },
	) => void;
	onCommit: (
		range: SelectionStateType,
		ctx: { isTap: boolean; start: GridCell; end: GridCell },
	) => void;
	onCancel?: () => void;
}

export interface UseGridDragSelectionHandlers {
	onPointerDown: React.PointerEventHandler<HTMLElement>;
	onPointerMove: React.PointerEventHandler<HTMLElement>;
	onPointerUp: React.PointerEventHandler<HTMLElement>;
	onPointerCancel: React.PointerEventHandler<HTMLElement>;
	onKeyDown: React.KeyboardEventHandler<HTMLElement>;
}

function readCellFromElement(el: Element | null): GridCell | null {
	if (!el) return null;
	const node =
		el instanceof HTMLElement &&
		el.hasAttribute("data-date-index") &&
		el.hasAttribute("data-block-index")
			? el
			: (el.closest?.("[data-date-index][data-block-index]") ?? null);
	if (!node) return null;
	const zotDateIndex = Number.parseInt(
		node.getAttribute("data-date-index") ?? "",
		10,
	);
	const blockIndex = Number.parseInt(
		node.getAttribute("data-block-index") ?? "",
		10,
	);
	if (Number.isNaN(zotDateIndex) || Number.isNaN(blockIndex)) return null;
	return { zotDateIndex, blockIndex };
}

function buildRange(
	start: GridCell,
	end: GridCell,
	lockToStartRow: boolean,
): SelectionStateType {
	const endDate = lockToStartRow ? start.zotDateIndex : end.zotDateIndex;
	return {
		earlierDateIndex: Math.min(start.zotDateIndex, endDate),
		laterDateIndex: Math.max(start.zotDateIndex, endDate),
		earlierBlockIndex: Math.min(start.blockIndex, end.blockIndex),
		laterBlockIndex: Math.max(start.blockIndex, end.blockIndex),
	};
}

/**
 * Native Pointer Events drag primitive used across the personal, schedule, and group grids.
 *
 * Design notes:
 * - `setPointerCapture` on the originating cell binds every subsequent `pointermove` /
 *   `pointerup` / `pointercancel` back to that cell, so the drag survives leaving the
 *   originating cell or even the table.
 * - `elementFromPoint` inside `pointermove` resolves the cell currently under the pointer.
 * - `preventDefault` on `pointerdown` suppresses the browser's synthesized `click`, which
 *   ensures the commit fires exactly once (from `pointerup`) — callers MUST NOT also wire
 *   `onClick` to this hook.
 * - Keyboard activation is exposed separately via `onKeyDown` (Enter / Space). The pointer
 *   and keyboard paths never overlap.
 *
 * Handlers returned here must be spread on every cell element that carries
 * `data-date-index` / `data-block-index`.
 */
export function useGridDragSelection(
	opts: UseGridDragSelectionOptions,
): UseGridDragSelectionHandlers {
	const optsRef = useRef(opts);
	optsRef.current = opts;

	const activePointerIdRef = useRef<number | null>(null);
	const startCellRef = useRef<GridCell | null>(null);
	const endCellRef = useRef<GridCell | null>(null);
	const startXYRef = useRef<{ x: number; y: number } | null>(null);
	const movedPastThresholdRef = useRef(false);
	const captureTargetRef = useRef<HTMLElement | null>(null);

	const resetState = useCallback(() => {
		activePointerIdRef.current = null;
		startCellRef.current = null;
		endCellRef.current = null;
		startXYRef.current = null;
		movedPastThresholdRef.current = false;
		captureTargetRef.current = null;
	}, []);

	const onPointerDown = useCallback<React.PointerEventHandler<HTMLElement>>(
		(event) => {
			if (event.button !== undefined && event.button !== 0) return;
			const target = event.currentTarget;
			const cell = readCellFromElement(target);
			if (!cell) return;

			event.preventDefault();

			try {
				target.setPointerCapture(event.pointerId);
			} catch (error) {
				console.error(error);
			}

			activePointerIdRef.current = event.pointerId;
			startCellRef.current = cell;
			endCellRef.current = cell;
			startXYRef.current = { x: event.clientX, y: event.clientY };
			movedPastThresholdRef.current = false;
			captureTargetRef.current = target;

			optsRef.current.onDragStart?.(cell);
			const lock = optsRef.current.lockToStartRow ?? false;
			const range = buildRange(cell, cell, lock);
			optsRef.current.onDragUpdate?.(range, { start: cell, end: cell });
		},
		[],
	);

	const onPointerMove = useCallback<React.PointerEventHandler<HTMLElement>>(
		(event) => {
			if (activePointerIdRef.current !== event.pointerId) return;
			const start = startCellRef.current;
			if (!start) return;

			if (!movedPastThresholdRef.current && startXYRef.current) {
				const dx = event.clientX - startXYRef.current.x;
				const dy = event.clientY - startXYRef.current.y;
				const threshold = optsRef.current.tapThreshold ?? 3;
				if (Math.hypot(dx, dy) > threshold) {
					movedPastThresholdRef.current = true;
				}
			}

			const hit = readCellFromElement(
				document.elementFromPoint(event.clientX, event.clientY),
			);
			if (!hit) return;

			const lock = optsRef.current.lockToStartRow ?? false;
			const clampedEnd: GridCell = lock
				? { zotDateIndex: start.zotDateIndex, blockIndex: hit.blockIndex }
				: hit;

			const prevEnd = endCellRef.current;
			if (
				prevEnd &&
				prevEnd.zotDateIndex === clampedEnd.zotDateIndex &&
				prevEnd.blockIndex === clampedEnd.blockIndex
			) {
				return;
			}
			endCellRef.current = clampedEnd;
			const range = buildRange(start, clampedEnd, lock);
			optsRef.current.onDragUpdate?.(range, { start, end: clampedEnd });
		},
		[],
	);

	const onPointerUp = useCallback<React.PointerEventHandler<HTMLElement>>(
		(event) => {
			if (activePointerIdRef.current !== event.pointerId) return;
			const target = captureTargetRef.current ?? event.currentTarget;
			if (target?.hasPointerCapture?.(event.pointerId)) {
				target.releasePointerCapture(event.pointerId);
			}

			const start = startCellRef.current;
			const end = endCellRef.current ?? start;
			const isTap = !movedPastThresholdRef.current;
			resetState();

			if (!start || !end) return;
			const lock = optsRef.current.lockToStartRow ?? false;
			const range = buildRange(start, end, lock);
			optsRef.current.onCommit(range, { isTap, start, end });
		},
		[resetState],
	);

	const onPointerCancel = useCallback<React.PointerEventHandler<HTMLElement>>(
		(event) => {
			if (activePointerIdRef.current !== event.pointerId) return;
			const target = captureTargetRef.current ?? event.currentTarget;
			if (target?.hasPointerCapture?.(event.pointerId)) {
				target.releasePointerCapture(event.pointerId);
			}
			resetState();
			optsRef.current.onCancel?.();
		},
		[resetState],
	);

	const onKeyDown = useCallback<React.KeyboardEventHandler<HTMLElement>>(
		(event) => {
			if (event.key !== "Enter" && event.key !== " ") return;
			// Ignore while a pointer drag is in progress.
			if (activePointerIdRef.current !== null) return;
			const cell = readCellFromElement(event.currentTarget);
			if (!cell) return;
			event.preventDefault();
			const lock = optsRef.current.lockToStartRow ?? false;
			const range = buildRange(cell, cell, lock);
			optsRef.current.onCommit(range, { isTap: true, start: cell, end: cell });
		},
		[],
	);

	return useMemo(
		() => ({
			onPointerDown,
			onPointerMove,
			onPointerUp,
			onPointerCancel,
			onKeyDown,
		}),
		[onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onKeyDown],
	);
}
