import posthog from "posthog-js";

/**
 * Browser-side PostHog: pageviews (App Router navigations included) and
 * autocapture. Next runs this file before the app hydrates. Without
 * `NEXT_PUBLIC_POSTHOG_KEY` (local dev, by default) nothing loads. Users are
 * identified by member id in `components/analytics/posthog-identify.tsx`.
 */
const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (apiKey) {
	posthog.init(apiKey, {
		api_host: "https://us.i.posthog.com",
		// Pageviews on history changes (client navigations), and scripts
		// injected into <head> so they don't cause hydration mismatches.
		defaults: "2026-01-30",
		// Anonymous visitors (guests, invite-link landings) don't create
		// person profiles until they sign in.
		person_profiles: "identified_only",
		// Off until replay masks page text too: recordings would otherwise
		// show meeting titles and member names.
		disable_session_recording: true,
	});
}
