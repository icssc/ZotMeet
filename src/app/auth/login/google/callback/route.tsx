import { cookies } from "next/headers";
import { setSessionTokenCookie } from "@/lib/auth/cookies";
import { google } from "@/lib/auth/oauth";
import { createSession, generateSessionToken } from "@/lib/auth/session";
import { createGoogleUser } from "@/lib/auth/user";
import { convertTimeToUTC } from "@/lib/availability/utils";
import { createMeetingFromData } from "@/server/actions/meeting/create/action";
import { getUserById, getUserIdExists } from "@/server/data/user/queries";
import { decodeIdToken } from "arctic";
import type { OAuth2Tokens } from "arctic";

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const cookieStore = await cookies();
    const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
    const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;
    const redirectUrl = cookieStore.get("auth_redirect_url")?.value ?? "/";

    cookieStore.delete("auth_redirect_url");

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
        tokens = await google.validateAuthorizationCode(code, codeVerifier);
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
    const accessToken = tokens.accessToken();
    const refreshToken = tokens.refreshToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    const googleUserId = claims.sub;
    const username = claims.name;
    const email = claims.email;

    const existingUser = await getUserIdExists(googleUserId);

    let userId: string;
    let memberId: string;

    if (existingUser !== false) {
        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, googleUserId, {
            googleAccessToken: accessToken,
            googleRefreshToken: refreshToken,
            googleAccessTokenExpiresAt: expiresAt,
        });
        await setSessionTokenCookie(sessionToken, session.expiresAt);
        userId = googleUserId;
        const userRecord = await getUserById(googleUserId);

        if (!userRecord) {
            return new Response(null, { status: 500 });
        }
        memberId = userRecord.memberId;
    } else {
        const user = await createGoogleUser(
            googleUserId,
            email,
            username,
            null
        );

        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, user.id, {
            googleAccessToken: accessToken,
            googleRefreshToken: refreshToken,
            googleAccessTokenExpiresAt: expiresAt,
        });
        await setSessionTokenCookie(sessionToken, session.expiresAt);
        userId = user.id;
        memberId = user.memberId;
    }

    // Parse the redirect URL for meeting data
    let parsedUrl: URL;
    try {
        // If redirectUrl is a relative path, construct full URL
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
    const selectedDates = selectedDatesParam
        ? selectedDatesParam.split(",")
        : [];
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
            const fromTimeUTC = convertTimeToUTC(
                startTime,
                timezone,
                referenceDate
            );
            const toTimeUTC = convertTimeToUTC(
                endTime,
                timezone,
                referenceDate
            );

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
                    result.error
                );
            }
        } catch (error) {
            console.error("Auth callback - Error creating meeting:", error);
            // Fall through to redirect to original URL
        }
    } else {
        console.log(
            "Auth callback - No valid meeting data found, redirecting to:",
            redirectUrl
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
