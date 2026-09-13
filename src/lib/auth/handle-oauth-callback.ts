import { NATIVE_OAUTH_CALLBACK_PARAMS } from "@zotmeet/shared";
import type { OAuth2Tokens } from "arctic";
import { decodeIdToken } from "arctic";
import { eq } from "drizzle-orm";
import type { cookies } from "next/headers";
import { db } from "@/db";
import { type InsertSession, members, oauthAccounts } from "@/db/schema";
import { setSessionTokenCookie } from "@/lib/auth/cookies";
import { decodeNativeState } from "@/lib/auth/native-state";
import { getOAuthClient } from "@/lib/auth/oauth";
import {
	getOAuthCallbackRedirectUri,
	OAUTH_LOGIN_CONFIG,
	type OAuthAccountProviderId,
	type OAuthLoginProvider,
} from "@/lib/auth/providers";
import { createSession, generateSessionToken } from "@/lib/auth/session";
import { createOAuthUser, generateUsername } from "@/lib/auth/user";
import {
	convertTimeToUTC,
	sortMeetingIsoDatesAsc,
} from "@/lib/availability/utils";
import { availabilityPathWithOpenInvite } from "@/lib/meeting-open-invite";
import { createMeetingFromData } from "@/server/actions/meeting/create/action";
import { getUserById } from "@/server/data/user/queries";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

type SessionTokenOptions = {
	oidcAccessToken: string;
	oidcRefreshToken: string | undefined;
	oauthAccessToken?: string;
	oauthRefreshToken?: string;
	oauthAccessTokenExpiresAt?: Date;
};

async function linkOAuthAccountIfMissing(
	userId: string,
	providerId: OAuthAccountProviderId,
	providerUserId: string,
): Promise<void> {
	const existingOAuthAccount = await db.query.oauthAccounts.findFirst({
		where: (oauthAccounts, { eq, and }) =>
			and(
				eq(oauthAccounts.userId, userId),
				eq(oauthAccounts.providerId, providerId),
			),
	});

	if (!existingOAuthAccount) {
		await db.insert(oauthAccounts).values({
			userId,
			providerId,
			providerUserId,
		});
	}
}

async function resolveAuthenticatedUser(
	provider: OAuthLoginProvider,
	oauthUserId: string,
	email: string,
	displayName: string,
	picture: string | null,
): Promise<{ userId: string; memberId: string }> {
	const providerId = OAUTH_LOGIN_CONFIG[provider].oauthAccountProviderId;

	const linkedAccount = await db.query.oauthAccounts.findFirst({
		where: (oauthAccounts, { eq, and }) =>
			and(
				eq(oauthAccounts.providerId, providerId),
				eq(oauthAccounts.providerUserId, oauthUserId),
			),
	});

	if (linkedAccount) {
		const userRecord = await getUserById(linkedAccount.userId);
		if (!userRecord) {
			throw new Error("Linked OAuth account references missing user");
		}
		return { userId: linkedAccount.userId, memberId: userRecord.memberId };
	}

	const existingUser = await db.query.users.findFirst({
		where: (users) => eq(users.email, email),
	});

	if (existingUser) {
		await linkOAuthAccountIfMissing(existingUser.id, providerId, oauthUserId);

		const member = await db.query.members.findFirst({
			where: eq(members.id, existingUser.memberId),
			columns: { googleName: true, username: true },
		});
		const backfill: {
			googleName?: string;
			username?: string;
			profilePicture?: string | null;
		} = {};
		if (provider === "google" && !member?.googleName) {
			backfill.googleName = displayName;
		}
		if (!member?.username) {
			backfill.username = await generateUsername(displayName);
		}
		if (picture !== null) {
			backfill.profilePicture = picture;
		}
		if (Object.keys(backfill).length > 0) {
			await db
				.update(members)
				.set(backfill)
				.where(eq(members.id, existingUser.memberId));
		}

		return { userId: existingUser.id, memberId: existingUser.memberId };
	}

	const user = await createOAuthUser(
		oauthUserId,
		email,
		displayName,
		picture,
		providerId,
	);
	return { userId: user.id, memberId: user.memberId };
}

