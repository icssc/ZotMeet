import {
	type BestTime,
	classifyRooms,
	computeBestTimes,
	countRoomsFreeForAnyBestTime,
	normalizeRooms,
	type Room,
	type RoomFit,
	studyRoomQueryFor,
} from "@zotmeet/shared";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchStudyRooms } from "@/lib/rooms/get-rooms";
import type { Member } from "@/lib/types/availability";
import type { ZotDate } from "@/lib/zotdate";
import { useRoomFlowStore } from "@/store/useRoomFlowStore";

/** A best time with the rooms the library feed has for it. */
export interface BestTimeRooms extends BestTime {
	/** Display names of `missingMemberIds`. */
	missingNames: string[];
	status: "loading" | "error" | "ready";
	rooms: Room[];
	whole: RoomFit[];
	partial: RoomFit[];
}

export interface StudyRoomFlow {
	times: BestTimeRooms[];
	/** Days-of-week meetings have no calendar date to book a room on. */
	isUnsupported: boolean;
	isLoading: boolean;
	/** How many best-time lookups failed. */
	errorCount: number;
	retry: () => void;
	/** The tab's "ROOMS · m"; null while any lookup is loading. */
	roomCount: number | null;
	/** Total the "x/y free" pill counts: members who have responded. */
	memberCount: number;
}

type QueryResult =
	| { status: "loading" }
	| { status: "error" }
	| { status: "ready"; rooms: Room[] };

const DEFAULT_LIMIT = 5;
const MORE_TIMES_LIMIT = 8;

function queryKey({ date, timeRange }: { date: string; timeRange: string }) {
	return `${date}|${timeRange}`;
}

/**
 * Best times plus the study rooms free during each. One API call per best
 * time, cached by query for the page's life, so saving availability or
 * toggling "Show more times" only fetches the windows it hasn't seen.
 */
export function useStudyRoomFlow({
	enabled,
	isAnchorMeeting,
	availabilityDates,
	ifNeededDates,
	respondedMembers,
	fromTimeMinutes,
	blockCount,
	timeZone,
}: {
	enabled: boolean;
	isAnchorMeeting: boolean;
	availabilityDates: ZotDate[];
	ifNeededDates: ZotDate[];
	respondedMembers: Member[];
	fromTimeMinutes: number;
	blockCount: number;
	timeZone: string;
}): StudyRoomFlow {
	const showMoreTimes = useRoomFlowStore((state) => state.showMoreTimes);
	const [results, setResults] = useState<ReadonlyMap<string, QueryResult>>(
		() => new Map(),
	);
	const requested = useRef(new Set<string>());
	const controllers = useRef(new Set<AbortController>());

	useEffect(() => {
		const active = controllers.current;
		return () => {
			for (const c of active) c.abort();
		};
	}, []);

	const bestTimes = useMemo(
		() =>
			isAnchorMeeting
				? []
				: computeBestTimes({
						availabilityDates,
						ifNeededDates,
						memberIds: respondedMembers.map((m) => m.memberId),
						fromTimeMinutes,
						blockCount,
						timeZone,
						slack: showMoreTimes ? 1 : 0,
						limit: showMoreTimes ? MORE_TIMES_LIMIT : DEFAULT_LIMIT,
					}),
		[
			isAnchorMeeting,
			availabilityDates,
			ifNeededDates,
			respondedMembers,
			fromTimeMinutes,
			blockCount,
			timeZone,
			showMoreTimes,
		],
	);

	const queries = useMemo(
		() =>
			bestTimes.map((time) => {
				const query = studyRoomQueryFor(time);
				return { key: queryKey(query), query };
			}),
		[bestTimes],
	);

	const fetchQuery = useCallback(
		(key: string, query: { date: string; timeRange: string }) => {
			requested.current.add(key);
			const controller = new AbortController();
			controllers.current.add(controller);
			setResults((prev) => new Map(prev).set(key, { status: "loading" }));
			fetchStudyRooms(query, { signal: controller.signal })
				.then(({ data }) => {
					setResults((prev) =>
						new Map(prev).set(key, {
							status: "ready",
							rooms: normalizeRooms(data ?? []),
						}),
					);
				})
				.catch((err: unknown) => {
					if ((err as Error)?.name === "AbortError") return;
					console.error("Failed to fetch study rooms:", err);
					requested.current.delete(key);
					setResults((prev) => new Map(prev).set(key, { status: "error" }));
				})
				.finally(() => controllers.current.delete(controller));
		},
		[],
	);

	useEffect(() => {
		if (!enabled) return;
		for (const { key, query } of queries) {
			if (!requested.current.has(key) && !results.has(key)) {
				fetchQuery(key, query);
			}
		}
	}, [enabled, queries, results, fetchQuery]);

	const retry = useCallback(() => {
		for (const { key, query } of queries) {
			if (results.get(key)?.status === "error") fetchQuery(key, query);
		}
	}, [queries, results, fetchQuery]);

	const times = useMemo<BestTimeRooms[]>(() => {
		const names = new Map(
			respondedMembers.map((m) => [m.memberId, m.displayName]),
		);
		return bestTimes.map((time, i) => {
			const result = results.get(queries[i].key);
			const rooms = result?.status === "ready" ? result.rooms : [];
			const { whole, partial } = classifyRooms(rooms, time);
			return {
				...time,
				missingNames: time.missingMemberIds.map(
					(id) => names.get(id) ?? "Someone",
				),
				status:
					result?.status === "ready" || result?.status === "error"
						? result.status
						: "loading",
				rooms,
				whole,
				partial,
			};
		});
	}, [bestTimes, queries, results, respondedMembers]);

	const isLoading = times.some((t) => t.status === "loading");
	const errorCount = times.filter((t) => t.status === "error").length;

	const roomCount = useMemo(() => {
		if (isLoading) return null;
		return countRoomsFreeForAnyBestTime(
			new Map(times.map((t) => [t.id, t.rooms])),
			times,
		);
	}, [isLoading, times]);

	return {
		times,
		isUnsupported: isAnchorMeeting,
		isLoading,
		errorCount,
		retry,
		roomCount,
		memberCount: respondedMembers.length,
	};
}
