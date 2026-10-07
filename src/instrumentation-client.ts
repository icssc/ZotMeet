import posthog from "posthog-js";

/**
 * Browser-side PostHog: pageviews (App Router navigations included),
 * autocapture and session replay. Next runs this file before the app
 * hydrates. Without `NEXT_PUBLIC_POSTHOG_KEY` (local dev, by default) nothing
 * loads.
 *
 * `api_host` is the `/ingest` rewrite in `next.config.mjs`, so requests are
 * first-party and survive ad blockers. Users are identified by member id in
 * `components/analytics/posthog-identify.tsx`.
 */
const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (apiKey) {
	posthog.init(apiKey, {
		api_host: "/ingest",
		ui_host: "https://us.posthog.com",
		// Pageviews on history changes (client navigations), and scripts
		// injected into <head> so they don't cause hydration mismatches.
		defaults: "2026-01-30",
		// Anonymous visitors (guests, invite-link landings) don't create
		// person profiles until they sign in.
		person_profiles: "identified_only",
		session_recording: {
			maskAllInputs: true,
		},
	});
}
