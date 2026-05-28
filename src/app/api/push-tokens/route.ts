import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { nativePushTokens } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";

type PushTokenPayload = {
	token?: unknown;
	platform?: unknown;
};

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

	const payload = (await request.json()) as PushTokenPayload;
	const token = getValidToken(payload);
	if (!token) {
		return NextResponse.json({ error: "Invalid push token" }, { status: 400 });
	}

	const platform = payload.platform === "ios" ? "ios" : "unknown";

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

	const payload = (await request.json()) as PushTokenPayload;
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
