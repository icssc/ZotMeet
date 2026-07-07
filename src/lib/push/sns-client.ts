import "server-only";

import { SNSClient } from "@aws-sdk/client-sns";
import { getSnsRegion } from "@/lib/push/sns-config";

let client: SNSClient | null = null;

export function getSnsClient(): SNSClient {
	if (!client) {
		client = new SNSClient({ region: getSnsRegion() });
	}
	return client;
}
