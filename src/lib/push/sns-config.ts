import "server-only";

const DEFAULT_SNS_REGION = "us-west-1";

export function getSnsRegion(): string {
	return (
		process.env.SNS_REGION?.trim() ||
		process.env.AWS_REGION?.trim() ||
		DEFAULT_SNS_REGION
	);
}

/** ARN of the SNS platform application for Apple Push (APNs). */
export function getSnsIosPlatformApplicationArn(): string | null {
	const arn = process.env.SNS_IOS_PLATFORM_APPLICATION_ARN?.trim();
	return arn || null;
}

/** `sandbox` for dev/TestFlight debug builds; `production` for App Store. */
export function getSnsIosApnsEnv(): "sandbox" | "production" {
	return process.env.SNS_IOS_APNS_ENV === "sandbox" ? "sandbox" : "production";
}

export function isSnsEndpointArn(value: string): boolean {
	return value.startsWith("arn:aws:sns:");
}

/** APNs device token from `UIApplication` (hex-encoded bytes). */
export function isApnsDeviceToken(value: string): boolean {
	return /^[0-9a-f]{32,}$/i.test(value);
}
