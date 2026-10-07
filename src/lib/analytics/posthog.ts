import "server-only";

import type { AnalyticsEventProperties } from "@zotmeet/shared";
import { PostHog } from "posthog-node";

/**
 * Server-side PostHog capture for business events (meeting created,
 * availability saved, …). These fire from the server rather than the browser
 * because ad blockers can't drop them and they are recorded only once the
 * write has succeeded.
 *
 * The site runs on Lambda (SST), which freezes as soon as the response is
 * sent, so events are sent immediately rather than batched. Unset
 * `NEXT_PUBLIC_POSTHOG_KEY` (local dev, by default) turns this into a no-op.
 */

const POSTHOG_INGEST_HOST = "https://us.i.posthog.com";

const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

const client = apiKey
	? new PostHog(apiKey, {
			host: POSTHOG_INGEST_HOST,
			flushAt: 1,
			flushInterval: 0,
			// Analytics must never hold up a server action for long.
			requestTimeout: 3000,
		})
	: null;

/**
 * Records `event` for `memberId` — the same distinct id the browser
 * identifies with (`PostHogIdentify`), so server and client events land on
 * one person. Never throws: a PostHog outage must not fail the action.
 */
export async function captureServerEvent<
	E extends keyof AnalyticsEventProperties,
>(
	memberId: string,
	event: E,
	properties: AnalyticsEventProperties[E],
): Promise<void> {
	if (!client) return;
	try {
		await client.captureImmediate({
			distinctId: memberId,
			event,
			properties,
		});
	} catch (error) {
		console.error(`PostHog capture failed (${event}):`, error);
	}
}
