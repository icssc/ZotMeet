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
	isUnsupported: boolean;
	isLoading: boolean;
	errorCount: number;
	retry: () => void;
	roomCount: number | null;
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

export function useStudyRoomFlow({
	meetingId,
	enabled,
	isAnchorMeeting,
	availabilityDates,
	ifNeededDates,
	members,
	pendingMembers,
	fromTimeMinutes,
	blockCount,
	timeZone,
}: {
	meetingId: string;
	enabled: boolean;
	isAnchorMeeting: boolean;
	availabilityDates: ZotDate[];
	ifNeededDates: ZotDate[];
	members: Member[];
	pendingMembers: Member[];
	fromTimeMinutes: number;
	blockCount: number;
	timeZone: string;
}): StudyRoomFlow {
	const resetForMeetingId = useRef<string | null>(null);
	useEffect(() => {
		if (resetForMeetingId.current === meetingId) return;
		resetForMeetingId.current = meetingId;
		useRoomFlowStore.getState().reset();
	}, [meetingId]);

	const respondedMembers = useMemo(() => {
		const pendingIds = new Set(pendingMembers.map((m) => m.memberId));
		return members.filter((m) => !pendingIds.has(m.memberId));
	}, [members, pendingMembers]);

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
					requested.current.delete(key);
					if ((err as Error)?.name === "AbortError") {
						// Cancelled (Strict Mode's dev remount does this): forget the
						// query so the fetch effect starts it again.
						setResults((prev) => {
							const next = new Map(prev);
							next.delete(key);
							return next;
						});
						return;
					}
					console.error("Failed to fetch study rooms:", err);
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
		// Several best times can share a query; fetch each once, or the
		// duplicates race to write the same result.
		const retried = new Set<string>();
		for (const { key, query } of queries) {
			if (retried.has(key) || results.get(key)?.status !== "error") continue;
			retried.add(key);
			fetchQuery(key, query);
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

	// No count while any lookup is unsettled: a failed one's rooms are
	// unknown, and counting without them would understate the total.
	const roomCount = useMemo(() => {
		if (isAnchorMeeting || isLoading || errorCount > 0) return null;
		return countRoomsFreeForAnyBestTime(
			new Map(times.map((t) => [t.id, t.rooms])),
			times,
		);
	}, [isAnchorMeeting, isLoading, errorCount, times]);

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
