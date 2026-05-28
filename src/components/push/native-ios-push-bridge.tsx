"use client";

import { useEffect } from "react";
import { isNativeIosApp } from "@/lib/platform";

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

type NativeIosPushBridgeProps = {
	userId: string;
};

async function savePushToken(token: string) {
	const trimmedToken = token.trim();
	if (!trimmedToken || trimmedToken === "ERROR GET TOKEN") return;

	try {
		await fetch("/api/push-tokens", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ token: trimmedToken, platform: "ios" }),
		});
	} catch (error) {
		console.error("Failed to save native push token", error);
	}
}

export function NativeIosPushBridge({
	userId: _userId,
}: NativeIosPushBridgeProps) {
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

		window.addEventListener("push-permission-state", handlePermissionState);
		window.addEventListener(
			"push-permission-request",
			handlePermissionRequestResult,
		);
		window.addEventListener("push-token", handlePushToken);

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
		};
	}, []);

	return null;
}
