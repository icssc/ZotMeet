import "server-only";

import { webcrypto } from "node:crypto";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { pushSubscriptions } from "@/db/schema";

type StoredPushSubscription = typeof pushSubscriptions.$inferSelect;

const WEB_PUSH_PUBLIC_KEY = process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY;
const WEB_PUSH_PRIVATE_KEY = process.env.WEB_PUSH_PRIVATE_KEY;
const WEB_PUSH_SUBJECT =
	process.env.WEB_PUSH_SUBJECT ?? "mailto:support@zotmeet.com";

let warnedMissingConfig = false;

function base64UrlToBuffer(value: string) {
	const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
	const padding = "=".repeat((4 - (base64.length % 4)) % 4);
	return Buffer.from(base64 + padding, "base64");
}

function bufferToBase64Url(value: Buffer | ArrayBuffer) {
	const buffer = value instanceof ArrayBuffer ? Buffer.from(value) : value;
	return buffer
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/g, "");
}

async function createVapidAuthorization(endpoint: string) {
	if (!WEB_PUSH_PUBLIC_KEY || !WEB_PUSH_PRIVATE_KEY) {
		if (!warnedMissingConfig) {
			console.warn(
				"Web Push notifications are disabled: missing VAPID key configuration.",
			);
			warnedMissingConfig = true;
		}
		return null;
	}

	const publicKey = base64UrlToBuffer(WEB_PUSH_PUBLIC_KEY);
	const privateKey = base64UrlToBuffer(WEB_PUSH_PRIVATE_KEY);

	if (publicKey.length !== 65 || privateKey.length !== 32) {
		console.warn("Web Push notifications are disabled: invalid VAPID keys.");
		return null;
	}

	const aud = new URL(endpoint).origin;
	const exp = Math.floor(Date.now() / 1000) + 12 * 60 * 60;
	const tokenHeader = bufferToBase64Url(
		Buffer.from(JSON.stringify({ typ: "JWT", alg: "ES256" })),
	);
	const tokenBody = bufferToBase64Url(
		Buffer.from(JSON.stringify({ aud, exp, sub: WEB_PUSH_SUBJECT })),
	);
	const tokenInput = `${tokenHeader}.${tokenBody}`;

	const key = await webcrypto.subtle.importKey(
		"jwk",
		{
			kty: "EC",
			crv: "P-256",
			x: bufferToBase64Url(publicKey.subarray(1, 33)),
			y: bufferToBase64Url(publicKey.subarray(33, 65)),
			d: bufferToBase64Url(privateKey),
			ext: false,
		},
		{ name: "ECDSA", namedCurve: "P-256" },
		false,
		["sign"],
	);

	const signature = await webcrypto.subtle.sign(
		{ name: "ECDSA", hash: "SHA-256" },
		key,
		Buffer.from(tokenInput),
	);
	const jwt = `${tokenInput}.${bufferToBase64Url(signature)}`;

	return `vapid t=${jwt}, k=${WEB_PUSH_PUBLIC_KEY}`;
}

async function sendWebPush(subscription: StoredPushSubscription) {
	const authorization = await createVapidAuthorization(subscription.endpoint);
	if (!authorization) return;

	const response = await fetch(subscription.endpoint, {
		method: "POST",
		headers: {
			Authorization: authorization,
			TTL: "2419200",
			Urgency: "normal",
		},
	});

	if (response.status === 404 || response.status === 410) {
		await db
			.delete(pushSubscriptions)
			.where(inArray(pushSubscriptions.endpoint, [subscription.endpoint]));
		return;
	}

	if (!response.ok) {
		console.error(
			"Failed to send Web Push notification:",
			response.status,
			await response.text(),
		);
	}
}

export async function sendWebPushToUsers(userIds: string[]) {
	if (userIds.length === 0) return;

	const subscriptions = await db
		.select()
		.from(pushSubscriptions)
		.where(inArray(pushSubscriptions.userId, userIds));

	await Promise.allSettled(
		subscriptions.map((subscription) => sendWebPush(subscription)),
	);
}
