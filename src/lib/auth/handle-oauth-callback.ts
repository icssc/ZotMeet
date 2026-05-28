import type { OAuth2Tokens } from "arctic";
import { decodeIdToken } from "arctic";
import { and, eq } from "drizzle-orm";
import type { cookies } from "next/headers";
import { db } from "@/db";
import { members, oauthAccounts } from "@/db/schema";
import { setSessionTokenCookie } from "@/lib/auth/cookies";
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
	const oauthRedirectUri =
		cookieStore.get("oauth_redirect_uri")?.value ??
		getOAuthCallbackRedirectUri(
			process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
			provider,
		);
	console.log("[oauth-callback]", {
		provider,
		redirectUrl,
		hasState: storedState !== null,
		hasCodeVerifier: codeVerifier !== null,
		oauthRedirectUri,
	});

	cookieStore.delete("auth_redirect_url");
	cookieStore.delete("oauth_state");
	cookieStore.delete("oauth_code_verifier");
	cookieStore.delete("oauth_redirect_uri");

	if (
		code === null ||
		state === null ||
		storedState === null ||
		codeVerifier === null
	) {
		return new Response(null, { status: 400 });
	}
	if (state !== storedState) {
		return new Response(null, { status: 400 });
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await getOAuthClient(oauthRedirectUri).validateAuthorizationCode(
			"https://auth.icssc.club/token",
			code,
			codeVerifier,
		);
	} catch (e) {
		console.log("invalid credentials", e);
		return new Response(null, { status: 400 });
	}

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
