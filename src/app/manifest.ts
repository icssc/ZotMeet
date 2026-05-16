import type { MetadataRoute } from "next";
import {
	ANY_ICON_SIZES,
	APP_DESCRIPTION,
	APP_NAME,
	BRAND_ACCENT_HEX,
	BRAND_BACKGROUND_HEX,
	MASKABLE_ICON_SIZES,
} from "@/lib/pwa-config.mjs";

/**
 * Web App Manifest for ZotMeet.
 *
 * This manifest is consumed both by browsers (for "Add to Home Screen") and
 * by PWA Builder when packaging the app for the iOS App Store. It satisfies
 * PWA Builder's required fields:
 *   - name (>= 2 chars)
 *   - short_name (>= 3 chars)
 *   - description
 *   - start_url
 *   - display: standalone
 *   - icons: at least one 512x512 with purpose "any" + a separate maskable
 *   - background_color, theme_color (HEX values)
 *
 * Next.js automatically serves this at `/manifest.webmanifest`.
 */
export default function manifest(): MetadataRoute.Manifest {
	const anyIcons = ANY_ICON_SIZES.map((size) => ({
		src: `/icons/icon-${size}.png`,
		sizes: `${size}x${size}`,
		type: "image/png",
		purpose: "any" as const,
	}));

	const maskableIcons = MASKABLE_ICON_SIZES.map((size) => ({
		src: `/icons/maskable-${size}.png`,
		sizes: `${size}x${size}`,
		type: "image/png",
		purpose: "maskable" as const,
	}));

	const shortcutIcon = [
		{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
	];

	const shortcuts: MetadataRoute.Manifest["shortcuts"] = [
		{
			name: "Create a meeting",
			short_name: "New meeting",
			description: "Start scheduling a new meeting",
			url: "/",
			icons: shortcutIcon,
		},
		{
			name: "My groups",
			short_name: "Groups",
			description: "View groups you belong to",
			url: "/groups",
			icons: shortcutIcon,
		},
		{
			name: "Study rooms",
			short_name: "Rooms",
			description: "Browse available study rooms",
			url: "/studyrooms",
			icons: shortcutIcon,
		},
	];

	return {
		id: "/",
		name: APP_NAME,
		short_name: APP_NAME,
		description: APP_DESCRIPTION,
		start_url: "/",
		scope: "/",
		display: "standalone",
		display_override: ["standalone", "minimal-ui", "browser"],
		orientation: "portrait",
		lang: "en-US",
		dir: "ltr",
		background_color: BRAND_BACKGROUND_HEX,
		theme_color: BRAND_ACCENT_HEX,
		categories: ["productivity", "social", "education", "utilities"],
		icons: [...anyIcons, ...maskableIcons],
		shortcuts,
	};
}