function extractGoogleTokens(tokens: OAuth2Tokens): SessionTokenOptions {
	const oidcAccessToken = tokens.accessToken();
	const oidcRefreshToken = tokens.refreshToken();
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

	return {
		oidcAccessToken,
		oidcRefreshToken,
		oauthAccessToken: googleAccessToken,
		oauthRefreshToken: googleRefreshToken,
		oauthAccessTokenExpiresAt: googleTokenExpiry,
	};
}

function extractAppleTokens(tokens: OAuth2Tokens): SessionTokenOptions {
	return {
		oidcAccessToken: tokens.accessToken(),
		oidcRefreshToken: tokens.refreshToken(),
	};
}

async function maybeRedirectAfterMeetingCreation(
	request: Request,
	redirectUrl: string,
	memberId: string,
): Promise<Response | null> {
	let parsedUrl: URL;
	try {
		parsedUrl = redirectUrl.startsWith("http")
			? new URL(redirectUrl)
			: new URL(redirectUrl, request.url);
	} catch (e) {
		console.error("Failed to parse redirectUrl:", redirectUrl, e);
		return new Response(null, {
			status: 302,
			headers: { Location: redirectUrl },
		});
	}

	const searchParams = parsedUrl.searchParams;
	const meetingName = searchParams.get("meetingName");
	const startTime = searchParams.get("startTime");
	const endTime = searchParams.get("endTime");
	const selectedDatesParam = searchParams.get("selectedDates");
	const selectedDates = sortMeetingIsoDatesAsc(
		selectedDatesParam ? selectedDatesParam.split(",") : [],
	);
	const meetingType = searchParams.get("meetingType");
	const timezone = searchParams.get("timezone") || "America/Los_Angeles";
	const groupIdParam = searchParams.get("groupId");
	const group_id =
		groupIdParam && groupIdParam.length > 0 ? groupIdParam : undefined;

	if (
		!meetingName ||
		!startTime ||
		!endTime ||
		selectedDates.length === 0 ||
		!meetingType
	) {
		return null;
	}

	try {
		const referenceDate = selectedDates[0];
		const fromTimeUTC = convertTimeToUTC(startTime, timezone, referenceDate);
		const toTimeUTC = convertTimeToUTC(endTime, timezone, referenceDate);

		const result = await createMeetingFromData(
			{
				title: meetingName,
				fromTime: fromTimeUTC,
				toTime: toTimeUTC,
				timezone,
				dates: selectedDates,
				description: "",
				meetingType: meetingType as "dates" | "days",
				...(group_id ? { group_id } : {}),
			},
			memberId,
		);

		if ("id" in result) {
			return new Response(null, {
				status: 302,
				headers: {
					Location: availabilityPathWithOpenInvite(result.id),
				},
			});
		}

		console.error("Auth callback - Failed to create meeting:", result.error);
	} catch (error) {
		console.error("Auth callback - Error creating meeting:", error);
	}

	return null;
}

const TOKEN_ENDPOINT = "https://auth.icssc.club/token";

/**
 * Redeems an authorization code with ICSSC. `redirectUri` must be the one the
 * authorization request carried. Throws on an invalid or already-used code.
 */
export function exchangeOAuthCode(
	code: string,
	codeVerifier: string,
	redirectUri: string,
): Promise<OAuth2Tokens> {
	return getOAuthClient(redirectUri).validateAuthorizationCode(
		TOKEN_ENDPOINT,
		code,
		codeVerifier,
	);
}

export type EstablishedOAuthSession = {
	/** The raw token — the cookie value, or the bearer token for the app. */
	sessionToken: string;
	session: InsertSession;
	userId: string;
	memberId: string;
};

/**
 * The provider-independent half of a login, once ICSSC has handed back
 * tokens: find or create the user behind the id token and open a session for
 * them. Shared by the browser callback below, which stores the token in the
 * `session` cookie, and `POST /api/auth/login/<provider>`, which returns it
 * to the Expo app as JSON.
 */
