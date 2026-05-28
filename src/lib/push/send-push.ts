import "server-only";

import { inArray } from "drizzle-orm";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { db } from "@/db";
import { nativePushTokens } from "@/db/schema";
import { sendWebPushToUsers } from "@/lib/push/web-push";

type PushPayload = {
	title: string;
	message: string;
	type: string;
	redirect: string;
	groupId?: string | null;
	createdBy?: string | null;
};

const FIREBASE_SERVICE_ACCOUNT_JSON = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
const FIREBASE_SERVICE_ACCOUNT_BASE64 =
	process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

let warnedMissingConfig = false;

function parseServiceAccount(): {
	projectId: string;
	clientEmail: string;
	privateKey: string;
} | null {
	let raw = FIREBASE_SERVICE_ACCOUNT_JSON?.trim();

	if (!raw && FIREBASE_SERVICE_ACCOUNT_BASE64) {
		raw = Buffer.from(FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString(
			"utf8",
		);
	}

	if (!raw) return null;

	try {
		const parsed = JSON.parse(raw) as {
			project_id?: string;
			client_email?: string;
			private_key?: string;
		};

		if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
			return null;
		}

		return {
			projectId: parsed.project_id,
			clientEmail: parsed.client_email,
			privateKey: parsed.private_key,
		};
	} catch {
		return null;
	}
}

function getOrInitFirebaseMessaging() {
	if (getApps().length > 0) {
		return getMessaging();
	}

	const serviceAccount = parseServiceAccount();
	if (!serviceAccount) {
		if (!warnedMissingConfig) {
			console.warn(
				"Push notifications are disabled: missing Firebase service account configuration.",
			);
			warnedMissingConfig = true;
		}
		return null;
	}

	const app = initializeApp({
		credential: cert(serviceAccount),
	});
	return getMessaging(app);
}

function chunkArray<T>(items: T[], size: number) {
	const chunks: T[][] = [];
	for (let index = 0; index < items.length; index += size) {
		chunks.push(items.slice(index, index + size));
	}
	return chunks;
}

function isStaleTokenError(code: string | undefined) {
	return (
		code === "messaging/invalid-registration-token" ||
		code === "messaging/registration-token-not-registered"
	);
}

export async function sendPushToUsers(userIds: string[], payload: PushPayload) {
	if (userIds.length === 0) return;

	await sendWebPushToUsers(userIds);

	const messaging = getOrInitFirebaseMessaging();
	if (!messaging) return;

	const tokenRows = await db
		.select({ token: nativePushTokens.token })
		.from(nativePushTokens)
		.where(inArray(nativePushTokens.userId, userIds));

	const tokens = [...new Set(tokenRows.map((row) => row.token))];
	if (tokens.length === 0) return;

	const staleTokens = new Set<string>();

	for (const tokenChunk of chunkArray(tokens, 500)) {
		try {
			const response = await messaging.sendEachForMulticast({
				tokens: tokenChunk,
				notification: {
					title: payload.title,
					body: payload.message,
				},
				data: {
					type: payload.type,
					redirect: payload.redirect,
					title: payload.title,
					message: payload.message,
					groupId: payload.groupId ?? "",
					createdBy: payload.createdBy ?? "",
				},
				apns: {
					payload: {
						aps: {
							sound: "default",
						},
					},
				},
			});

			response.responses.forEach((sendResponse, index) => {
				if (sendResponse.success) return;

				const errorCode = sendResponse.error?.code;
				if (isStaleTokenError(errorCode)) {
					staleTokens.add(tokenChunk[index]);
					return;
				}

				console.error("Failed to send push notification:", sendResponse.error);
			});
		} catch (error) {
			console.error("Failed to send push notification batch:", error);
		}
	}

	if (staleTokens.size > 0) {
		await db
			.delete(nativePushTokens)
			.where(inArray(nativePushTokens.token, [...staleTokens]));
	}
}
