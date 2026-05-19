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
	styled,
	Typography,
} from "@mui/material";
import { useState } from "react";
import {
	NotificationEmptyState,
	NotificationGroupInviteDialog,
} from "@/components/notifications";
import { useNotificationActions } from "@/hooks/use-notification-actions";
import type { NotificationItem } from "@/lib/auth/user";
import { getNotificationAvatarSrc, timeAgo } from "@/lib/notification/utils";

const StyledDrawer = styled(Drawer)({
	"& .MuiDrawer-paper": {
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		paddingLeft: 16,
		paddingRight: 16,
		paddingBottom: 24,
	},
});

const CloseRow = styled(Box)({
	display: "flex",
	justifyContent: "flex-end",
	paddingTop: 12,
});

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

const TextBlock = styled(Box)({
	flex: 1,
	minWidth: 0,
});

const ActionButton = styled(Button)({
	textTransform: "capitalize",
});

const MarkReadButton = styled(ActionButton)(({ theme }) => ({
	color: theme.palette.text.primary,
}));

const NotifAvatar = styled(Avatar)({
	width: 48,
	height: 48,
});

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

	async function markSelectedAsRead() {
		const ids =
			selectedIds.size > 0 ? [...selectedIds] : unread.map((n) => n.id);
		await Promise.all(ids.map((id) => readNotification(id)));
		setSelectedIds(new Set());
	}

	return (
		<>
			<StyledDrawer anchor="bottom" open={open} onClose={onClose}>
				<CloseRow>
					<IconButton onClick={onClose} size="small">
						<Close />
					</IconButton>
				</CloseRow>

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

				<Divider />

				<ActionBar>
					<ActionButton size="small" color="info" onClick={selectAll}>
						Select All
					</ActionButton>
					{selectedIds.size > 0 && (
						<MarkReadButton
							size="small"
							color="inherit"
							onClick={markSelectedAsRead}
						>
							Mark as Read
						</MarkReadButton>
					)}
				</ActionBar>

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
									<NotifAvatar
										alt={notif.title || "Group icon"}
										src={getNotificationAvatarSrc(notif)}
										slotProps={{ img: { referrerPolicy: "no-referrer" } }}
									/>
									{selectedIds.has(notif.id) && <SelectedCheck />}
								</AvatarWrapper>
							</Badge>
							<TextBlock>
								<Typography variant="subtitle2">{notif.title}</Typography>
								<Typography variant="caption" color="text.secondary">
									{timeAgo(notif.createdAt)} • {notif.createdBy}
								</Typography>
							</TextBlock>
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
			</StyledDrawer>

			<NotificationGroupInviteDialog
				open={showGroupInvite}
				activeNotification={activeNotification}
				setOpen={setShowGroupInvite}
				setActiveNotification={setActiveNotification}
			/>
		</>
	);
}
