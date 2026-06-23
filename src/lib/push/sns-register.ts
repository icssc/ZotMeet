import "server-only";

import {
	CreatePlatformEndpointCommand,
	DeleteEndpointCommand,
	SetEndpointAttributesCommand,
} from "@aws-sdk/client-sns";
import { getSnsClient } from "@/lib/push/sns-client";
import {
	getSnsIosPlatformApplicationArn,
	isSnsEndpointArn,
} from "@/lib/push/sns-config";

let warnedMissingPlatformArn = false;

export async function registerIosPushEndpoint(
	apnsDeviceToken: string,
	userId: string,
): Promise<string | null> {
	const platformApplicationArn = getSnsIosPlatformApplicationArn();
	if (!platformApplicationArn) {
		if (!warnedMissingPlatformArn) {
			console.warn(
				"Push notifications are disabled: missing SNS_IOS_PLATFORM_APPLICATION_ARN.",
			);
			warnedMissingPlatformArn = true;
		}
		return null;
	}

	const client = getSnsClient();

	let endpointArn: string | undefined;
	try {
		const created = await client.send(
			new CreatePlatformEndpointCommand({
				PlatformApplicationArn: platformApplicationArn,
				Token: apnsDeviceToken,
				CustomUserData: userId,
			}),
		);
		endpointArn = created.EndpointArn;
	} catch (error) {
		console.error("Failed to create SNS platform endpoint:", error);
		return null;
	}

	if (!endpointArn) return null;

	try {
		await client.send(
			new SetEndpointAttributesCommand({
				EndpointArn: endpointArn,
				Attributes: {
					Token: apnsDeviceToken,
					Enabled: "true",
					CustomUserData: userId,
				},
			}),
		);
	} catch (error) {
		console.error("Failed to update SNS endpoint attributes:", error);
	}

	return endpointArn;
}

export async function deleteIosPushEndpoint(
	endpointArn: string,
): Promise<void> {
	if (!isSnsEndpointArn(endpointArn)) return;

	try {
		await getSnsClient().send(
			new DeleteEndpointCommand({
				EndpointArn: endpointArn,
			}),
		);
	} catch (error) {
		console.error("Failed to delete SNS endpoint:", error);
	}
}
