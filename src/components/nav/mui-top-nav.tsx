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
import { Roboto } from "next/font/google";
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

export const roboto = Roboto({
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "500", "600", "700"],
});

type MuiTopNavProps = {
	user: UserProfile | null;
};

export function MuiTopNav({ user }: MuiTopNavProps) {
	const pathname = usePathname();

	return (
		<AppBar position="static" sx={{ backgroundColor: "#fff", color: "#000" }}>
			<Toolbar
				sx={{
					display: "flex",
					alignItems: "center",
				}}
			>
				{/* LEFT */}
				<Box
					sx={{
						flex: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-start",
					}}
				>
					<Box
						sx={{
							position: "relative",
							width: 78,
							height: 46,
						}}
					>
						<Image src="/new_zotmeet_logo.png" fill alt="ZotMeet logo" />
					</Box>
				</Box>

				{/* CENTER */}
				<Box
					sx={{
						flex: 1,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						gap: 3,
					}}
				>
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
									fontWeight: 400,
									fontSize: "18px", // Title Large
									lineHeight: "24px",
									fontFamily: roboto.style.fontFamily,
									borderBottom: isActive ? "2px solid" : "none",
									borderColor: "text.primary",
									"&:hover": {
										backgroundColor: "action.hover",
										borderBottom: "2px solid",
									},
								}}
							>
								{item.title}
							</Button>
						);
					})}
				</Box>

				{/* RIGHT */}
				<Box
					sx={{
						flex: 1,
						display: "flex",
						justifyContent: "flex-end",
						alignItems: "center",
						gap: 2,
					}}
				>
					<Button
						component={Link}
						href="/"
						variant="contained"
						sx={{
							textTransform: "none",
							color: "white",
							backgroundColor: "black",
							fontWeight: 400,
							lineHeight: "24px",
							fontFamily: roboto.style.fontFamily,
							"&:hover": {
								backgroundColor: "grey",
							},
						}}
					>
						Create Meeting
					</Button>

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
