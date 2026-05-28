import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { nativePushTokens } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { isApnsDeviceToken, isSnsEndpointArn } from "@/lib/push/sns-config";
import {
	deleteIosPushEndpoint,
	registerIosPushEndpoint,
} from "@/lib/push/sns-register";

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

function getValidApnsToken(payload: PushTokenPayload) {
	if (typeof payload.token !== "string") return null;

	const token = payload.token.trim();
	if (!token || token === "ERROR GET TOKEN") return null;
	if (!isApnsDeviceToken(token)) return null;

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

	const apnsToken = getValidApnsToken(payload);
	if (!apnsToken) {
		return NextResponse.json(
			{ error: "Invalid APNs device token" },
			{ status: 400 },
		);
	}

	if (payload.platform !== "ios") {
		return NextResponse.json(
			{ error: "Only native iOS push tokens are supported" },
			{ status: 400 },
		);
	}

	const endpointArn = await registerIosPushEndpoint(apnsToken, user.id);
	if (!endpointArn) {
		return NextResponse.json(
			{ error: "Push registration is not configured" },
			{ status: 503 },
		);
	}

	const platform = "ios";

	await db
		.insert(nativePushTokens)
		.values({
			userId: user.id,
			token: endpointArn,
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

	const token = typeof payload.token === "string" ? payload.token.trim() : "";
	if (!token) {
		return NextResponse.json({ error: "Invalid token" }, { status: 400 });
	}

	if (isSnsEndpointArn(token)) {
		await deleteIosPushEndpoint(token);
	}

	await db
		.delete(nativePushTokens)
		.where(
			and(
				eq(nativePushTokens.userId, user.id),
				eq(nativePushTokens.token, token),
			),
		);

	return NextResponse.json({ success: true });
}
