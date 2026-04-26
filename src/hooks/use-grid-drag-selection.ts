"use client";

import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import type { SelectionStateType } from "@/lib/types/availability";

export interface GridCell {
	zotDateIndex: number;
	blockIndex: number;
}

export interface UseGridDragSelectionOptions {
	/** When false, all handlers return immediately. Defaults to true. */
	enabled?: boolean;
	/**
	 * When true, the dragged range stays on the start row (schedule-grid semantics):
	 * `end.zotDateIndex` is clamped to `start.zotDateIndex` regardless of pointer motion.
	 */
	lockToStartRow?: boolean;
	/** Pixel distance at which a pointer-down becomes a drag rather than a tap. Defaults to 3. */
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
	/**
	 * Fire-and-forget single-cell commit for keyboard (Enter/Space) users. Needed because
	 * `setPointerCapture` on pointerdown suppresses the synthesized `click` on some browsers.
	 */
	onKeyCommit: (cell: GridCell) => void;
}

/**
 * Read `data-date-index` and `data-block-index` off an element (or an ancestor
 * exposed via `closest`). Returns null if either attribute is missing or non-numeric.
 */
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
 * Uses `setPointerCapture` so the drag continues when the pointer leaves the originating cell,
 * and `elementFromPoint` to locate the cell currently under the pointer during a move.
 *
 * Handlers returned here must be spread on every cell `<button>` (the element that carries
 * `data-date-index` / `data-block-index`).
 */
export function useGridDragSelection(
	opts: UseGridDragSelectionOptions,
): UseGridDragSelectionHandlers {
	// Keep the latest options in a ref so callbacks have stable identity.
	const optsRef = useRef(opts);
	useEffect(() => {
		optsRef.current = opts;
	});

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

	const onPointerDown = useCallback<
		React.PointerEventHandler<HTMLElement>
	>((event) => {
		const { enabled = true } = optsRef.current;
		if (!enabled) return;
		const target = event.currentTarget;
		const cell = readCellFromElement(target);
		if (!cell) return;

		try {
			target.setPointerCapture(event.pointerId);
		} catch {
			// Ignore: some browsers throw if the pointer is already captured elsewhere.
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
	}, []);

	const onPointerMove = useCallback<
		React.PointerEventHandler<HTMLElement>
	>((event) => {
		const { enabled = true } = optsRef.current;
		if (!enabled) return;
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
	}, []);

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

	const onPointerCancel = useCallback<
		React.PointerEventHandler<HTMLElement>
	>(
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

	const onKeyCommit = useCallback((cell: GridCell) => {
		const { enabled = true } = optsRef.current;
		if (!enabled) return;
		// Ignore keyboard taps that arrive mid-drag (shouldn't happen, defensive).
		if (activePointerIdRef.current !== null) return;
		const lock = optsRef.current.lockToStartRow ?? false;
		const range = buildRange(cell, cell, lock);
		optsRef.current.onCommit(range, { isTap: true, start: cell, end: cell });
	}, []);

	return {
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerCancel,
		onKeyCommit,
	};
}
