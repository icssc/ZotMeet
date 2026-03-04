"use client";

import {
	AddCircleOutline,
	CalendarMonth,
	Groups,
	Login,
	Person,
} from "@mui/icons-material";
import { Avatar, Box, Menu, MenuItem, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
	MuiSidebar,
	MuiSidebarContent,
	MuiSidebarFooter,
	MuiSidebarHeader,
	MuiSidebarMenu,
	MuiSidebarMenuButton,
	MuiSidebarMenuIcon,
	MuiSidebarMenuItem,
	MuiSidebarMenuText,
	MuiSidebarSeparator,
	useMuiSidebar,
} from "@/components/ui/mui/sidebar";
import type { UserProfile } from "@/lib/auth/user";
import { logoutAction } from "@/server/actions/auth/logout/action";

const navItems = [
	{ title: "New Meeting", url: "/", icon: AddCircleOutline },
	{ title: "Summary", url: "/summary", icon: CalendarMonth },
	{ title: "Groups", url: "/groups", icon: Groups },
];

type MuiDrawerProps = {
	user: UserProfile | null;
};

export function MuiDrawer({ user }: MuiDrawerProps) {
	return (
		<MuiSidebar>
			<MuiSidebarHeader>
				<SidebarLogo />
			</MuiSidebarHeader>

			<MuiSidebarSeparator />

			<MuiSidebarContent>
				<NavMain />
			</MuiSidebarContent>

			<MuiSidebarFooter>
				<NavUser user={user} />
			</MuiSidebarFooter>
		</MuiSidebar>
	);
}

function SidebarLogo() {
	const { open } = useMuiSidebar();

	return (
		<>
			<Box
				sx={{
					position: "relative",
					width: 40,
					height: 40,
					flexShrink: 0,
					border: 1,
					borderColor: "divider",
					borderRadius: 1,
				}}
			>
				<Image src="/ZotMeet_BLACK.png" fill alt="ZotMeet logo" />
			</Box>
			<Typography
				variant="h4"
				fontWeight={600}
				noWrap
				sx={{
					opacity: open ? 1 : 0,
					transition: "opacity 0.2s ease-in-out",
				}}
			>
				ZotMeet
			</Typography>
		</>
	);
}

function NavMain() {
	const pathname = usePathname();

	return (
		<MuiSidebarMenu>
			{navItems.map((item) => {
				const Icon = item.icon;

				return (
					<MuiSidebarMenuItem key={item.title}>
						<MuiSidebarMenuButton
							component={Link}
							href={item.url}
							selected={pathname === item.url}
							tooltip={item.title}
						>
							<MuiSidebarMenuIcon>
								<Icon />
							</MuiSidebarMenuIcon>
							<MuiSidebarMenuText primary={item.title} />
						</MuiSidebarMenuButton>
					</MuiSidebarMenuItem>
				);
			})}
		</MuiSidebarMenu>
	);
}

function NavUser({ user }: { user: UserProfile | null }) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	if (!user) {
		return (
			<MuiSidebarMenuItem>
				<MuiSidebarMenuButton
					component="a"
					href="/auth/login/google"
					tooltip="Sign In"
				>
					<MuiSidebarMenuIcon>
						<Login />
					</MuiSidebarMenuIcon>
					<MuiSidebarMenuText primary="Sign In" />
				</MuiSidebarMenuButton>
			</MuiSidebarMenuItem>
		);
	}

	return (
		<>
			<MuiSidebarMenuItem>
				<MuiSidebarMenuButton onClick={(e) => setAnchorEl(e.currentTarget)}>
					<MuiSidebarMenuIcon>
						<Avatar sx={{ width: 24, height: 24 }}>
							<Person fontSize="small" />
						</Avatar>
					</MuiSidebarMenuIcon>
					<MuiSidebarMenuText
						primary={user.displayName}
						secondary={user.email}
						primaryTypographyProps={{ fontWeight: 600, noWrap: true }}
						secondaryTypographyProps={{ noWrap: true }}
					/>
				</MuiSidebarMenuButton>
			</MuiSidebarMenuItem>

			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={() => setAnchorEl(null)}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
				transformOrigin={{ vertical: "bottom", horizontal: "left" }}
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
