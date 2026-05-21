"use client";

import type { SvgIconComponent } from "@mui/icons-material";
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
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { type ReactNode, useState } from "react";
import { logoutAction } from "@/server/actions/auth/logout/action";

export type ProfileTab = "edit-profile" | "notifications";

const NAV_ITEMS: {
	id: ProfileTab;
	label: string;
	Icon: SvgIconComponent;
}[] = [
	{
		id: "edit-profile",
		label: "Edit Profile",
		Icon: PersonOutlineIcon,
	},
	{
		id: "notifications",
		label: "Notifications",
		Icon: NotificationsOutlinedIcon,
	},
];

interface ProfileSidebarLayoutProps {
	panels: Record<ProfileTab, ReactNode>;
}

function isProfileTab(value: unknown): value is ProfileTab {
	return value === "edit-profile" || value === "notifications";
}

export function ProfileSidebarLayout({ panels }: ProfileSidebarLayoutProps) {
	const [activeTab, setActiveTab] = useState<ProfileTab>("edit-profile");

	return (
		<Box
			sx={{
				display: "flex",
				gap: 2,
				minHeight: "calc(100vh - 80px)",
				p: { xs: 2, md: 4 },
			}}
		>
			<Paper
				variant="outlined"
				sx={{
					width: 260,
					flexShrink: 0,
					display: { xs: "none", md: "flex" },
					flexDirection: "column",
					overflow: "hidden",
				}}
			>
				<List sx={{ flex: 1, pt: 1 }}>
					{NAV_ITEMS.map((item) => (
						<ListItemButton
							key={item.id}
							selected={activeTab === item.id}
							onClick={() => setActiveTab(item.id)}
							sx={{
								py: 1.5,
								px: 3,
								"&.Mui-selected": {
									bgcolor: (theme) =>
										theme.palette.mode === "dark"
											? "rgba(242, 100, 137, 0.45)"
											: theme.palette.primary.light,
									"& .MuiListItemIcon-root": {
										color: "primary.main",
									},
									"& .MuiListItemText-primary": {
										fontWeight: 600,
										color: (theme) =>
											theme.palette.mode === "dark"
												? theme.palette.common.white
												: undefined,
									},
								},
								"&.Mui-selected:hover": {
									bgcolor: (theme) =>
										theme.palette.mode === "dark"
											? "rgba(242, 100, 137, 0.55)"
											: theme.palette.primary.light,
								},
								"&:hover": {
									bgcolor: (theme) =>
										theme.palette.mode === "dark"
											? "rgba(242, 100, 137, 0.2)"
											: undefined,
								},
							}}
						>
							<ListItemIcon sx={{ minWidth: 40 }}>
								<item.Icon />
							</ListItemIcon>
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
			</Paper>

			<Paper variant="outlined" sx={{ flex: 1, overflow: "auto" }}>
				<Box
					sx={{
						display: { xs: "block", md: "none" },
						borderBottom: 1,
						borderColor: "divider",
					}}
				>
					<Tabs
						value={activeTab}
						onChange={(_, value) => {
							if (isProfileTab(value)) setActiveTab(value);
						}}
						variant="fullWidth"
					>
						{NAV_ITEMS.map((item) => (
							<Tab
								key={item.id}
								value={item.id}
								label={item.label}
								icon={<item.Icon />}
								iconPosition="start"
							/>
						))}
					</Tabs>
				</Box>
				<Box sx={{ p: 4 }}>{panels[activeTab]}</Box>
			</Paper>
		</Box>
	);
}
