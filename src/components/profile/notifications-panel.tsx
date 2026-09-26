"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { useState, useTransition } from "react";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import {
	NOTIFICATION_PREF_OPTIONS,
	type NotificationPrefs,
} from "@/lib/notification/types";
import { saveNotificationPreferences } from "@/server/actions/user/action";

interface NotificationsPanelProps {
	initialPreferences: NotificationPrefs;
}

export function NotificationsPanel({
	initialPreferences,
}: NotificationsPanelProps) {
	const [savedPrefs, setSavedPrefs] =
		useState<NotificationPrefs>(initialPreferences);
	const [prefs, setPrefs] = useState<NotificationPrefs>(initialPreferences);
	const [isPending, startTransition] = useTransition();
	const { showSuccess, showError } = useSnackbar();

	const isDirty =
		prefs.meetingInvites !== savedPrefs.meetingInvites ||
		prefs.groupInvites !== savedPrefs.groupInvites ||
		prefs.nudges !== savedPrefs.nudges ||
		prefs.meetingScheduled !== savedPrefs.meetingScheduled;

	const handleToggle = (key: keyof NotificationPrefs) => {
		setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const handleSave = () => {
		startTransition(async () => {
			try {
				const result = await saveNotificationPreferences(prefs);
				if (result.success) {
					setSavedPrefs(prefs);
					showSuccess("Notification preferences saved");
				} else {
					showError("Failed to save notification preferences");
				}
			} catch {
				showError("Failed to save notification preferences");
			}
		});
	};

	return (
		<Stack spacing={3}>
			<Typography variant="h5">Notifications</Typography>

			<Stack spacing={0}>
				{NOTIFICATION_PREF_OPTIONS.map((option) => (
					<Box
						key={option.key}
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							py: 2,
							borderBottom: 1,
							borderColor: "divider",
						}}
					>
						<Box>
							<Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
								{option.label}
							</Typography>
							<Typography variant="body2" color="textSecondary">
								{option.description}
							</Typography>
						</Box>
						<Switch
							checked={prefs[option.key]}
							onChange={() => handleToggle(option.key)}
							color="primary"
						/>
					</Box>
				))}
			</Stack>

			<Stack
				direction="row"
				justifyContent="flex-end"
				spacing={2}
				sx={{ pt: 2 }}
			>
				<Button
					variant="contained"
					color="primary"
					onClick={handleSave}
					disabled={isPending || !isDirty}
				>
					{isPending ? "Saving..." : "Save Changes"}
				</Button>
			</Stack>
		</Stack>
	);
}
