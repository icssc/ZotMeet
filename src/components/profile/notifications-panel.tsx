"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { useState, useTransition } from "react";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import { saveNotificationPreferences } from "@/server/actions/user/action";

export type NotificationPrefs = {
	meetingInvites: boolean;
	groupInvites: boolean;
	nudges: boolean;
};

const NOTIFICATION_OPTIONS = [
	{
		key: "meetingInvites" as const,
		label: "Meeting Invites",
		description: "Receive",
	},
	{
		key: "groupInvites" as const,
		label: "Group Invites",
		description: "Receive",
	},
	{ key: "nudges" as const, label: "Nudges", description: "Receive" },
];

interface NotificationsPanelProps {
	initialPreferences: NotificationPrefs;
}

export function NotificationsPanel({
	initialPreferences,
}: NotificationsPanelProps) {
	const [prefs, setPrefs] = useState<NotificationPrefs>(initialPreferences);
	const [isPending, startTransition] = useTransition();
	const { showSuccess, showError } = useSnackbar();

	const handleToggle = (key: keyof NotificationPrefs) => {
		setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const handleDiscard = () => {
		setPrefs(initialPreferences);
	};

	const handleSave = () => {
		startTransition(async () => {
			const result = await saveNotificationPreferences(prefs);
			if (result.success) {
				showSuccess("Notification preferences saved");
			} else {
				showError("Failed to save notification preferences");
			}
		});
	};

	return (
		<Stack spacing={3}>
			<Typography variant="h5">Notifications</Typography>

			<Stack spacing={0}>
				{NOTIFICATION_OPTIONS.map((option) => (
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
							<Typography variant="body1" fontWeight={500}>
								{option.label}
							</Typography>
							<Typography variant="body2" color="text.secondary">
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
				<Button variant="text" color="primary" onClick={handleDiscard}>
					Discard
				</Button>
				<Button
					variant="contained"
					color="primary"
					onClick={handleSave}
					disabled={isPending}
				>
					{isPending ? "Saving..." : "Save Changes"}
				</Button>
			</Stack>
		</Stack>
	);
}
