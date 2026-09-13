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
	/**
	 * Ticket of the newest request. Four things fetch this list — mount, a
	 * `userId` change, `reload`, and a focus or pull-to-refresh — and any of
	 * them can be in flight when the next one starts, so responses can land out
	 * of order. Only the newest request may write state; everything older is a
	 * stale answer to a question nobody is asking any more.
	 */
	const latestRequest = useRef(0);

	const fetchMeetings = useCallback(async (quiet: boolean) => {
		const ticket = ++latestRequest.current;
		// Read from the store rather than from a dependency, which would change
		// this callback's identity and make the focus effect refetch on every
		// sign-in. Guarding on the user as well as the ticket keeps the check
		// true on its own terms: a response is only allowed to describe the
		// person who is signed in now, however it was scheduled.
		const requestUserId = useAuthStore.getState().user?.id ?? null;
		const isCurrent = () =>
			latestRequest.current === ticket &&
			(useAuthStore.getState().user?.id ?? null) === requestUserId;

		if (quiet) setRefreshing(true);
		else setState({ status: "loading" });
		try {
			const list = await getMeetings();
			if (isCurrent()) setState({ status: "ready", ...list });
		} catch (error: unknown) {
			if (!isCurrent()) return;
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
			// Whoever is newest owns the spinner and will clear it when it
			// settles; clearing it here too would hide a refetch still running.
			if (isCurrent()) setRefreshing(false);
		}
	}, []);

	// `attempt` and `userId` are the real inputs: `reload` bumps `attempt` to
	// fetch again, and a sign-in or sign-out changes `userId`. Going through
	// `fetchMeetings` rather than calling `getMeetings` directly is what makes
	// the ticket authoritative — a fetch outside it would not supersede one
	// already running, and could be overwritten by it.
	useEffect(() => {
		// Read so both count as used: the values are the trigger, not an input
		// `fetchMeetings` needs — it takes the current user from the store.
		void attempt;
		void userId;

		void fetchMeetings(false);
		// Retires the request on unmount as well as before the next run, which
		// is what the old local `cancelled` flag did for this path alone.
		return () => {
			latestRequest.current += 1;
		};
	}, [attempt, userId, fetchMeetings]);

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
