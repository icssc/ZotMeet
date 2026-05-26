import { NextResponse } from "next/server";

/**
 * Apple App Site Association (AASA) file.
 *
 * Served at `https://zotmeet.com/.well-known/apple-app-site-association`
 * (via a rewrite in `next.config.mjs`). Apple's CDN fetches this to:
 *
 * 1. Authorize the ZotMeet iOS app to claim Universal Links for the
 *    `/auth/login/google/callback/native` path — the OAuth redirect URI that
 *    the iOS wrapper hands to `ASWebAuthenticationSession` as its HTTPS callback
 *    (see `ios/src/ZotMeet/ViewController.swift`).
 * 2. Authorize shared web credentials for passkey autofill.
 */

const TEAM_ID = "66682RDDDK";

const BUNDLE_IDS: readonly string[] = ["com.zotmeet"];

const appIDs = BUNDLE_IDS.map((bundleId) => `${TEAM_ID}.${bundleId}`);

const aasa = {
	applinks: {
		details: [
			{
				appIDs,
				components: [
					{
						"/": "/auth/login/google/callback/native",
						comment: "ZotMeet iOS OAuth callback (ASWebAuthenticationSession)",
					},
				],
			},
		],
	},
	webcredentials: {
		apps: appIDs,
	},
} as const;

export function GET() {
	if (TEAM_ID.length === 0 || appIDs.length === 0) {
		return new NextResponse("Not Found", { status: 404 });
	}

	return NextResponse.json(aasa, {
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
		},
	});
}
