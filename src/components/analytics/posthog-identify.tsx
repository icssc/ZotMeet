"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

/**
 * Ties the browser's PostHog person to the signed-in member. Rendered in the
 * app shell, which re-renders with `memberId: null` after logout redirects
 * back here — so logout resets the person without each logout button having
 * to.
 */
export function PostHogIdentify({ memberId }: { memberId: string | null }) {
	useEffect(() => {
		if (!posthog.__loaded) return;

		const identified = posthog.get_property("$user_state") === "identified";

		if (memberId) {
			if (posthog.get_distinct_id() !== memberId) {
				// Signed in as someone else without a logout in between: start a
				// fresh person rather than merging the two members' histories.
				if (identified) posthog.reset();
				posthog.identify(memberId);
			}
		} else if (identified) {
			posthog.reset();
		}
	}, [memberId]);

	return null;
}
