"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import type { UserProfile } from "@/lib/auth/user";
import { MuiBottomNav } from "./mui-bottom-nav";
import { MuiDrawer } from "./mui-drawer";

type MuiAppShellProps = {
	user: UserProfile | null;
	children: React.ReactNode;
};

export function MuiAppShell({ user, children }: MuiAppShellProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	return (
		<Box sx={{ display: "flex", minHeight: "100vh" }}>
			{/* Desktop: Show Drawer */}
			{!isMobile && <MuiDrawer user={user} />}

			{/* Main Content */}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					width: "100%",
					pb: isMobile ? 8 : 0, // Add padding bottom for mobile nav
				}}
			>
				{children}
			</Box>

			{/* Mobile: Show Bottom Navigation */}
			{isMobile && <MuiBottomNav />}
		</Box>
	);
}