export async function establishOAuthSession(
	provider: OAuthLoginProvider,
	tokens: OAuth2Tokens,
): Promise<EstablishedOAuthSession> {
	const claims = decodeIdToken(tokens.idToken()) as {
		sub: string;
		name?: string;
		email: string;
		picture?: string;
	};

	const oauthUserId = claims.sub;
	const displayName = claims.name ?? claims.email.split("@")[0] ?? "User";
	const email = claims.email;
	const picture = claims.picture ?? null;

	const sessionOptions =
		provider === "google"
			? extractGoogleTokens(tokens)
			: extractAppleTokens(tokens);

	const { userId, memberId } = await resolveAuthenticatedUser(
		provider,
		oauthUserId,
		email,
		displayName,
		picture,
	);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, userId, {
		oidcAccessToken: sessionOptions.oidcAccessToken,
		oidcRefreshToken: sessionOptions.oidcRefreshToken,
		oauthAccessToken: sessionOptions.oauthAccessToken,
		oauthRefreshToken: sessionOptions.oauthRefreshToken,
		oauthAccessTokenExpiresAt: sessionOptions.oauthAccessTokenExpiresAt,
	});

	return { sessionToken, session, userId, memberId };
}

/**
 * A login the Expo app started (see `startOAuthLogin`) ends here too, but the
 * code is not redeemed: the app holds the PKCE verifier, so it is bounced —
 * with the state the app chose, or ICSSC's error — to the app's callback
 * link, and the app redeems it at `POST /api/auth/login/<provider>`.
 */
function bounceToNativeApp(
	url: URL,
	native: { state: string; redirectUri: string },
): Response {
	const params = new URLSearchParams();
	const error = url.searchParams.get("error");
	const code = url.searchParams.get("code");
	if (error !== null) {
		params.set(NATIVE_OAUTH_CALLBACK_PARAMS.error, error);
	} else if (code === null) {
		params.set(NATIVE_OAUTH_CALLBACK_PARAMS.error, "invalid_response");
	} else {
		params.set(NATIVE_OAUTH_CALLBACK_PARAMS.code, code);
		params.set(NATIVE_OAUTH_CALLBACK_PARAMS.state, native.state);
	}

	return new Response(null, {
		status: 302,
		headers: { Location: `${native.redirectUri}?${params.toString()}` },
	});
}

/**
 * A failure page, not a bare status: an empty `400` shows up in the in-app
 * browser as a zero-byte "callback" download, which is not a useful clue.
 */
function callbackFailure(message: string): Response {
	return new Response(`Sign-in failed: ${message}`, {
		status: 400,
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
}

export async function handleOAuthCallback(
	request: Request,
	provider: OAuthLoginProvider,
	cookieStore: CookieStore,
): Promise<Response> {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");

	const storedState = cookieStore.get("oauth_state")?.value ?? null;
	const codeVerifier = cookieStore.get("oauth_code_verifier")?.value ?? null;
	const redirectUrl = cookieStore.get("auth_redirect_url")?.value ?? "/";
	// ICSSC returns the state verbatim; a native login's rides in it.
	const native = decodeNativeState(state, provider);
	const oauthRedirectUri =
		cookieStore.get("oauth_redirect_uri")?.value ??
		getOAuthCallbackRedirectUri(
			process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
			provider,
		);
	console.log("[oauth-callback]", {
		provider,
		redirectUrl,
		native: native !== null,
		hasState: storedState !== null,
		hasCodeVerifier: codeVerifier !== null,
		oauthRedirectUri,
	});

	cookieStore.delete("auth_redirect_url");
	cookieStore.delete("oauth_state");
	cookieStore.delete("oauth_code_verifier");
	cookieStore.delete("oauth_redirect_uri");

	if (native !== null) {
		return bounceToNativeApp(url, native);
	}

	if (
		code === null ||
		state === null ||
		storedState === null ||
		codeVerifier === null
	) {
		return callbackFailure("the sign-in response was incomplete");
	}
	if (state !== storedState) {
		return callbackFailure("the sign-in response did not match");
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await exchangeOAuthCode(code, codeVerifier, oauthRedirectUri);
	} catch (e) {
		console.log("invalid credentials", e);
		return callbackFailure("the authorization code was rejected");
	}

	const { sessionToken, session, memberId } = await establishOAuthSession(
		provider,
		tokens,
	);
	await setSessionTokenCookie(sessionToken, session.expiresAt);

	const meetingRedirect = await maybeRedirectAfterMeetingCreation(
		request,
		redirectUrl,
		memberId,
	);
	if (meetingRedirect) {
		return meetingRedirect;
	}

	return new Response(null, {
		status: 302,
		headers: { Location: redirectUrl },
	});
}
