"use client";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import { logoutAction } from "@/server/actions/auth/logout/action";

export type ProfileTab = "edit-profile" | "notifications";

const NAV_ITEMS: {
	id: ProfileTab;
	label: string;
	icon: React.ReactNode;
}[] = [
	{
		id: "edit-profile",
		label: "Edit Profile",
		icon: <PersonOutlineIcon />,
	},
	{
		id: "notifications",
		label: "Notifications",
		icon: <NotificationsOutlinedIcon />,
	},
];

interface ProfileSidebarLayoutProps {
	children: Record<ProfileTab, React.ReactNode>;
}

export function ProfileSidebarLayout({ children }: ProfileSidebarLayoutProps) {
	const [activeTab, setActiveTab] = useState<ProfileTab>("edit-profile");

	return (
		<Box sx={{ display: "flex", minHeight: "calc(100vh - 80px)" }}>
			<Box
				sx={{
					width: 260,
					flexShrink: 0,
					display: { xs: "none", md: "flex" },
					flexDirection: "column",
					borderRight: 1,
					borderColor: "divider",
					bgcolor: "background.paper",
				}}
			>
				<List sx={{ flex: 1, pt: 2 }}>
					{NAV_ITEMS.map((item) => (
						<ListItemButton
							key={item.id}
							selected={activeTab === item.id}
							onClick={() => setActiveTab(item.id)}
							sx={{
								py: 1.5,
								px: 3,
								"&.Mui-selected": {
									bgcolor: "primary.light",
									"& .MuiListItemIcon-root": {
										color: "primary.main",
									},
									"& .MuiListItemText-primary": {
										fontWeight: 600,
									},
								},
								"&.Mui-selected:hover": {
									bgcolor: "primary.light",
								},
							}}
						>
							<ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
							<ListItemText
								primary={item.label}
								primaryTypographyProps={{ fontSize: "0.95rem" }}
							/>
							<ChevronRightIcon
								fontSize="small"
								sx={{ color: "text.secondary" }}
							/>
						</ListItemButton>
					))}
				</List>

				<Divider />

				<List>
					<ListItemButton
						onClick={() => logoutAction()}
						sx={{ py: 1.5, px: 3 }}
					>
						<ListItemIcon sx={{ minWidth: 40, color: "primary.main" }}>
							<LogoutIcon />
						</ListItemIcon>
						<ListItemText
							primary="Log out"
							primaryTypographyProps={{
								color: "primary.main",
								fontWeight: 600,
								fontSize: "0.95rem",
							}}
						/>
					</ListItemButton>
				</List>
			</Box>

			<Box sx={{ flex: 1, p: 4, overflow: "auto" }}>{children[activeTab]}</Box>
		</Box>
	);
}
