"use client";

import { deleteNotification, readNotification } from "@actions/user/action";
import { Close, Login, Person } from "@mui/icons-material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import {
	AppBar,
	Avatar,
	Badge,
	Box,
	Button,
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
import { AcceptGroupInvite } from "@/components/groups/accept-group-invite";
import type { NotificationItem, UserProfile } from "@/lib/auth/user";
import { logoutAction } from "@/server/actions/auth/logout/action";

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
									fontSize: "18px",
									lineHeight: "24px",
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
						gap: 2,
					}}
				>
					<Notifications notifications={notifications} />
					<NavUser user={user} />
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

function timeAgo(date: Date | null | undefined): string {
	if (!date) return "";

	const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

	if (seconds < 60) return `${seconds} seconds ago`;

	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

	const days = Math.floor(hours / 24);
	if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

	const weeks = Math.floor(days / 7);
	if (weeks < 4) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;

	const months = Math.floor(days / 30);
	if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;

	const years = Math.floor(days / 365);
	return `${years} year${years === 1 ? "" : "s"} ago`;
}

function Notifications({
	notifications,
}: {
	notifications: NotificationItem[];
}) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [showGroupInvite, setShowGroupInvite] = useState(false);
	const [activeNotification, setActiveNotification] =
		useState<NotificationItem | null>(null);

	const unread = notifications.filter((n) => !n.readAt);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	return (
		<>
			<Box>
				<Badge
					badgeContent={unread.length}
					onClick={handleClick}
					color="primary"
					sx={{ cursor: "pointer" }}
				>
					<NotificationsOutlinedIcon />
				</Badge>
			</Box>
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
							<Typography sx={{ p: 2 }} variant="body2" color="text.secondary">
								You're all caught up! 🎉
							</Typography>
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
										<Avatar alt="ICSSC" src="/icssc-logo.svg" />
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
											onClick={() => {
												setActiveNotification(notif);
												setShowGroupInvite(true);
											}}
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
				<Avatar sx={{ width: 32, height: 32 }}>
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
					onClick={() => {
						setAnchorEl(null);
						logoutAction();
					}}
				>
					Log out
				</MenuItem>
			</Menu>
		</>
	);
}
