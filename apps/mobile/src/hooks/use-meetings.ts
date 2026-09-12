import type { MeetingsListResponse } from "@zotmeet/shared";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { getMeetings } from "@/lib/api/meetings";
import { useAuthStore } from "@/store/useAuthStore";

export type MeetingsState =
	| { status: "loading" }
	| ({ status: "ready" } & MeetingsListResponse)
	/** No credential the server accepts — the web redirects to login here. */
	| { status: "unauthorized" }
	| { status: "error"; error: string };

/**
 * Loads the member's meetings for the Meetings tab. The web page does this
 * on the server (`app/summary/page.tsx`), fresh on every navigation; the tab
 * goes through `GET /api/meetings` instead and refetches at the moments a
 * navigation would have: when the tab regains focus (coming back from a
 * meeting, or the app returning to the foreground), when the signed-in user
 * changes, on `reload` after a card is deleted or left (the web's
 * `router.refresh()`), and on `refresh` for pull-to-refresh. A refetch of a
 * list already showing keeps it on screen (`refreshing`) rather than
 * flashing back to the spinner.
 */
export function useMeetings(): MeetingsState & {
	reload: () => void;
	refresh: () => Promise<void>;
	/** A refetch is in flight behind an already-rendered list. */
	refreshing: boolean;
} {
	const [state, setState] = useState<MeetingsState>({ status: "loading" });
	const [refreshing, setRefreshing] = useState(false);
	const [attempt, setAttempt] = useState(0);
	const userId = useAuthStore((s) => s.user?.id ?? null);
	// Skips the focus effect's fetch on first focus, which the mount effect
	// already covers.
	const mounted = useRef(false);

	const fetchMeetings = useCallback(async (quiet: boolean) => {
		if (quiet) setRefreshing(true);
		else setState({ status: "loading" });
		try {
			const list = await getMeetings();
			setState({ status: "ready", ...list });
		} catch (error: unknown) {
			if (error instanceof ApiError && error.status === 401) {
				setState({ status: "unauthorized" });
			} else {
				setState({
					status: "error",
					error:
						error instanceof Error ? error.message : "Failed to load meetings.",
				});
			}
		} finally {
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		let cancelled = false;
		setState({ status: "loading" });

		// Read so both are real inputs of this effect: `reload` bumps `attempt`
		// to fetch again, and a sign-in or sign-out changes `userId`.
		void attempt;
		void userId;

		getMeetings()
			.then((list) => {
				if (!cancelled) setState({ status: "ready", ...list });
			})
			.catch((error: unknown) => {
				if (cancelled) return;
				if (error instanceof ApiError && error.status === 401) {
					setState({ status: "unauthorized" });
				} else {
					setState({
						status: "error",
						error:
							error instanceof Error
								? error.message
								: "Failed to load meetings.",
					});
				}
			});

		return () => {
			cancelled = true;
		};
	}, [attempt, userId]);

	useFocusEffect(
		useCallback(() => {
			if (!mounted.current) {
				mounted.current = true;
				return;
			}
			void fetchMeetings(true);
		}, [fetchMeetings]),
	);

	const reload = useCallback(() => setAttempt((n) => n + 1), []);
	const refresh = useCallback(() => fetchMeetings(true), [fetchMeetings]);

	return { ...state, reload, refresh, refreshing };
}
