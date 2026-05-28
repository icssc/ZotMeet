"use client";

import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import { isNativeIosApp } from "@/lib/platform";

type PermissionState = NotificationPermission | "unsupported";
type SubscriptionState = "idle" | "subscribing" | "subscribed" | "error";

const WEB_PUSH_PUBLIC_KEY = process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY;

function browserSupportsNotifications() {
	return (
		typeof window !== "undefined" &&
		"Notification" in window &&
		"serviceWorker" in navigator
	);
}

function isStandaloneWebApp() {
	if (typeof window === "undefined") return false;

	return (
		window.matchMedia("(display-mode: standalone)").matches ||
		("standalone" in navigator &&
			(navigator as Navigator & { standalone?: boolean }).standalone === true)
	);
}

function getInitialPermission(): PermissionState {
	if (!browserSupportsNotifications()) return "unsupported";
	return Notification.permission;
}

function base64UrlToUint8Array(value: string) {
	const padding = "=".repeat((4 - (value.length % 4)) % 4);
	const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
	const raw = window.atob(base64);
	const bytes = new Uint8Array(raw.length);

	for (let i = 0; i < raw.length; i += 1) {
		bytes[i] = raw.charCodeAt(i);
	}

	return bytes;
}

export function WebPushPermissionButton() {
	const [permission, setPermission] =
		useState<PermissionState>(getInitialPermission);
	const [isStandalone, setIsStandalone] = useState(false);
	const [isNative, setIsNative] = useState(false);
	const [isRequesting, setIsRequesting] = useState(false);
	const [subscriptionState, setSubscriptionState] =
		useState<SubscriptionState>("idle");
	const { showSuccess, showError } = useSnackbar();

	const ensureSubscription = useCallback(async () => {
		if (!browserSupportsNotifications()) return false;
		if (!WEB_PUSH_PUBLIC_KEY) {
			setSubscriptionState("error");
			showError("Push notifications are not configured for this deployment");
			return false;
		}

		setSubscriptionState("subscribing");

		try {
			const registration = await navigator.serviceWorker.ready;
			const existing = await registration.pushManager.getSubscription();
			const subscription =
				existing ??
				(await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: base64UrlToUint8Array(WEB_PUSH_PUBLIC_KEY),
				}));

			const response = await fetch("/api/push-subscriptions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(subscription.toJSON()),
			});

			if (!response.ok) {
				throw new Error("Failed to save push subscription");
			}

			setSubscriptionState("subscribed");
			return true;
		} catch {
			setSubscriptionState("error");
			showError("Failed to enable push notifications");
			return false;
		}
	}, [showError]);

	useEffect(() => {
		setPermission(getInitialPermission());
		setIsStandalone(isStandaloneWebApp());
		setIsNative(isNativeIosApp());
	}, []);

	useEffect(() => {
		if (permission === "granted" && isStandalone && !isNative) {
			void ensureSubscription();
		}
	}, [permission, isStandalone, isNative, ensureSubscription]);

	if (isNative || permission === "unsupported") return null;

	const handleEnable = async () => {
		if (!browserSupportsNotifications()) return;

		setIsRequesting(true);
		try {
			const nextPermission = await Notification.requestPermission();
			setPermission(nextPermission);

			if (nextPermission === "granted") {
				const subscribed = await ensureSubscription();
				if (subscribed) showSuccess("Notifications enabled");
			} else {
				showError("Notification permission was not enabled");
			}
		} catch {
			showError("Failed to request notification permission");
		} finally {
			setIsRequesting(false);
		}
	};

	let statusText =
		"Install ZotMeet to your home screen to enable iOS browser notifications.";
	if (permission === "granted" && subscriptionState === "subscribed") {
		statusText = "Device notifications are enabled on this home-screen app.";
	} else if (permission === "granted" && subscriptionState === "error") {
		statusText =
			"Permission is enabled, but this device could not be subscribed.";
	} else if (permission === "granted") {
		statusText = "Finishing device notification setup.";
	} else if (permission === "denied") {
		statusText =
			"Browser notification permission is blocked in system settings.";
	} else if (isStandalone) {
		statusText =
			"Enable browser notification permission for this home-screen app.";
	}

	return (
		<Stack
			direction={{ xs: "column", sm: "row" }}
			spacing={2}
			alignItems={{ xs: "flex-start", sm: "center" }}
			justifyContent="space-between"
			sx={{
				py: 2,
				borderBottom: 1,
				borderColor: "divider",
			}}
		>
			<Stack spacing={0.75}>
				<Typography variant="body1" fontWeight={500}>
					Device Notifications
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{statusText}
				</Typography>
			</Stack>
			<Button
				variant="outlined"
				startIcon={<NotificationsActiveOutlinedIcon />}
				onClick={handleEnable}
				disabled={permission !== "default" || !isStandalone || isRequesting}
				sx={{ flexShrink: 0 }}
			>
				{subscriptionState === "subscribing"
					? "Enabling..."
					: permission === "granted"
						? "Enabled"
						: permission === "denied"
							? "Blocked"
							: isRequesting
								? "Enabling..."
								: "Enable"}
			</Button>
		</Stack>
	);
}
