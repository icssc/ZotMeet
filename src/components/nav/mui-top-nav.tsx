"use client";

import { deleteNotification, readNotification } from "@actions/user/action";
import {
	Close,
	DarkModeOutlined,
	LightModeOutlined,
	Login,
	Person,
} from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import {
	AppBar,
	Avatar,
	Badge,
	Box,
	Button,
	Divider,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Typography,
} from "@mui/material";
import type { BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
	NotificationEmptyState,
	NotificationGroupInviteDialog,
} from "@/components/notifications";
import { useNotificationActions } from "@/hooks/use-notification-actions";
import type { NotificationItem, UserProfile } from "@/lib/auth/user";
import { getNotificationAvatarSrc, timeAgo } from "@/lib/notification/utils";
import { logoutAction } from "@/server/actions/auth/logout/action";
import { useThemeMode } from "../theme/theme-provider";

const navItems = [
	{ title: "Meetings", url: "/summary" },
	{ title: "Groups", url: "/groups" },
	{ title: "Rooms", url: "/studyrooms" },
];

type MuiTopNavProps = {
	user: UserProfile | null;
	notifications: NotificationItem[];
};

export function MuiTopNav({ user, notifications }: MuiTopNavProps) {
	const pathname = usePathname();
	const { mode, setMode } = useThemeMode();

	return (
		<AppBar
			position="sticky"
			sx={{
				backgroundColor: "background.paper",
				color: "text.primary",
				boxShadow:
					"0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
			}}
		>
			<Toolbar
				sx={{
					display: "flex",
					alignItems: "center",
				}}
			>
				<Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
					<Link href="/">
						<Image
							src="/zotmeet-logo.svg"
							alt="ZotMeet logo"
							width={40}
							height={40}
						/>
					</Link>
				</Box>

				<Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
					{navItems.map((item) => {
						const isActive = pathname === item.url;

						return (
							<Button
								key={item.url}
								component={Link}
								href={item.url}
								sx={{
									color: "text.primary",
									fontWeight: isActive ? 700 : 400,
									fontSize: "20px",
									borderRadius: 0,
									borderBottom: "2px solid transparent",
									"&:hover": {
										backgroundColor: "action.hover",
										borderColor: "text.primary",
									},
								}}
							>
								{item.title}
							</Button>
						);
					})}
				</Box>

				<Box
					sx={{
						flex: 1,
						display: "flex",
						justifyContent: "flex-end",
						alignItems: "center",
						gap: 0.5,
					}}
				>
					<IconButton
						onClick={() => setMode(mode === "dark" ? "light" : "dark")}
					>
						{mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
					</IconButton>
					<Notifications notifications={notifications} />
					<Box sx={{ ml: 1 }}>
						<NavUser user={user} />
					</Box>
				</Box>
			</Toolbar>
		</AppBar>
	);
}
const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
	"& .MuiBadge-badge": {
		top: 13,
		right: -13,
		border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
	},
}));
const markAllAsRead = async (notifications: NotificationItem[]) => {
	for (const notif of notifications) {
		if (!notif.readAt) {
			await readNotification(notif.id);
		}
	}
};

function Notifications({
	notifications,
}: {
	notifications: NotificationItem[];
}) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const {
		unread,
		showGroupInvite,
		setShowGroupInvite,
		activeNotification,
		setActiveNotification,
		handleOpen,
	} = useNotificationActions(notifications);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	return (
		<>
			<IconButton onClick={handleClick}>
				<Badge badgeContent={unread.length} color="primary">
					<NotificationsOutlinedIcon />
				</Badge>
			</IconButton>
			<Menu
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={() => setAnchorEl(null)}
				MenuListProps={{ disablePadding: true }}
			>
				<Box sx={{ width: 360 }}>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							p: 2,
							borderBottom: "1px solid",
							borderColor: "divider",
						}}
					>
						<StyledBadge badgeContent={unread.length} color="primary">
							<Typography variant="h6">Notifications</Typography>
						</StyledBadge>
						<Button
							onClick={() => {
								markAllAsRead(unread);
							}}
						>
							Mark all as read
						</Button>
					</Box>
					<Box sx={{ display: "flex", flexDirection: "column" }}>
						{unread.length === 0 ? (
							<NotificationEmptyState />
						) : (
							unread.map((notif) => (
								<Box
									sx={{
										pl: 2,
										pr: 2,
										borderBottom: "1px solid",
										borderColor: "divider",
									}}
									key={notif.id}
								>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											flexDirection: "row",
										}}
									>
										<Avatar
											alt={notif.title || "Group icon"}
											src={getNotificationAvatarSrc(notif)}
											slotProps={{ img: { referrerPolicy: "no-referrer" } }}
										/>
										<Box sx={{ p: 1 }}>
											<Typography variant="body1">{notif.title}</Typography>
											<Typography variant="body2" color="text.secondary">
												{notif.message}
											</Typography>
											<Typography variant="body2">
												{timeAgo(notif.createdAt)}
												{" • "}
												{notif.createdBy}
											</Typography>
										</Box>
										<Button
											variant="outlined"
											color="inherit"
											size="small"
											sx={{ ml: "auto", my: 2 }}
											onClick={() =>
												handleOpen(notif, {
													onClose: () => setAnchorEl(null),
													beforeOpen: () => deleteNotification(notif.id),
												})
											}
										>
											View
										</Button>
										<IconButton
											size="small"
											onClick={() => deleteNotification(notif.id)}
											sx={{}}
										>
											<Close fontSize="small" />
										</IconButton>
									</Box>
								</Box>
							))
						)}
					</Box>
				</Box>
			</Menu>
			<NotificationGroupInviteDialog
				open={showGroupInvite}
				activeNotification={activeNotification}
				setOpen={setShowGroupInvite}
				setActiveNotification={setActiveNotification}
			/>
		</>
	);
}

function NavUser({ user }: { user: UserProfile | null }) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	if (!user) {
		return (
			<Button
				component="a"
				href="/auth/login/google"
				startIcon={<Login />}
				sx={{
					color: "text.primary",
				}}
			>
				Sign In
			</Button>
		);
	}

	return (
		<>
			<Box
				onClick={(e) => setAnchorEl(e.currentTarget)}
				sx={{
					cursor: "pointer",
					display: "flex",
					alignItems: "center",
					gap: 1,
				}}
			>
				<Avatar
					src={user.profilePicture ?? undefined}
					slotProps={{ img: { referrerPolicy: "no-referrer" } }}
					sx={{ width: 32, height: 32 }}
				>
					<Person fontSize="small" />
				</Avatar>
				<Typography
					variant="body2"
					sx={{ display: { xs: "none", sm: "block" } }}
					noWrap
					fontWeight={500}
				>
					{user.displayName}
				</Typography>
			</Box>

			<Menu
				disableScrollLock
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={() => setAnchorEl(null)}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<MenuItem
					component={Link}
					href="/profile"
					onClick={() => setAnchorEl(null)}
				>
					<Person sx={{ mr: 1 }} /> Profile
				</MenuItem>

				<MenuItem
					component={Link}
					target="_blank"
					href="https://forms.gle/oi2T4JM26vT4FToM7"
				>
					<FavoriteIcon sx={{ mr: 1 }} />
					Feedback
				</MenuItem>

				<Divider />

				<MenuItem
					onClick={() => {
						setAnchorEl(null);
						logoutAction();
					}}
					sx={{ color: "error.main" }}
				>
					<LogoutIcon sx={{ mr: 1, color: "error.main" }} />
					<Typography>Log out</Typography>
				</MenuItem>
			</Menu>
		</>
	);
}
