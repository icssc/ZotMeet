"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import type { UserProfile } from "@/lib/auth/user";
import { MuiBottomNav } from "./mui-bottom-nav";
import { MuiTopNav } from "./mui-top-nav";

type MuiAppShellProps = {
	user: UserProfile | null;
	children: React.ReactNode;
};

export function MuiAppShell({ user, children }: MuiAppShellProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	console.log(theme);
	return (
		<Box sx={{ display: "flex", flexDirection: "column", minHeight: "42px" }}>
			{!isMobile && <MuiTopNav user={user} />}
			<Box sx={{ flex: 1, overflow: "auto", paddingBottom: isMobile ? 7 : 0 }}>
				{children}
			</Box>
			{isMobile && <MuiBottomNav />}
		</Box>
	);
}
