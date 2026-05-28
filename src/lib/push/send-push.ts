import "server-only";

import { PublishCommand } from "@aws-sdk/client-sns";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { nativePushTokens } from "@/db/schema";
import { normalizePushRedirect } from "@/lib/push/redirect";
import { getSnsClient } from "@/lib/push/sns-client";
import {
	getSnsIosApnsEnv,
	getSnsIosPlatformApplicationArn,
	isSnsEndpointArn,
} from "@/lib/push/sns-config";
import { deleteIosPushEndpoint } from "@/lib/push/sns-register";

type PushPayload = {
	title: string;
	message: string;
	type: string;
	redirect: string;
	groupId?: string | null;
	createdBy?: string | null;
};

function chunkArray<T>(items: T[], size: number) {
	const chunks: T[][] = [];
	for (let index = 0; index < items.length; index += size) {
		chunks.push(items.slice(index, index + size));
	}
	return chunks;
}

function buildSnsApnsMessage(payload: PushPayload, redirect: string): string {
	const apnsPayload = {
		aps: {
			alert: {
				title: payload.title,
				body: payload.message,
			},
			sound: "default",
		},
		type: payload.type,
		redirect,
		title: payload.title,
		message: payload.message,
		groupId: payload.groupId ?? "",
		createdBy: payload.createdBy ?? "",
	};

	const apns = JSON.stringify(apnsPayload);
	const apnsKey = getSnsIosApnsEnv() === "sandbox" ? "APNS_SANDBOX" : "APNS";

	return JSON.stringify({
		default: payload.message,
		[apnsKey]: apns,
	});
}

function isStaleEndpointError(error: unknown): boolean {
	if (!error || typeof error !== "object") return false;
	const name = "name" in error ? String(error.name) : "";
	const message = "message" in error ? String(error.message) : "";
	return (
		name === "EndpointDisabledException" ||
		name === "InvalidParameterException" ||
		message.includes("Endpoint is disabled") ||
		message.includes("Invalid parameter: TargetArn")
	);
}

export async function sendPushToUsers(userIds: string[], payload: PushPayload) {
	if (userIds.length === 0) return;
	if (!getSnsIosPlatformApplicationArn()) return;

	const tokenRows = await db
		.select({ token: nativePushTokens.token })
		.from(nativePushTokens)
		.where(
			and(
				inArray(nativePushTokens.userId, userIds),
				eq(nativePushTokens.platform, "ios"),
			),
		);

	const endpointArns = [
		...new Set(
			tokenRows
				.map((row) => row.token)
				.filter((token) => isSnsEndpointArn(token)),
		),
	];
	if (endpointArns.length === 0) return;

	const redirect = normalizePushRedirect(payload.type, payload.redirect);
	const message = buildSnsApnsMessage(payload, redirect);
	const client = getSnsClient();
	const staleEndpoints = new Set<string>();

	for (const endpointChunk of chunkArray(endpointArns, 10)) {
		await Promise.all(
			endpointChunk.map(async (endpointArn) => {
				try {
					await client.send(
						new PublishCommand({
							TargetArn: endpointArn,
							MessageStructure: "json",
							Message: message,
						}),
					);
				} catch (error) {
					if (isStaleEndpointError(error)) {
						staleEndpoints.add(endpointArn);
						return;
					}
					console.error("Failed to send push notification:", error);
				}
			}),
		);
	}

	if (staleEndpoints.size > 0) {
		const staleList = [...staleEndpoints];
		await Promise.all(staleList.map((arn) => deleteIosPushEndpoint(arn)));
		await db
			.delete(nativePushTokens)
			.where(inArray(nativePushTokens.token, staleList));
	}
}
