import type { MetadataRoute } from "next";

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
	return {
		id: "/",
		name: "ZotMeet",
		short_name: "ZotMeet",
		description:
			"ZotMeet is a simple, clean, and efficient meeting scheduling app for UCI students and groups.",
		start_url: "/",
		scope: "/",
		display: "standalone",
		display_override: ["standalone", "minimal-ui", "browser"],
		orientation: "portrait",
		lang: "en-US",
		dir: "ltr",
		background_color: "#FFFFFF",
		theme_color: "#F26489",
		categories: ["productivity", "social", "education", "utilities"],
		icons: [
			{
				src: "/icons/icon-72.png",
				sizes: "72x72",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icons/icon-96.png",
				sizes: "96x96",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icons/icon-128.png",
				sizes: "128x128",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icons/icon-144.png",
				sizes: "144x144",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icons/icon-152.png",
				sizes: "152x152",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icons/icon-192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icons/icon-256.png",
				sizes: "256x256",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icons/icon-384.png",
				sizes: "384x384",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icons/icon-512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icons/icon-1024.png",
				sizes: "1024x1024",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icons/maskable-192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "/icons/maskable-512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
		],
		shortcuts: [
			{
				name: "Create a meeting",
				short_name: "New meeting",
				description: "Start scheduling a new meeting",
				url: "/?source=pwa-shortcut",
				icons: [
					{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
				],
			},
			{
				name: "My groups",
				short_name: "Groups",
				description: "View groups you belong to",
				url: "/groups?source=pwa-shortcut",
				icons: [
					{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
				],
			},
			{
				name: "Study rooms",
				short_name: "Rooms",
				description: "Browse available study rooms",
				url: "/studyrooms?source=pwa-shortcut",
				icons: [
					{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
				],
			},
		],
	};
}
