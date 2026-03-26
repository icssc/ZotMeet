"use client";

import {
	AddCircleOutline,
	CalendarMonth,
	Groups,
	Login,
	Person,
} from "@mui/icons-material";
import {
	AppBar,
	Avatar,
	Box,
	Button,
	Menu,
	MenuItem,
	Toolbar,
	Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { UserProfile } from "@/lib/auth/user";
import { logoutAction } from "@/server/actions/auth/logout/action";

const navItems = [
	{ title: "Meetings", url: "/summary" },
	{ title: "Groups", url: "/groups" },
	//{ title: "Rooms", url: "/rooms" },
];

type MuiTopNavProps = {
	user: UserProfile | null;
};

export function MuiTopNav({ user }: MuiTopNavProps) {
	const pathname = usePathname();

	return (
		<AppBar
			position="sticky"
			sx={{
				backgroundColor: "#fff",
				color: "#000",
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
									textTransform: "none",
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
					<NavUser user={user} />
				</Box>
			</Toolbar>
		</AppBar>
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
					textTransform: "none",
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
