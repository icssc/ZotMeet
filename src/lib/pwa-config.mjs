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
	"ZotMeet is a simple, clean, and efficient meeting scheduling app for UCI students and groups.";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zotmeet.com";

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
