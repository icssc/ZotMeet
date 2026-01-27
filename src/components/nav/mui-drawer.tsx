"use client";

import {
	AddCircleOutline,
	CalendarMonth,
	Groups,
	Person,
} from "@mui/icons-material";
import {
	Avatar,
	Box,
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AuthDialog } from "@/components/auth/auth-dialog";
import type { UserProfile } from "@/lib/auth/user";
import { logoutAction } from "@/server/actions/auth/logout/action";

const drawerWidth = 240;
const miniDrawerWidth = 72;

const navItems = [
	{ title: "New Meeting", url: "/", icon: AddCircleOutline },
	{ title: "Summary", url: "/summary", icon: CalendarMonth },
	{ title: "Groups", url: "/groups", icon: Groups },
];

type MuiDrawerProps = {
	user: UserProfile | null;
};

export function MuiDrawer({ user }: MuiDrawerProps) {
	const [open, setOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const pathname = usePathname();
	const menuOpen = Boolean(anchorEl);

	const handleUserMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleUserMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		handleUserMenuClose();
		logoutAction();
	};

	return (
		<Drawer
			variant="permanent"
			sx={{
				width: open ? drawerWidth : miniDrawerWidth,
				flexShrink: 0,
				"& .MuiDrawer-paper": {
					width: open ? drawerWidth : miniDrawerWidth,
					boxSizing: "border-box",
					transition: "width 0.2s",
					overflowX: "hidden",
					background: "linear-gradient(to top left, #EEEEEE, #EAEFF2)",
					borderRight: "none",
				},
			}}
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
		>
			{/* Logo Header */}
			<Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
				<Box
					sx={{
						position: "relative",
						width: 40,
						height: 40,
						flexShrink: 0,
						border: "1px solid black",
						borderRadius: 1,
					}}
				>
					<Image src="/ZotMeet_BLACK.png" fill alt="ZotMeet logo" />
				</Box>
				{open && (
					<Typography
						variant="h4"
						sx={{
							fontWeight: 600,
							fontSize: "2rem",
							whiteSpace: "nowrap",
						}}
					>
						ZotMeet
					</Typography>
				)}
			</Box>

			<Divider sx={{ bgcolor: "rgba(0, 0, 0, 0.2)", height: 2 }} />

			{/* Navigation Items */}
			<List sx={{ flexGrow: 1, pt: 2 }}>
				{navItems.map((item) => {
					const isActive = pathname === item.url;
					const Icon = item.icon;

					return (
						<ListItem key={item.title} disablePadding sx={{ px: 1 }}>
							<ListItemButton
								component={Link}
								href={item.url}
								selected={isActive}
								sx={{
									borderRadius: 3,
									minHeight: 48,
									px: 2,
									justifyContent: open ? "initial" : "center",
									"&.Mui-selected": {
										bgcolor: "rgba(0, 0, 0, 0.08)",
									},
									"&:hover": {
										bgcolor: "rgba(0, 0, 0, 0.12)",
									},
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										mr: open ? 3 : "auto",
										justifyContent: "center",
										color: "rgba(0, 0, 0, 0.6)",
									}}
								>
									<Icon />
								</ListItemIcon>
								{open && (
									<ListItemText
										primary={item.title}
										primaryTypographyProps={{
											fontSize: "1.125rem",
											fontWeight: 500,
										}}
									/>
								)}
							</ListItemButton>
						</ListItem>
					);
				})}
			</List>

			<Box sx={{ p: 1 }}>
				{user ? (
					<>
						<Box
							onClick={handleUserMenuClick}
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 2,
								p: 1.5,
								cursor: "pointer",
								borderRadius: 2,
								"&:hover": {
									bgcolor: "rgba(0, 0, 0, 0.08)",
								},
								justifyContent: open ? "flex-start" : "center",
							}}
						>
							<Avatar
								sx={{
									width: 32,
									height: 32,
									bgcolor: "rgba(0, 0, 0, 0.1)",
									color: "rgba(0, 0, 0, 0.6)",
								}}
							>
								<Person />
							</Avatar>
							{open && (
								<Box sx={{ flexGrow: 1, minWidth: 0 }}>
									<Typography
										variant="body2"
										sx={{
											fontWeight: 600,
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
										}}
									>
										{user.displayName}
									</Typography>
									<Typography
										variant="caption"
										sx={{
											color: "text.secondary",
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
											display: "block",
										}}
									>
										{user.email}
									</Typography>
								</Box>
							)}
						</Box>

						<Menu
							anchorEl={anchorEl}
							open={menuOpen}
							onClose={handleUserMenuClose}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							transformOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
						>
							<MenuItem
								component={Link}
								href="/profile"
								onClick={handleUserMenuClose}
							>
								<Person sx={{ mr: 1 }} /> Profile
							</MenuItem>
							<MenuItem onClick={handleLogout}>Log out</MenuItem>
						</Menu>
					</>
				) : (
					<AuthDialog />
				)}
			</Box>
		</Drawer>
	);
}
