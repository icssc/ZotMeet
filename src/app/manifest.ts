import type { MetadataRoute } from "next";
import {
	ANY_ICON_SIZES,
	APP_DESCRIPTION,
	APP_NAME,
	absolutePwaUrl,
	BRAND_ACCENT_HEX,
	BRAND_BACKGROUND_HEX,
	IARC_RATING_ID,
	IOS_BUNDLE_ID,
	MASKABLE_ICON_SIZES,
	PWA_LAUNCH_HANDLER,
	PWA_SCOPE_EXTENSION_ORIGINS,
	PWA_SCREENSHOTS,
} from "@/lib/pwa-config.mjs";

/**
 * Web App Manifest for ZotMeet.
 *
 * This manifest is consumed both by browsers (for "Add to Home Screen") and
 * by PWA Builder when packaging the app for the iOS App Store.
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

	// Relative URLs resolve against the manifest origin so PWABuilder and stores
	// work when the site is tested at any canonical host (www vs apex, staging, etc.).
	const screenshots: MetadataRoute.Manifest["screenshots"] =
		PWA_SCREENSHOTS.map((shot) => ({
			src: `/screenshots/${shot.file}`,
			sizes: shot.sizes,
			type: "image/png",
			form_factor: shot.form_factor,
			label: shot.label,
		}));

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
		prefer_related_applications: false,
		related_applications: [
			{
				platform: "itunes",
				id: IOS_BUNDLE_ID,
				url: absolutePwaUrl("/"),
			},
		],
		...(IARC_RATING_ID ? { iarc_rating_id: IARC_RATING_ID } : {}),
		...(PWA_SCOPE_EXTENSION_ORIGINS.length > 0
			? {
					scope_extensions: PWA_SCOPE_EXTENSION_ORIGINS.map((origin) => ({
						origin,
					})),
				}
			: {}),
		launch_handler: PWA_LAUNCH_HANDLER,
		icons: [...anyIcons, ...maskableIcons],
		screenshots,
		shortcuts,
	} as MetadataRoute.Manifest;
}
