"use client";

import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import { isNativeIosApp } from "@/lib/platform";

type PermissionState = NotificationPermission | "unsupported";

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

export function WebPushPermissionButton() {
	const [permission, setPermission] =
		useState<PermissionState>(getInitialPermission);
	const [isStandalone, setIsStandalone] = useState(false);
	const [isNative, setIsNative] = useState(false);
	const [isRequesting, setIsRequesting] = useState(false);
	const { showSuccess, showError } = useSnackbar();

	useEffect(() => {
		setPermission(getInitialPermission());
		setIsStandalone(isStandaloneWebApp());
		setIsNative(isNativeIosApp());
	}, []);

	if (isNative || permission === "unsupported") return null;

	const handleEnable = async () => {
		if (!browserSupportsNotifications()) return;

		setIsRequesting(true);
		try {
			await navigator.serviceWorker.ready;
			const nextPermission = await Notification.requestPermission();
			setPermission(nextPermission);

			if (nextPermission === "granted") {
				showSuccess("Notification permission enabled");
			} else {
				showError("Notification permission was not enabled");
			}
		} catch {
			showError("Failed to request notification permission");
		} finally {
			setIsRequesting(false);
		}
	};

	const statusText =
		permission === "granted"
			? "Browser notification permission is enabled on this device."
			: permission === "denied"
				? "Browser notification permission is blocked in system settings."
				: isStandalone
					? "Enable browser notification permission for this home-screen app."
					: "Install ZotMeet to your home screen to enable iOS browser notifications.";

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
				{permission === "granted"
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
