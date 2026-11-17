import { NextResponse } from "next/server";

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
						comment:
							"ZotMeet iOS Google OAuth callback (ASWebAuthenticationSession)",
					},
					{
						"/": "/auth/login/apple/callback/native",
						comment:
							"ZotMeet iOS Apple OAuth callback (ASWebAuthenticationSession)",
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
