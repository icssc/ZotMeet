import type { OAuth2Tokens } from "arctic";
import { decodeIdToken } from "arctic";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db";
import { oauthAccounts, users } from "@/db/schema";
import { setSessionTokenCookie } from "@/lib/auth/cookies";
import { oauth } from "@/lib/auth/oauth";
import { createSession, generateSessionToken } from "@/lib/auth/session";
import { createGoogleUser } from "@/lib/auth/user";
import { convertTimeToUTC } from "@/lib/availability/utils";
import { createMeetingFromData } from "@/server/actions/meeting/create/action";
import { getUserById } from "@/server/data/user/queries";

export async function GET(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");

	const cookieStore = await cookies();
	const storedState = cookieStore.get("oauth_state")?.value ?? null;
	const codeVerifier = cookieStore.get("oauth_code_verifier")?.value ?? null;
	const redirectUrl = cookieStore.get("auth_redirect_url")?.value ?? "/";

	if (
		code === null ||
		state === null ||
		storedState === null ||
		codeVerifier === null
	) {
		return new Response(null, {
			status: 400,
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400,
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await oauth.validateAuthorizationCode(
			"https://auth.icssc.club/token",
			code,
			codeVerifier,
		);
	} catch (e) {
		console.log("invalid credentials", e);
		// Invalid code or client credentials
		return new Response(null, {
			status: 400,
		});
	}
	const claims = decodeIdToken(tokens.idToken()) as {
		sub: string;
		name: string;
		email: string;
	};

	const oidcAccessToken = tokens.accessToken();
	const oidcRefreshToken = tokens.refreshToken();

	// Extract Google tokens from OIDC response
	const tokenData = tokens.data as {
		google_access_token?: string;
		google_refresh_token?: string;
		google_token_expiry?: number;
	};

	const googleAccessToken = tokenData.google_access_token;
	const googleRefreshToken = tokenData.google_refresh_token;
	const googleTokenExpiry = tokenData.google_token_expiry
		? new Date(tokenData.google_token_expiry)
		: new Date(Date.now() + 1000 * 60 * 60);

	if (!googleAccessToken || !googleRefreshToken) {
		console.error(
			"OAuth Callback - Missing Google tokens in OIDC response:",
			tokenData,
		);
	}

	if (!oidcRefreshToken) {
		console.error("OAuth Callback - Missing OIDC refresh token in response");
	}

	const oauthUserId = claims.sub;
	const username = claims.name;
	const email = claims.email;

	const existingUser = await db.query.users.findFirst({
		where: eq(users.email, email),
	});

	let memberId: string;

	if (existingUser) {
		const existingOAuthAccount = await db.query.oauthAccounts.findFirst({
			where: and(
				eq(oauthAccounts.userId, existingUser.id),
				eq(oauthAccounts.providerId, "oidc"),
			),
		});

		if (!existingOAuthAccount) {
			await db.insert(oauthAccounts).values({
				userId: existingUser.id,
				providerId: "oidc",
				providerUserId: oauthUserId,
			});
			console.log(
				`Migrated user ${existingUser.email} from legacy auth to OIDC provider`,
			);
		}

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id, {
			oidcAccessToken,
			oidcRefreshToken,
			oauthAccessToken: googleAccessToken,
			oauthRefreshToken: googleRefreshToken,
			oauthAccessTokenExpiresAt: googleTokenExpiry,
		});
		await setSessionTokenCookie(sessionToken, session.expiresAt);
		const userRecord = await getUserById(existingUser.id);

		if (!userRecord) {
			return new Response(null, { status: 500 });
		}
		memberId = userRecord.memberId;
	} else {
		const user = await createGoogleUser(oauthUserId, email, username, null);

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id, {
			oidcAccessToken,
			oidcRefreshToken,
			oauthAccessToken: googleAccessToken,
			oauthRefreshToken: googleRefreshToken,
			oauthAccessTokenExpiresAt: googleTokenExpiry,
		});
		await setSessionTokenCookie(sessionToken, session.expiresAt);

		memberId = user.memberId;
	}

	cookieStore.delete("oauth_state");
	cookieStore.delete("oauth_code_verifier");
	cookieStore.delete("auth_redirect_url");

	let parsedUrl: URL;
	try {
		parsedUrl = redirectUrl.startsWith("http")
			? new URL(redirectUrl)
			: new URL(redirectUrl, request.url);
	} catch (e) {
		console.error("Failed to parse redirectUrl:", redirectUrl, e);
		return new Response(null, {
			status: 302,
			headers: {
				Location: redirectUrl,
			},
		});
	}

	const searchParams = parsedUrl.searchParams;

	const meetingName = searchParams.get("meetingName");
	const startTime = searchParams.get("startTime");
	const endTime = searchParams.get("endTime");
	const selectedDatesParam = searchParams.get("selectedDates");
	const selectedDates = selectedDatesParam ? selectedDatesParam.split(",") : [];
	const meetingType = searchParams.get("meetingType");
	const timezone = searchParams.get("timezone") || "America/Los_Angeles";

	// If valid meeting data exists, create the meeting
	if (
		meetingName &&
		startTime &&
		endTime &&
		selectedDates.length > 0 &&
		meetingType
	) {
		try {
			// Convert times from local to UTC
			const referenceDate = selectedDates[0];
			const fromTimeUTC = convertTimeToUTC(startTime, timezone, referenceDate);
			const toTimeUTC = convertTimeToUTC(endTime, timezone, referenceDate);

			const meetingData = {
				title: meetingName,
				fromTime: fromTimeUTC,
				toTime: toTimeUTC,
				timezone,
				dates: selectedDates,
				description: "",
				meetingType: meetingType as "dates" | "days",
			};

			const result = await createMeetingFromData(meetingData, memberId);

			if ("id" in result) {
				return new Response(null, {
					status: 302,
					headers: {
						Location: `/availability/${result.id}`,
					},
				});
			} else {
				// Failed to create meeting, redirect to original URL
				console.error(
					"Auth callback - Failed to create meeting:",
					result.error,
				);
			}
		} catch (error) {
			console.error("Auth callback - Error creating meeting:", error);
			// Fall through to redirect to original URL
		}
	} else {
		console.log(
			"Auth callback - No valid meeting data found, redirecting to:",
			redirectUrl,
		);
	}

	// If no meeting data or creation failed, redirect to original URL
	return new Response(null, {
		status: 302,
		headers: {
			Location: redirectUrl,
		},
	});
}
