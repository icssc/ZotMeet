import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { nativePushTokens } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";

type PushTokenPayload = {
	token?: unknown;
	platform?: unknown;
};

async function readPayload(request: Request) {
	try {
		return (await request.json()) as PushTokenPayload;
	} catch {
		return null;
	}
}

function getValidToken(payload: PushTokenPayload) {
	if (typeof payload.token !== "string") return null;

	const token = payload.token.trim();
	if (!token || token === "ERROR GET TOKEN") return null;

	return token;
}

export async function POST(request: Request) {
	const { user } = await getCurrentSession();
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const payload = await readPayload(request);
	if (!payload) {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}

	const token = getValidToken(payload);
	if (!token) {
		return NextResponse.json({ error: "Invalid push token" }, { status: 400 });
	}

	if (payload.platform !== "ios") {
		return NextResponse.json(
			{ error: "Only native iOS push tokens are supported" },
			{ status: 400 },
		);
	}

	// Registration requires a signed-in user. The `app-platform` cookie is set by
	// the WKWebView for client UX only and must not be used as an auth gate
	// (it is unsigned and trivially spoofed). Invalid or non-iOS FCM tokens are
	// rejected by Firebase on send and pruned in sendPushToUsers.

	const platform = "ios";

	await db
		.insert(nativePushTokens)
		.values({
			userId: user.id,
			token,
			platform,
			userAgent: request.headers.get("user-agent"),
		})
		.onConflictDoUpdate({
			target: nativePushTokens.token,
			set: {
				userId: user.id,
				platform,
				userAgent: request.headers.get("user-agent"),
				updatedAt: new Date(),
			},
		});

	return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
	const { user } = await getCurrentSession();
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const payload = await readPayload(request);
	if (!payload) {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}

	const token = getValidToken(payload);
	if (!token) {
		return NextResponse.json({ error: "Invalid push token" }, { status: 400 });
	}

	await db
		.delete(nativePushTokens)
		.where(
			and(
				eq(nativePushTokens.token, token),
				eq(nativePushTokens.userId, user.id),
			),
		);

	return NextResponse.json({ success: true });
}
