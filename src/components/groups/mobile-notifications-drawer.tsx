"use client";

import { deleteNotification } from "@actions/user/action";
import { ChevronRight, Close } from "@mui/icons-material";
import {
	Avatar,
	Badge,
	Box,
	Divider,
	Drawer,
	IconButton,
	Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AcceptGroupInvite } from "@/components/groups/accept-group-invite";
import type { NotificationItem } from "@/lib/auth/user";

function timeAgo(date: Date | null | undefined): string {
	if (!date) return "";
	const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
	if (seconds < 60) return `${seconds}s ago`;
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	if (days < 7) return `${days}d ago`;
	const weeks = Math.floor(days / 7);
	if (weeks < 4) return `${weeks}w ago`;
	const months = Math.floor(days / 30);
	if (months < 12) return `${months}mo ago`;
	return `${Math.floor(days / 365)}y ago`;
}

type MobileNotificationsDrawerProps = {
	open: boolean;
	onClose: () => void;
	notifications: NotificationItem[];
};

export function MobileNotificationsDrawer({
	open,
	onClose,
	notifications,
}: MobileNotificationsDrawerProps) {
	const router = useRouter();
	const [showGroupInvite, setShowGroupInvite] = useState(false);
	const [activeNotification, setActiveNotification] =
		useState<NotificationItem | null>(null);

	const unread = notifications.filter((n) => !n.readAt);

	return (
		<>
			<Drawer
				anchor="bottom"
				open={open}
				onClose={onClose}
				PaperProps={{
					sx: {
						borderTopLeftRadius: 16,
						borderTopRightRadius: 16,
						px: 2,
						pb: 3,
					},
				}}
			>
				<Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1.5 }}>
					<IconButton onClick={onClose} size="small">
						<Close />
					</IconButton>
				</Box>

				<Box sx={{ px: 2, pb: 1.5 }}>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
						<Typography variant="h5" fontWeight={500}>
							Notifications
						</Typography>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								minWidth: 24,
								height: 24,
								bgcolor: "action.selected",
								borderRadius: "100px",
								px: 1,
							}}
						>
							<Typography variant="caption" fontWeight={500}>
								{unread.length}
							</Typography>
						</Box>
					</Box>
				</Box>

				<Divider />

				<Box sx={{ display: "flex", flexDirection: "column" }}>
					{unread.map((notif) => (
						<Box
							key={notif.id}
							sx={{
								pl: 2,
								pr: 1,
								py: 1.5,
								borderBottom: "1px solid",
								borderColor: "divider",
								display: "flex",
								alignItems: "center",
								gap: 1.5,
							}}
						>
							<Badge
								variant="dot"
								color="primary"
								overlap="circular"
								anchorOrigin={{ vertical: "top", horizontal: "left" }}
							>
								<Avatar
									alt={notif.title || "Group icon"}
									src={
										notif.createdByAvatar ||
										notif.groupIcon ||
										"/icssc-logo.svg"
									}
									slotProps={{ img: { referrerPolicy: "no-referrer" } }}
									sx={{ width: 48, height: 48 }}
								/>
							</Badge>
							<Box sx={{ flex: 1, minWidth: 0 }}>
								<Typography variant="subtitle2">{notif.title}</Typography>
								<Typography variant="caption" color="text.secondary">
									{timeAgo(notif.createdAt)} • {notif.createdBy}
								</Typography>
							</Box>
							<IconButton
								size="small"
								onClick={() => {
									if (notif.type === "Meeting Invite") {
										onClose();
										router.push(notif.redirect ?? "");
									} else {
										setActiveNotification(notif);
										setShowGroupInvite(true);
									}
								}}
							>
								<ChevronRight fontSize="small" />
							</IconButton>
							<IconButton
								size="small"
								onClick={() => deleteNotification(notif.id)}
							>
								<Close fontSize="small" />
							</IconButton>
						</Box>
					))}
				</Box>

				<Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
					<Typography
						variant="caption"
						color="text.secondary"
						fontStyle="italic"
					>
						You&apos;re all caught up! 🎉
					</Typography>
				</Box>
			</Drawer>

			{activeNotification && (
				<AcceptGroupInvite
					open={showGroupInvite}
					notification={activeNotification}
					onOpenChange={(open) => {
						setShowGroupInvite(open);
						if (!open) setActiveNotification(null);
					}}
				/>
			)}
		</>
	);
}
