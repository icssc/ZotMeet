import type { GroupDetailResponse } from "@zotmeet/shared";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { getGroup } from "@/lib/api/groups";
import { useAuthStore } from "@/store/useAuthStore";

/** Loads one group for its detail screen through `GET /api/groups/:id`, like `useGroups`: a response only lands for the user who asked, and a failed quiet refetch keeps the loaded group. */

export type GroupState =
	| { status: "loading" }
	| ({ status: "ready" } & GroupDetailResponse)
	| { status: "not-found"; error: string }
	| { status: "unauthorized" }
	| { status: "error"; error: string };

export function useGroup(id: string | undefined): GroupState & {
	reload: () => void;
	refresh: () => Promise<void>;
	refreshing: boolean;
} {
	const [state, setState] = useState<GroupState>({ status: "loading" });
	const [refreshing, setRefreshing] = useState(false);
	const [attempt, setAttempt] = useState(0);
	const userId = useAuthStore((s) => s.user?.id ?? null);
	const mounted = useRef(false);
	const latestRequest = useRef(0);

	const fetchGroup = useCallback(
		async (quiet: boolean) => {
			const ticket = ++latestRequest.current;
			const requestUserId = useAuthStore.getState().user?.id ?? null;
			const isCurrent = () =>
				latestRequest.current === ticket &&
				(useAuthStore.getState().user?.id ?? null) === requestUserId;

			if (!id) {
				setState({ status: "not-found", error: "Group not found." });
				return;
			}

			if (quiet) setRefreshing(true);
			else setState({ status: "loading" });
			try {
				const detail = await getGroup(id);
				if (isCurrent()) setState({ status: "ready", ...detail });
			} catch (error: unknown) {
				if (!isCurrent()) return;
				if (error instanceof ApiError && error.status === 401) {
					setState({ status: "unauthorized" });
				} else if (
					error instanceof ApiError &&
					(error.status === 403 || error.status === 404)
				) {
					setState({ status: "not-found", error: error.message });
				} else {
					setState((prev) =>
						quiet && prev.status === "ready"
							? prev
							: {
									status: "error",
									error:
										error instanceof Error
											? error.message
											: "Failed to load group.",
								},
					);
				}
			} finally {
				if (isCurrent()) setRefreshing(false);
			}
		},
		[id],
	);

	useEffect(() => {
		void attempt;
		void userId;

		void fetchGroup(false);
		return () => {
			latestRequest.current += 1;
		};
	}, [attempt, userId, fetchGroup]);

	useFocusEffect(
		useCallback(() => {
			if (!mounted.current) {
				mounted.current = true;
				return;
			}
			void fetchGroup(true);
		}, [fetchGroup]),
	);

	const reload = useCallback(() => setAttempt((n) => n + 1), []);
	const refresh = useCallback(() => fetchGroup(true), [fetchGroup]);

	return { ...state, reload, refresh, refreshing };
}
