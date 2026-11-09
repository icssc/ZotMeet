import type { GroupDetailResponse } from "@zotmeet/shared";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { getGroup } from "@/lib/api/groups";

/** Loads one group for its detail screen through `GET /api/groups/:id`. */

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
	const mounted = useRef(false);
	const latestRequest = useRef(0);

	const fetchGroup = useCallback(
		async (quiet: boolean) => {
			const ticket = ++latestRequest.current;
			const isCurrent = () => latestRequest.current === ticket;

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
					setState({
						status: "error",
						error:
							error instanceof Error ? error.message : "Failed to load group.",
					});
				}
			} finally {
				if (isCurrent()) setRefreshing(false);
			}
		},
		[id],
	);

	useEffect(() => {
		void attempt;

		void fetchGroup(false);
		return () => {
			latestRequest.current += 1;
		};
	}, [attempt, fetchGroup]);

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
