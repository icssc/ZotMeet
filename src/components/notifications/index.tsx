"use client";

import { Box, Typography } from "@mui/material";
import { AcceptGroupInvite } from "@/components/groups/accept-group-invite";
import type { NotificationItem } from "@/lib/auth/user";

export function NotificationEmptyState() {
	return (
		<Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
			<Typography variant="body2" color="text.secondary">
				You&apos;re all caught up! 🎉
			</Typography>
		</Box>
	);
}

type NotificationGroupInviteDialogProps = {
	open: boolean;
	activeNotification: NotificationItem | null;
	setOpen: (open: boolean) => void;
	setActiveNotification: (n: NotificationItem | null) => void;
};

export function NotificationGroupInviteDialog({
	open,
	activeNotification,
	setOpen,
	setActiveNotification,
}: NotificationGroupInviteDialogProps) {
	if (!activeNotification) return null;
	return (
		<AcceptGroupInvite
			source="notification"
			open={open}
			notification={activeNotification}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen) setActiveNotification(null);
			}}
		/>
	);
}
