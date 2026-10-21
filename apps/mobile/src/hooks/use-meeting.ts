import type { MeetingResponse } from "@zotmeet/shared";
import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { getMeeting } from "@/lib/api/meetings";

export type MeetingState =
	| { status: "loading" }
	| { status: "ready"; meeting: MeetingResponse }
	| { status: "not-found" }
	| { status: "error"; error: string };

/**
 * Loads one meeting for the availability screen. The web page does this on
 * the server (`app/availability/[slug]/page.tsx` → `getExistingMeeting`);
 * the mobile screen goes through `GET /api/meetings/:id` instead and reports
 * the same three outcomes the web has pages for: content, not found, error.
 */
export function useMeeting(id: string | undefined): MeetingState & {
	reload: () => void;
} {
	const [state, setState] = useState<MeetingState>({ status: "loading" });
	// Bumped by `reload` to run the effect again for the same id.
	const [attempt, setAttempt] = useState(0);

	useEffect(() => {
		if (!id) {
			setState({ status: "not-found" });
			return;
		}

		let cancelled = false;
		setState({ status: "loading" });

		// Read so `attempt` is a real input of this effect: `reload` bumps it to
		// fetch the same id again.
		void attempt;

		getMeeting(id)
			.then((meeting) => {
				if (!cancelled) setState({ status: "ready", meeting });
			})
			.catch((error: unknown) => {
				if (cancelled) return;
				if (error instanceof ApiError && error.status === 404) {
					setState({ status: "not-found" });
				} else {
					setState({
						status: "error",
						error:
							error instanceof Error
								? error.message
								: "Failed to load meeting.",
					});
				}
			});

		return () => {
			cancelled = true;
		};
	}, [id, attempt]);

	const reload = useCallback(() => setAttempt((n) => n + 1), []);

	return { ...state, reload };
}
