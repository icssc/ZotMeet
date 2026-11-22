import {
	type BestTime,
	classifyRooms,
	computeBestTimes,
	DEFAULT_BEST_TIME_LIMIT,
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
	status: QueryResult["status"];
	whole: RoomFit[];
	partial: RoomFit[];
	fits: RoomFit[];
	shown: RoomFit[];
}

export interface StudyRoomFlow {
	times: BestTimeRooms[];
	isUnsupported: boolean;
	isLoading: boolean;
	errorCount: number;
	retry: () => void;
	roomCount: number | null;
	memberCount: number;
	/** Every lookup settled and no time has a room to show. */
	isEmpty: boolean;
	/** Partly free rooms exist and aren't shown yet. */
	canIncludePartial: boolean;
}

type QueryResult =
	| { status: "loading" }
	| { status: "error" }
	| { status: "ready"; rooms: Room[] };

const MORE_TIMES_LIMIT = 8;

type StudyRoomQuery = ReturnType<typeof studyRoomQueryFor>;

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
	const includePartial = useRoomFlowStore((state) => state.includePartial);
	const [results, setResults] = useState<ReadonlyMap<string, QueryResult>>(
		() => new Map(),
	);
	/** Keys with a fetch in flight; state lags a render behind, this doesn't. */
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
						limit: showMoreTimes ? MORE_TIMES_LIMIT : DEFAULT_BEST_TIME_LIMIT,
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

	// Best times can share a query (same campus day and half hours), so
	// `queries` holds each once and `timeKeys[i]` points `bestTimes[i]` at it.
	const { timeKeys, queries } = useMemo(() => {
		const queries = new Map<string, StudyRoomQuery>();
		const timeKeys = bestTimes.map((time) => {
			const query = studyRoomQueryFor(time);
			const key = `${query.date}|${query.timeRange}`;
			queries.set(key, query);
			return key;
		});
		return { timeKeys, queries };
	}, [bestTimes]);

	const fetchQuery = useCallback((key: string, query: StudyRoomQuery) => {
		if (requested.current.has(key)) return;
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
	}, []);

	useEffect(() => {
		if (!enabled) return;
		for (const [key, query] of queries) {
			if (!results.has(key)) fetchQuery(key, query);
		}
	}, [enabled, queries, results, fetchQuery]);

	const retry = useCallback(() => {
		for (const [key, query] of queries) {
			if (results.get(key)?.status === "error") fetchQuery(key, query);
		}
	}, [queries, results, fetchQuery]);

	const times = useMemo<BestTimeRooms[]>(() => {
		const names = new Map(
			respondedMembers.map((m) => [m.memberId, m.displayName]),
		);
		return bestTimes.map((time, i) => {
			const result = results.get(timeKeys[i]);
			const { whole, partial } = classifyRooms(
				result?.status === "ready" ? result.rooms : [],
				time,
			);
			const fits = [...whole, ...partial];
			return {
				...time,
				missingNames: time.missingMemberIds.map(
					(id) => names.get(id) ?? "Someone",
				),
				status: result?.status ?? "loading",
				whole,
				partial,
				fits,
				shown: includePartial ? fits : whole,
			};
		});
	}, [bestTimes, timeKeys, results, respondedMembers, includePartial]);

	const isLoading = times.some((t) => t.status === "loading");
	const errorCount = times.filter((t) => t.status === "error").length;

	// No count while any lookup is unsettled: a failed one's rooms are
	// unknown, and counting without them would understate the total.
	const roomCount = useMemo(() => {
		if (isAnchorMeeting || isLoading || errorCount > 0) return null;
		// A room free for two best times is still one room.
		return new Set(times.flatMap((t) => t.whole.map((f) => f.room.key))).size;
	}, [isAnchorMeeting, isLoading, errorCount, times]);

	return {
		times,
		isUnsupported: isAnchorMeeting,
		isLoading,
		errorCount,
		retry,
		roomCount,
		memberCount: respondedMembers.length,
		isEmpty:
			!isLoading &&
			errorCount === 0 &&
			times.every((t) => t.shown.length === 0),
		canIncludePartial:
			!includePartial && times.some((t) => t.partial.length > 0),
	};
}
