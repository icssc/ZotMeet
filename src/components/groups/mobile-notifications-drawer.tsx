"use client";

import { readNotification } from "@actions/user/action";
import { CheckCircle, ChevronRight, Close } from "@mui/icons-material";
import {
	Avatar,
	Badge,
	Box,
	Button,
	Divider,
	IconButton,
	styled,
	Typography,
} from "@mui/material";
import { useState } from "react";
import {
	NotificationEmptyState,
	NotificationGroupInviteDialog,
} from "@/components/notifications";
import { MuiBottomSheet } from "@/components/ui/mui/mui-bottom-sheet";
import { useNotificationActions } from "@/hooks/use-notification-actions";
import type { NotificationItem } from "@/lib/auth/user";
import { getNotificationAvatarSrc, timeAgo } from "@/lib/notification/utils";

const HeaderBox = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(1.5),
	padding: `0 ${theme.spacing(2)} ${theme.spacing(1.5)}`,
}));

const UnreadCount = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	minWidth: 24,
	height: 24,
	backgroundColor: theme.palette.action.selected,
	borderRadius: 100,
	paddingLeft: theme.spacing(1),
	paddingRight: theme.spacing(1),
}));

const ActionBar = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	paddingLeft: theme.spacing(1),
	paddingRight: theme.spacing(1),
	paddingTop: theme.spacing(0.5),
	paddingBottom: theme.spacing(0.5),
}));

const NotificationRow = styled(Box)(({ theme }) => ({
	paddingLeft: theme.spacing(2),
	paddingRight: theme.spacing(1),
	paddingTop: theme.spacing(1.5),
	paddingBottom: theme.spacing(1.5),
	borderBottom: `1px solid ${theme.palette.divider}`,
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(1.5),
	cursor: "pointer",
	"&:hover": {
		backgroundColor: theme.palette.action.hover,
	},
}));

const AvatarWrapper = styled(Box)({
	position: "relative",
	width: 48,
	height: 48,
});

const SelectedCheck = styled(CheckCircle)(({ theme }) => ({
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	fontSize: 36,
	color: theme.palette.primary.main,
	backgroundColor: theme.palette.background.paper,
	borderRadius: "50%",
}));

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
	const {
		unread,
		showGroupInvite,
		setShowGroupInvite,
		activeNotification,
		setActiveNotification,
		handleOpen,
	} = useNotificationActions(notifications);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

	function deselectAll() {
		setSelectedIds(new Set());
	}

	const allSelected = unread.length > 0 && selectedIds.size === unread.length;

	async function markSelectedAsRead() {
		const ids =
			selectedIds.size > 0 ? [...selectedIds] : unread.map((n) => n.id);
		await Promise.all(ids.map((id) => readNotification(id)));
		setSelectedIds(new Set());
	}

	return (
		<>
			<MuiBottomSheet
				open={open}
				onClose={onClose}
				paperSx={{
					borderTopLeftRadius: 16,
					borderTopRightRadius: 16,
					px: 2,
					pb: 3,
				}}
			>
				<Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1.5 }}>
					<IconButton onClick={onClose} size="small">
						<Close />
					</IconButton>
				</Box>

				<HeaderBox>
					<Typography variant="h5" fontWeight={500}>
						Notifications
					</Typography>
					<UnreadCount>
						<Typography variant="caption" fontWeight={500}>
							{unread.length}
						</Typography>
					</UnreadCount>
				</HeaderBox>

				<Divider sx={{ mx: -2 }} />

				{unread.length > 0 && (
					<ActionBar>
						<Button
							size="small"
							color="info"
							onClick={allSelected ? deselectAll : selectAll}
							sx={{ textTransform: "capitalize" }}
						>
							{allSelected ? "Deselect All" : "Select All"}
						</Button>
						{selectedIds.size > 0 && (
							<Button
								size="small"
								color="inherit"
								onClick={markSelectedAsRead}
								sx={{ textTransform: "capitalize", color: "text.primary" }}
							>
								Mark as Read
							</Button>
						)}
					</ActionBar>
				)}

				<Box>
					{unread.map((notif) => (
						<NotificationRow
							key={notif.id}
							onClick={() => toggleSelected(notif.id)}
						>
							<Badge
								variant="dot"
								color="primary"
								overlap="circular"
								anchorOrigin={{ vertical: "top", horizontal: "left" }}
							>
								<AvatarWrapper>
									<Avatar
										alt={notif.title || "Group icon"}
										src={getNotificationAvatarSrc(notif)}
										slotProps={{ img: { referrerPolicy: "no-referrer" } }}
										sx={{ width: 48, height: 48 }}
									/>
									{selectedIds.has(notif.id) && <SelectedCheck />}
								</AvatarWrapper>
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
									handleOpen(notif, {
										onClose,
										beforeOpen: () => readNotification(notif.id),
									});
								}}
							>
								<ChevronRight fontSize="small" />
							</IconButton>
						</NotificationRow>
					))}
				</Box>

				{unread.length === 0 && <NotificationEmptyState />}
			</MuiBottomSheet>

			<NotificationGroupInviteDialog
				open={showGroupInvite}
				activeNotification={activeNotification}
				setOpen={setShowGroupInvite}
				setActiveNotification={setActiveNotification}
			/>
		</>
	);
}
