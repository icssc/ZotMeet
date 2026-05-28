import "server-only";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

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

function topicForUser(userId: string) {
	return `user_${userId}`;
}

export async function sendPushToUsers(userIds: string[], payload: PushPayload) {
	if (userIds.length === 0) return;

	const messaging = getOrInitFirebaseMessaging();
	if (!messaging) return;

	const sendResults = await Promise.allSettled(
		userIds.map((userId) =>
			messaging.send({
				topic: topicForUser(userId),
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
			}),
		),
	);

	for (const result of sendResults) {
		if (result.status === "rejected") {
			console.error("Failed to send push notification:", result.reason);
		}
	}
}
