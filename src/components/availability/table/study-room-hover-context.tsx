"use client";

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

import type { StudyRoomApiEntry } from "@/components/availability/room-recommendations";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StudyRoomHoverContextValue {
	/**
	 * Pre-filtered variants: slots with isAvailable=false have already been
	 * stripped. Memoized in the provider so filtering only runs once per hover,
	 * not once per cell render.
	 */
	filteredRoomVariants: StudyRoomApiEntry[] | null;
	setHoveredRoom: (variants: StudyRoomApiEntry[] | null) => void;

	fromTimeMinutes: number;
	dateIsoToIndex: Map<string, number>;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const StudyRoomHoverContext = createContext<StudyRoomHoverContextValue>({
	filteredRoomVariants: null,
	setHoveredRoom: () => {},
	fromTimeMinutes: 0,
	dateIsoToIndex: new Map(),
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface StudyRoomHoverProviderProps {
	children: React.ReactNode;
	fromTimeMinutes: number;
	meetingDateIsos: string[];
}

export function StudyRoomHoverProvider({
	children,
	fromTimeMinutes,
	meetingDateIsos,
}: StudyRoomHoverProviderProps) {
	const [hoveredRoomVariants, setHoveredRoomVariants] = useState<
		StudyRoomApiEntry[] | null
	>(null);

	const dateIsoToIndex = useMemo(
		() => new Map(meetingDateIsos.map((iso, i) => [iso, i])),
		[meetingDateIsos],
	);

	// ---------------------------------------------------------------------------
	// Filter out unavailable slots exactly once per hover — not per cell render.
	// ---------------------------------------------------------------------------
	const filteredRoomVariants = useMemo(() => {
		if (!hoveredRoomVariants) return null;

		const filtered = hoveredRoomVariants.map((variant) => ({
			...variant,
			slots: variant.slots.filter((slot) => slot.isAvailable),
		}));

		console.log(
			"[StudyRoomHover] Available slots after filtering unavailable times:",
			filtered.map((v) => ({
				name: v.name,
				availableSlots: v.slots.map((s) => ({ start: s.start, end: s.end })),
			})),
		);

		return filtered;
	}, [hoveredRoomVariants]);

	const setHoveredRoom = useCallback((variants: StudyRoomApiEntry[] | null) => {
		setHoveredRoomVariants(variants);
	}, []);

	const value = useMemo(
		() => ({
			filteredRoomVariants,
			setHoveredRoom,
			fromTimeMinutes,
			dateIsoToIndex,
		}),
		[filteredRoomVariants, setHoveredRoom, fromTimeMinutes, dateIsoToIndex],
	);

	return (
		<StudyRoomHoverContext.Provider value={value}>
			{children}
		</StudyRoomHoverContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useStudyRoomHover() {
	return useContext(StudyRoomHoverContext);
}

// ---------------------------------------------------------------------------
// Per-cell availability check
// ---------------------------------------------------------------------------

/**
 * Checks whether the hovered room has ANY available slot that covers the given
 * (dateIndex, blockIndex) position.
 *
 * Logic:
 *   - If no room is hovered → not unavailable (no overlay).
 *   - If a room is hovered but has no slots covering this block → treat as
 *     unavailable (show overlay), since the room can't be booked here.
 *   - If a room has at least one available slot covering this block → available
 *     (no overlay).
 */
function isRoomAvailableAtBlock(
	filteredVariants: StudyRoomApiEntry[],
	dateIndex: number,
	blockIndex: number,
	fromTimeMinutes: number,
	dateIsoToIndex: Map<string, number>,
): boolean {
	for (const variant of filteredVariants) {
		for (const slot of variant.slots) {
			// Parse start/end — slots use ISO-8601 with offset, e.g.
			// "2026-05-20T20:00:00+00:00". We use local Date methods (getFullYear,
			// getHours, etc.) to stay consistent with how fromTimeMinutes is derived
			// via convertTimeFromUTC (which also operates in local time).
			const start = new Date(slot.start);
			const end = new Date(slot.end);

			// Build the local YYYY-MM-DD for this slot and look it up.
			const localYear = start.getFullYear();
			const localMonth = String(start.getMonth() + 1).padStart(2, "0");
			const localDay = String(start.getDate()).padStart(2, "0");
			const dateIso = `${localYear}-${localMonth}-${localDay}`;

			if (dateIsoToIndex.get(dateIso) !== dateIndex) continue;

			// Walk the slot in 15-minute steps and check if any step lands on
			// blockIndex. Block granularity is 15 min to match generateTimeBlocks.
			let cursor = new Date(start);
			while (cursor < end) {
				const localMinutes = cursor.getHours() * 60 + cursor.getMinutes();
				const slotBlockIndex = Math.floor(
					(localMinutes - fromTimeMinutes) / 15,
				);

				if (slotBlockIndex === blockIndex) {
					// An available slot covers this exact block — no overlay needed.
					return true;
				}

				cursor = new Date(cursor.getTime() + 15 * 60 * 1000);
			}
		}
	}

	// No available slot covered this block — show the overlay.
	return false;
}

/**
 * Returns true when the hovered study room is NOT available at this grid
 * position (i.e. the cell should show the grey overlay).
 *
 * Returns false when no room is hovered so the grid is unaffected by default.
 */
export function useIsStudyRoomUnavailable(
	dateIndex: number,
	blockIndex: number,
): boolean {
	const { filteredRoomVariants, fromTimeMinutes, dateIsoToIndex } =
		useStudyRoomHover();

	// No room hovered — never show the overlay.
	if (!filteredRoomVariants) return false;

	return !isRoomAvailableAtBlock(
		filteredRoomVariants,
		dateIndex,
		blockIndex,
		fromTimeMinutes,
		dateIsoToIndex,
	);
}
