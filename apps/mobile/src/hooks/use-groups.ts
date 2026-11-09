import type { GroupsListResponse } from "@zotmeet/shared";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { getGroups } from "@/lib/api/groups";
import { useAuthStore } from "@/store/useAuthStore";

/** Loads the Groups tab through `GET /api/groups`; same refetch rules as `useMeetings`. */

export type GroupsState =
	| { status: "loading" }
	| ({ status: "ready" } & GroupsListResponse)
	| { status: "unauthorized" }
	| { status: "error"; error: string };

export function useGroups(): GroupsState & {
	reload: () => void;
	refresh: () => Promise<void>;
	refreshing: boolean;
} {
	const [state, setState] = useState<GroupsState>({ status: "loading" });
	const [refreshing, setRefreshing] = useState(false);
	const [attempt, setAttempt] = useState(0);
	const userId = useAuthStore((s) => s.user?.id ?? null);
	const mounted = useRef(false);
	const latestRequest = useRef(0);

	const fetchGroups = useCallback(async (quiet: boolean) => {
		const ticket = ++latestRequest.current;
		const requestUserId = useAuthStore.getState().user?.id ?? null;
		const isCurrent = () =>
			latestRequest.current === ticket &&
			(useAuthStore.getState().user?.id ?? null) === requestUserId;

		if (quiet) setRefreshing(true);
		else setState({ status: "loading" });
		try {
			const list = await getGroups();
			if (isCurrent()) setState({ status: "ready", ...list });
		} catch (error: unknown) {
			if (!isCurrent()) return;
			if (error instanceof ApiError && error.status === 401) {
				setState({ status: "unauthorized" });
			} else {
				setState({
					status: "error",
					error:
						error instanceof Error ? error.message : "Failed to load groups.",
				});
			}
		} finally {
			if (isCurrent()) setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		void attempt;
		void userId;

		void fetchGroups(false);
		return () => {
			latestRequest.current += 1;
		};
	}, [attempt, userId, fetchGroups]);

	useFocusEffect(
		useCallback(() => {
			if (!mounted.current) {
				mounted.current = true;
				return;
			}
			void fetchGroups(true);
		}, [fetchGroups]),
	);

	const reload = useCallback(() => setAttempt((n) => n + 1), []);
	const refresh = useCallback(() => fetchGroups(true), [fetchGroups]);

	return { ...state, reload, refresh, refreshing };
}
