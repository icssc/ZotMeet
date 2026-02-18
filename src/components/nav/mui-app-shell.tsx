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
			{!isMobile && <MuiDrawer user={user} />}

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					width: "100%",
					pb: isMobile ? 8 : 0,
				}}
			>
				{children}
			</Box>
			{isMobile && <MuiBottomNav />}
		</Box>
	);
}
