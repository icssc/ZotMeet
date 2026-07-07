"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isNativeIosApp } from "@/lib/platform";
import { parseNativePushPayload } from "@/lib/push/parse-payload";
import { resolvePushNotificationPath } from "@/lib/push/redirect";

declare global {
	interface Window {
		webkit?: {
			messageHandlers?: Record<
				string,
				{
					postMessage: (message: string) => void;
				}
			>;
		};
	}
}

function getBridgeHandler(name: string) {
	return window.webkit?.messageHandlers?.[name];
}

function postMessage(name: string, payload?: unknown) {
	const handler = getBridgeHandler(name);
	if (!handler) return;
	handler.postMessage(payload ? JSON.stringify(payload) : "");
}

async function savePushToken(token: string) {
	const trimmedToken = token.trim();
	if (!trimmedToken || trimmedToken === "ERROR GET TOKEN") return;

	try {
		const response = await fetch("/api/push-tokens", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ token: trimmedToken, platform: "ios" }),
		});

		if (!response.ok) {
			throw new Error("Failed to save native push token");
		}
	} catch (error) {
		console.error("Failed to save native push token", error);
	}
}

export function NativeIosPushBridge() {
	const router = useRouter();

	useEffect(() => {
		if (!isNativeIosApp()) return;
		if (!window.webkit?.messageHandlers) return;

		const handlePermissionState = (event: Event) => {
			const detail = (event as CustomEvent<string>).detail;
			if (
				detail === "authorized" ||
				detail === "ephemeral" ||
				detail === "provisional"
			) {
				postMessage("push-token");
				return;
			}

			if (detail === "notDetermined") {
				postMessage("push-permission-request");
			}
		};

		const handlePermissionRequestResult = (event: Event) => {
			const detail = (event as CustomEvent<string>).detail;
			if (detail === "granted") {
				postMessage("push-token");
			}
		};

		const handlePushToken = (event: Event) => {
			const detail = (event as CustomEvent<string>).detail;
			if (typeof detail === "string") {
				void savePushToken(detail);
			}
		};

		const handleNotificationClick = (event: Event) => {
			const payload = parseNativePushPayload((event as CustomEvent).detail);
			router.push(resolvePushNotificationPath(payload.type, payload.redirect));
		};

		window.addEventListener("push-permission-state", handlePermissionState);
		window.addEventListener(
			"push-permission-request",
			handlePermissionRequestResult,
		);
		window.addEventListener("push-token", handlePushToken);
		window.addEventListener("push-notification-click", handleNotificationClick);

		postMessage("push-permission-state");

		return () => {
			window.removeEventListener(
				"push-permission-state",
				handlePermissionState,
			);
			window.removeEventListener(
				"push-permission-request",
				handlePermissionRequestResult,
			);
			window.removeEventListener("push-token", handlePushToken);
			window.removeEventListener(
				"push-notification-click",
				handleNotificationClick,
			);
		};
	}, [router]);

	return null;
}
