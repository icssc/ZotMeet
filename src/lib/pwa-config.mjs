/**
 * Single source of truth for ZotMeet's PWA / SEO configuration.
 *
 * Consumed by:
 *   - `src/app/layout.tsx`   (metadata + viewport)
 *   - `src/app/manifest.ts`  (web app manifest)
 *   - `src/app/robots.ts`    (robots.txt)
 *   - `src/app/sitemap.ts`   (sitemap.xml)
 *   - `scripts/generate-pwa-assets.mjs` (icon generation)
 *
 * Authored as `.mjs` so the build script can import it directly without a
 * TypeScript runner, while TS files still get types via JSDoc + `allowJs`.
 */

export const APP_NAME = "ZotMeet";

export const APP_DESCRIPTION =
	"Schedule Meetings, Book UCI Rooms, and Time Sync with ZotMeet";

/**
 * Canonical public origin for metadata, sitemap, and store manifests.
 * Prefer `NEXT_PUBLIC_BASE_URL` (set per-stage in `sst.config.ts`); fall back to
 * `NEXT_PUBLIC_APP_URL` for local overrides; then localhost for dev.
 */
function resolveAppUrl() {
	const raw =
		process.env.NEXT_PUBLIC_BASE_URL?.trim() ||
		process.env.NEXT_PUBLIC_APP_URL?.trim() ||
		"http://localhost:3000";
	return raw.replace(/\/$/, "");
}

export const APP_URL = resolveAppUrl();

/**
 * iOS bundle ID for the App Store wrapper generated via PWA Builder.
 * Set after packaging (or when you know the final ID) so PWABuilder can
 * validate `related_applications`.
 */
export const IOS_BUNDLE_ID =
	process.env.NEXT_PUBLIC_IOS_BUNDLE_ID ?? "com.zotmeet.app";

/**
 * IARC certification code from https://www.globalratings.com/ (free via
 * participating storefronts). Required for the PWABuilder IARC action item.
 */
export const IARC_RATING_ID = process.env.PWA_IARC_RATING_ID ?? "";

/**
 * Origins the installed PWA may navigate to beyond `scope` (e.g. OAuth).
 * Clears the PWABuilder `scope_extensions` action item when non-empty.
 */
export const PWA_SCOPE_EXTENSION_ORIGINS = /** @type {const} */ ([
	"https://auth.icssc.club",
]);

/**
 * How the OS should open subsequent launches of the installed PWA.
 * `navigate-existing` reuses the open window instead of spawning duplicates.
 */
export const PWA_LAUNCH_HANDLER = /** @type {const} */ ({
	client_mode: "navigate-existing",
});

/** Resolve a site-root path to an absolute HTTPS URL for store manifests. */
export function absolutePwaUrl(pathname) {
	const base = APP_URL.replace(/\/$/, "");
	const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
	return `${base}${path}`;
}

export const BRAND_BACKGROUND_HEX = "#FFFFFF";
export const BRAND_ACCENT_HEX = "#F26489";
export const BRAND_DARK_BG_HEX = "#0F172A";

/** Sizes (px) rendered with `purpose: "any"`. */
export const ANY_ICON_SIZES = /** @type {const} */ ([
	72, 96, 128, 144, 152, 192, 256, 384, 512, 1024,
]);

/** Sizes (px) rendered with `purpose: "maskable"` (20% safe-zone padding). */
export const MASKABLE_ICON_SIZES = /** @type {const} */ ([192, 512]);

/** Sizes (px) emitted as transparent favicons. */
export const FAVICON_SIZES = /** @type {const} */ ([16, 32, 48]);

/** Apple touch icon edge length (px). Must be opaque. */
export const APPLE_TOUCH_SIZE = 180;

/**
 * Manifest `screenshots` entries (files under `public/screenshots/`).
 * `sizes` must match the actual PNG dimensions (verify with `pnpm pwa:icons`).
 */
export const PWA_SCREENSHOTS = /** @type {const} */ ([
	{
		file: "mobile_meeting.png",
		sizes: "372x805",
		form_factor: "narrow",
		label: "Create and schedule meetings",
	},
	{
		file: "mobile_groups.png",
		sizes: "372x805",
		form_factor: "narrow",
		label: "Manage your groups",
	},
	{
		file: "mobile_rooms.png",
		sizes: "385x835",
		form_factor: "narrow",
		label: "Browse study rooms",
	},
	{
		file: "wide.png",
		sizes: "1280x720",
		form_factor: "wide",
		label: "ZotMeet on desktop",
	},
]);
