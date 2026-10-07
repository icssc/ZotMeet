"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

/**
 * Ties the browser's PostHog person to the signed-in member, using the same
 * id the server captures with (`captureServerEvent`). Rendered in the app
 * shell, which re-renders with `memberId: null` after logout redirects back
 * here — so logout resets the person without each logout button having to.
 */
export function PostHogIdentify({ memberId }: { memberId: string | null }) {
	useEffect(() => {
		if (!posthog.__loaded) return;

		if (memberId) {
			if (posthog.get_distinct_id() !== memberId) {
				posthog.identify(memberId);
			}
		} else if (posthog.get_property("$user_state") === "identified") {
			posthog.reset();
		}
	}, [memberId]);

	return null;
}
