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

function getUserTopic(userId: string) {
	return `user_${userId}`;
}

function postMessage(name: string, payload?: unknown) {
	const handler = getBridgeHandler(name);
	if (!handler) return;
	handler.postMessage(payload ? JSON.stringify(payload) : "");
}

type NativeIosPushBridgeProps = {
	userId: string;
};

export function NativeIosPushBridge({ userId }: NativeIosPushBridgeProps) {
	useEffect(() => {
		if (!isNativeIosApp()) return;
		if (!window.webkit?.messageHandlers) return;

		const topic = getUserTopic(userId);
		const subscribe = () => postMessage("push-subscribe", { topic });

		const handlePermissionState = (event: Event) => {
			const detail = (event as CustomEvent<string>).detail;
			if (
				detail === "authorized" ||
				detail === "ephemeral" ||
				detail === "provisional"
			) {
				subscribe();
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
				subscribe();
				postMessage("push-token");
			}
		};

		window.addEventListener("push-permission-state", handlePermissionState);
		window.addEventListener(
			"push-permission-request",
			handlePermissionRequestResult,
		);

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
			postMessage("push-subscribe", { topic, unsubscribe: true });
		};
	}, [userId]);

	return null;
}
