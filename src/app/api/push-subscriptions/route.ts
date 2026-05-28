import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { pushSubscriptions } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";

type PushSubscriptionPayload = {
	endpoint?: unknown;
	keys?: {
		p256dh?: unknown;
		auth?: unknown;
	};
};

function isValidSubscriptionPayload(
	payload: PushSubscriptionPayload,
): payload is {
	endpoint: string;
	keys: { p256dh: string; auth: string };
} {
	return (
		typeof payload.endpoint === "string" &&
		typeof payload.keys?.p256dh === "string" &&
		typeof payload.keys.auth === "string"
	);
}

export async function POST(request: Request) {
	const { user } = await getCurrentSession();
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const payload = (await request.json()) as PushSubscriptionPayload;
	if (!isValidSubscriptionPayload(payload)) {
		return NextResponse.json(
			{ error: "Invalid push subscription" },
			{ status: 400 },
		);
	}

	await db
		.insert(pushSubscriptions)
		.values({
			userId: user.id,
			endpoint: payload.endpoint,
			p256dh: payload.keys.p256dh,
			auth: payload.keys.auth,
			userAgent: request.headers.get("user-agent"),
		})
		.onConflictDoUpdate({
			target: pushSubscriptions.endpoint,
			set: {
				userId: user.id,
				p256dh: payload.keys.p256dh,
				auth: payload.keys.auth,
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

	const payload = (await request.json()) as { endpoint?: unknown };
	if (typeof payload.endpoint !== "string") {
		return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
	}

	await db
		.delete(pushSubscriptions)
		.where(
			and(
				eq(pushSubscriptions.endpoint, payload.endpoint),
				eq(pushSubscriptions.userId, user.id),
			),
		);

	return NextResponse.json({ success: true });
}
