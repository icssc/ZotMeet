"use client";

import type React from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
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

const LONG_PRESS_MS = 220;
const LONG_PRESS_CANCEL_PX = 8;

/** Minimal shape for end/cancel handling (DOM + React pointer events). */
type PointerEndLike = {
	pointerId: number;
	preventDefault(): void;
};

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
 * - **Touch:** scroll/pan by default; multi-cell drag starts after a ~220ms hold (see
 *   `LONG_PRESS_MS`). Document-level pointer listeners track the finger until release.
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

	const isEngagedRef = useRef(false);
	const isTouchPointerRef = useRef(false);
	const longPressTimerRef = useRef<number | null>(null);
	const longPressAbortedRef = useRef(false);
	const preventTouchScrollRef = useRef<((e: TouchEvent) => void) | null>(null);
	const detachDocumentPointerListenersRef = useRef<(() => void) | null>(null);

	const clearLongPressTimer = useCallback(() => {
		if (longPressTimerRef.current !== null) {
			clearTimeout(longPressTimerRef.current);
			longPressTimerRef.current = null;
		}
	}, []);

	const removeTouchScrollLock = useCallback(() => {
		if (preventTouchScrollRef.current) {
			document.removeEventListener("touchmove", preventTouchScrollRef.current, {
				capture: true,
			});
			preventTouchScrollRef.current = null;
		}
	}, []);

	const detachDocumentPointerListeners = useCallback(() => {
		if (detachDocumentPointerListenersRef.current) {
			detachDocumentPointerListenersRef.current();
			detachDocumentPointerListenersRef.current = null;
		}
	}, []);

	const resetState = useCallback(() => {
		clearLongPressTimer();
		removeTouchScrollLock();
		detachDocumentPointerListeners();
		activePointerIdRef.current = null;
		startCellRef.current = null;
		endCellRef.current = null;
		startXYRef.current = null;
		movedPastThresholdRef.current = false;
		captureTargetRef.current = null;
		isEngagedRef.current = false;
		isTouchPointerRef.current = false;
		longPressAbortedRef.current = false;
	}, [
		clearLongPressTimer,
		removeTouchScrollLock,
		detachDocumentPointerListeners,
	]);

	const updatePointerMove = useCallback(
		(event: Pick<PointerEvent, "clientX" | "clientY" | "pointerId">) => {
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

	const updatePendingTouchMove = useCallback(
		(event: Pick<PointerEvent, "clientX" | "clientY">) => {
			if (!startXYRef.current) return;
			const dx = event.clientX - startXYRef.current.x;
			const dy = event.clientY - startXYRef.current.y;
			const dist = Math.hypot(dx, dy);
			const tapThreshold = optsRef.current.tapThreshold ?? 3;
			if (dist > tapThreshold) {
				movedPastThresholdRef.current = true;
			}
			if (dist > LONG_PRESS_CANCEL_PX) {
				longPressAbortedRef.current = true;
				clearLongPressTimer();
			}
		},
		[clearLongPressTimer],
	);

	const finalizePointerEnd = useCallback(
		(event: PointerEndLike) => {
			if (activePointerIdRef.current !== event.pointerId) return;

			const start = startCellRef.current;
			const end = endCellRef.current ?? start;
			const wasTouch = isTouchPointerRef.current;
			const wasEngaged = isEngagedRef.current;
			const aborted = longPressAbortedRef.current;
			const movedPastTap = movedPastThresholdRef.current;

			if (wasTouch) {
				event.preventDefault();
			}

			const target = captureTargetRef.current;
			if (target?.hasPointerCapture?.(event.pointerId)) {
				target.releasePointerCapture(event.pointerId);
			}

			resetState();

			if (!start || !end) return;

			const lock = optsRef.current.lockToStartRow ?? false;

			if (wasTouch && !wasEngaged) {
				if (aborted || movedPastTap) return;
				const range = buildRange(start, start, lock);
				optsRef.current.onCommit(range, {
					isTap: true,
					start,
					end: start,
				});
				return;
			}

			const isTap = !movedPastTap;
			const range = buildRange(start, end, lock);
			optsRef.current.onCommit(range, { isTap, start, end });
		},
		[resetState],
	);

	const cancelPointer = useCallback(
		(event: PointerEndLike) => {
			if (activePointerIdRef.current !== event.pointerId) return;

			if (isTouchPointerRef.current) {
				event.preventDefault();
			}

			const target = captureTargetRef.current;
			if (target?.hasPointerCapture?.(event.pointerId)) {
				target.releasePointerCapture(event.pointerId);
			}

			resetState();
			optsRef.current.onCancel?.();
		},
		[resetState],
	);

	const onPointerDown = useCallback<React.PointerEventHandler<HTMLElement>>(
		(event) => {
			if (event.button !== undefined && event.button !== 0) return;
			const target = event.currentTarget;
			const cell = readCellFromElement(target);
			if (!cell) return;

			const isTouch = event.pointerType === "touch";
			const downPointerId = event.pointerId;

			activePointerIdRef.current = downPointerId;
			startCellRef.current = cell;
			endCellRef.current = cell;
			startXYRef.current = { x: event.clientX, y: event.clientY };
			movedPastThresholdRef.current = false;
			captureTargetRef.current = target;
			longPressAbortedRef.current = false;

			if (isTouch) {
				isTouchPointerRef.current = true;
				isEngagedRef.current = false;

				const onDocPointerMove = (e: PointerEvent) => {
					if (e.pointerId !== downPointerId) return;
					if (!isTouchPointerRef.current) return;
					if (!isEngagedRef.current) {
						updatePendingTouchMove(e);
						return;
					}
					updatePointerMove(e);
				};

				const onDocPointerUp = (e: PointerEvent) => {
					if (e.pointerId !== downPointerId) return;
					finalizePointerEnd(e);
				};

				const onDocPointerCancel = (e: PointerEvent) => {
					if (e.pointerId !== downPointerId) return;
					cancelPointer(e);
				};

				document.addEventListener("pointermove", onDocPointerMove, {
					capture: true,
				});
				document.addEventListener("pointerup", onDocPointerUp, {
					capture: true,
				});
				document.addEventListener("pointercancel", onDocPointerCancel, {
					capture: true,
				});

				detachDocumentPointerListenersRef.current = () => {
					document.removeEventListener("pointermove", onDocPointerMove, {
						capture: true,
					});
					document.removeEventListener("pointerup", onDocPointerUp, {
						capture: true,
					});
					document.removeEventListener("pointercancel", onDocPointerCancel, {
						capture: true,
					});
				};

				longPressTimerRef.current = window.setTimeout(() => {
					longPressTimerRef.current = null;
					if (activePointerIdRef.current !== downPointerId) return;
					if (longPressAbortedRef.current) return;
					if (movedPastThresholdRef.current) return;
					const engageTarget = captureTargetRef.current;
					const startCell = startCellRef.current;
					if (!engageTarget || !startCell) return;

					isEngagedRef.current = true;
					try {
						engageTarget.setPointerCapture(downPointerId);
					} catch (error) {
						console.error(error);
					}

					const preventScroll = (e: TouchEvent) => {
						e.preventDefault();
					};
					preventTouchScrollRef.current = preventScroll;
					document.addEventListener("touchmove", preventScroll, {
						capture: true,
						passive: false,
					});

					if (typeof navigator !== "undefined" && navigator.vibrate) {
						navigator.vibrate(15);
					}

					optsRef.current.onDragStart?.(startCell);
					const lock = optsRef.current.lockToStartRow ?? false;
					const range = buildRange(startCell, startCell, lock);
					optsRef.current.onDragUpdate?.(range, {
						start: startCell,
						end: startCell,
					});
				}, LONG_PRESS_MS);

				return;
			}

			isTouchPointerRef.current = false;
			isEngagedRef.current = true;

			event.preventDefault();

			try {
				target.setPointerCapture(event.pointerId);
			} catch (error) {
				console.error(error);
			}

			optsRef.current.onDragStart?.(cell);
			const lock = optsRef.current.lockToStartRow ?? false;
			const range = buildRange(cell, cell, lock);
			optsRef.current.onDragUpdate?.(range, { start: cell, end: cell });
		},
		[
			cancelPointer,
			finalizePointerEnd,
			updatePendingTouchMove,
			updatePointerMove,
		],
	);

	const onPointerMove = useCallback<React.PointerEventHandler<HTMLElement>>(
		(event) => {
			if (
				isTouchPointerRef.current &&
				activePointerIdRef.current === event.pointerId
			) {
				return;
			}
			updatePointerMove(event);
		},
		[updatePointerMove],
	);

	const onPointerUp = useCallback<React.PointerEventHandler<HTMLElement>>(
		(event) => {
			if (activePointerIdRef.current !== event.pointerId) return;
			if (isTouchPointerRef.current) return;
			finalizePointerEnd(event);
		},
		[finalizePointerEnd],
	);

	const onPointerCancel = useCallback<React.PointerEventHandler<HTMLElement>>(
		(event) => {
			if (activePointerIdRef.current !== event.pointerId) return;
			if (isTouchPointerRef.current) return;
			cancelPointer(event);
		},
		[cancelPointer],
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

	useEffect(() => {
		return () => {
			const target = captureTargetRef.current;
			const pid = activePointerIdRef.current;
			if (
				target &&
				pid !== null &&
				typeof target.hasPointerCapture === "function" &&
				target.hasPointerCapture(pid)
			) {
				try {
					target.releasePointerCapture(pid);
				} catch {
					// ignore
				}
			}
			resetState();
		};
	}, [resetState]);

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
