"use client";

import { readNotification } from "@actions/user/action";
import { CheckCircle, ChevronRight, Close } from "@mui/icons-material";
import {
	Avatar,
	Badge,
	Box,
	Button,
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
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	const unread = notifications.filter((n) => !n.readAt);

	function toggleSelected(id: string) {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}

	function selectAll() {
		setSelectedIds(new Set(unread.map((n) => n.id)));
	}

	async function markSelectedAsRead() {
		const ids =
			selectedIds.size > 0 ? [...selectedIds] : unread.map((n) => n.id);
		await Promise.all(ids.map((id) => readNotification(id)));
		setSelectedIds(new Set());
	}

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

				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						px: 1,
						py: 0.5,
					}}
				>
					<Button
						size="small"
						color="info"
						onClick={selectAll}
						sx={{ textTransform: "capitalize" }}
					>
						Select All
					</Button>
					<Button
						size="small"
						color="inherit"
						onClick={markSelectedAsRead}
						sx={{ textTransform: "capitalize", color: "text.primary" }}
					>
						Mark as Read
					</Button>
				</Box>

				<Box sx={{ display: "flex", flexDirection: "column" }}>
					{unread.map((notif) => (
						<Box
							key={notif.id}
							onClick={() => toggleSelected(notif.id)}
							sx={{
								pl: 2,
								pr: 1,
								py: 1.5,
								borderBottom: "1px solid",
								borderColor: "divider",
								display: "flex",
								alignItems: "center",
								gap: 1.5,
								cursor: "pointer",
								"&:hover": { bgcolor: "action.hover" },
							}}
						>
							<Badge
								variant="dot"
								color="primary"
								overlap="circular"
								anchorOrigin={{ vertical: "top", horizontal: "left" }}
							>
								<Box sx={{ position: "relative", width: 48, height: 48 }}>
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
									{selectedIds.has(notif.id) && (
										<CheckCircle
											sx={{
												position: "absolute",
												top: "50%",
												left: "50%",
												transform: "translate(-50%, -50%)",
												fontSize: 36,
												color: "primary.main",
												bgcolor: "background.paper",
												borderRadius: "50%",
											}}
										/>
									)}
								</Box>
							</Badge>
							<Box sx={{ flex: 1, minWidth: 0 }}>
								<Typography variant="subtitle2">{notif.title}</Typography>
								<Typography variant="caption" color="text.secondary">
									{timeAgo(notif.createdAt)} • {notif.createdBy}
								</Typography>
							</Box>
							<IconButton
								size="small"
								onClick={(e) => {
									e.stopPropagation();
									readNotification(notif.id);
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
					source="notification"
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
