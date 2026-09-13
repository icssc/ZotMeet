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

/**
 * EAS project ID, supplied by the environment rather than committed, so the
 * repo stays portable across Expo accounts. Absent it, the EAS-specific keys
 * below are omitted entirely instead of being emitted with an empty ID: a
 * malformed `updates.url` would make the app fetch updates from a URL that
 * 404s at runtime, which is far harder to diagnose than a missing key.
 * `expo start` does not need it; only `eas update` does.
 */
const easProjectId = process.env.EAS_PROJECT_ID;

const config: ExpoConfig = {
	name: "ZotMeet",
	slug: "zotmeet",
	// The Expo account holding the EAS project — an org, not the personal
	// account, so `eas update` resolves the right project for every member.
	owner: "ethanchaos-team",
	version: "0.1.0",
	orientation: "portrait",
	icon: "./assets/images/icon.png",
	scheme: "zotmeet",
	userInterfaceStyle: "automatic",
	// An update is only served to a client whose runtime matches. The
	// `sdkVersion` policy keys that on the Expo SDK alone, which is what lets
	// a plain Expo Go install open these preview updates — `appVersion` would
	// restrict them to purpose-built dev/production clients.
	runtimeVersion: { policy: "sdkVersion" },
	...(easProjectId
		? { updates: { url: `https://u.expo.dev/${easProjectId}` } }
		: {}),
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
		"@react-native-community/datetimepicker",
		// Sign-in: the in-app browser and the keychain the session token lives
		// in. Both work in Expo Go without these; they matter for `prebuild`.
		"expo-web-browser",
		"expo-secure-store",
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
		...(easProjectId ? { eas: { projectId: easProjectId } } : {}),
	},
};

export default config;
