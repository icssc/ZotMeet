import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { StudyRoomApiEntry } from "@/components/availability/room-recommendations";
import { fetchStudyRooms } from "@/lib/rooms/get-rooms";
import { getBestTimeRanges, getCapacityRange } from "@/lib/rooms/utils";
import { DEFAULT_ROOM_FILTERS, type RoomFilters } from "@/lib/types/studyrooms";
import type { ZotDate } from "@/lib/zotdate";

export type UseRoomRecommendations = {
	filters: RoomFilters;
	setFilters: (next: RoomFilters) => void;
	rooms: StudyRoomApiEntry[];
	error: string | null;
	isLoading: boolean;
	hasSearched: boolean;
	showBestRooms: () => Promise<void>;
};

export function useRoomRecommendations(
	availabilityDates: ZotDate[],
): UseRoomRecommendations {
	const [filters, setFilters] = useState<RoomFilters>(DEFAULT_ROOM_FILTERS);
	const [rooms, setRooms] = useState<StudyRoomApiEntry[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);
	const abortRef = useRef<AbortController | null>(null);

	const bestTimeRanges = useMemo(
		() => getBestTimeRanges(availabilityDates),
		[availabilityDates],
	);

	useEffect(() => {
		return () => abortRef.current?.abort();
	}, []);

	const showBestRooms = useCallback(async () => {
		// Cancel any in-flight batch so a slow earlier response can't overwrite a
		// newer one (e.g. the user toggles a filter and re-clicks).
		abortRef.current?.abort();
		const controller = new AbortController();
		abortRef.current = controller;

		setIsLoading(true);
		setError(null);

		try {
			const { capacityMin, capacityMax } = getCapacityRange(filters.capacities);

			const settled = await Promise.allSettled(
				bestTimeRanges.map(({ date, time }) =>
					fetchStudyRooms(
						{ date, timeRange: time, capacityMin, capacityMax },
						{ signal: controller.signal },
					),
				),
			);

			if (controller.signal.aborted) return;

			const successes = settled.filter(
				(r): r is PromiseFulfilledResult<{ data: StudyRoomApiEntry[] }> =>
					r.status === "fulfilled",
			);
			const failures = settled.length - successes.length;

			const combined = successes.flatMap((r) => r.value.data ?? []);
			setRooms(combined);

			if (failures > 0) {
				setError(
					failures === settled.length
						? "Failed to load study rooms. Please try again later."
						: `Some time windows failed to load (${failures}/${settled.length}). Showing partial results.`,
				);
			}
		} catch (err) {
			if ((err as Error)?.name === "AbortError") return;
			console.error("Failed to fetch study rooms:", err);
			setError("Failed to load study rooms. Please try again later.");
			setRooms([]);
		} finally {
			if (!controller.signal.aborted) {
				setIsLoading(false);
				setHasSearched(true);
			}
		}
	}, [bestTimeRanges, filters.capacities]);

	return {
		filters,
		setFilters,
		rooms,
		error,
		isLoading,
		hasSearched,
		showBestRooms,
	};
}
