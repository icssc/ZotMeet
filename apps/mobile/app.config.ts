import type { ExpoConfig } from "expo/config";

/**
 * Brand constants are mirrored from the web app's single source of truth,
 * `src/lib/pwa-config.mjs` (BRAND_ACCENT_HEX / BRAND_BACKGROUND_HEX /
 * BRAND_DARK_BG_HEX). They are duplicated rather than imported because this
 * package has no dependency on the Next.js app yet.
 */
const BRAND_ACCENT_HEX = "#F26489";
const BRAND_BACKGROUND_HEX = "#FFFFFF";
const BRAND_DARK_BG_HEX = "#0F172A";

const config: ExpoConfig = {
	name: "ZotMeet",
	slug: "zotmeet",
	version: "0.1.0",
	orientation: "portrait",
	icon: "./assets/images/icon.png",
	scheme: "zotmeet",
	userInterfaceStyle: "automatic",
	backgroundColor: BRAND_BACKGROUND_HEX,
	ios: {
		// Matches the existing PWABuilder iOS app registered under Apple Team ID
		// 66682RDDDK — see `src/app/apple-app-site-association/route.ts`, which
		// declares appID `66682RDDDK.com.zotmeet`.
		bundleIdentifier: "com.zotmeet",
		supportsTablet: true,
	},
	android: {
		// TODO(mobile): no Android app exists yet. Pick and register a real
		// package name before any Play Store work — this placeholder is NOT a
		// decision.
		package: "com.zotmeet.app",
		adaptiveIcon: {
			foregroundImage: "./assets/images/adaptive-icon.png",
			backgroundColor: BRAND_BACKGROUND_HEX,
		},
	},
	web: {
		bundler: "metro",
		output: "static",
		favicon: "./assets/images/favicon.png",
	},
	plugins: [
		"expo-router",
		[
			"expo-splash-screen",
			{
				image: "./assets/images/splash-icon.png",
				imageWidth: 160,
				resizeMode: "contain",
				backgroundColor: BRAND_BACKGROUND_HEX,
				dark: {
					backgroundColor: BRAND_DARK_BG_HEX,
				},
			},
		],
	],
	experiments: {
		typedRoutes: true,
	},
	extra: {
		brand: {
			accent: BRAND_ACCENT_HEX,
			background: BRAND_BACKGROUND_HEX,
			darkBackground: BRAND_DARK_BG_HEX,
		},
	},
};

export default config;
