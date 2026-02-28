"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import {
	MuiSidebarInset,
	MuiSidebarProvider,
} from "@/components/ui/mui/sidebar";
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
		<MuiSidebarProvider>
			<Box sx={{ display: "flex", minHeight: "100vh" }}>
				{!isMobile && <MuiDrawer user={user} />}

				<MuiSidebarInset sx={{ pb: isMobile ? 8 : 0 }}>
					{children}
				</MuiSidebarInset>

				{isMobile && <MuiBottomNav />}
			</Box>
		</MuiSidebarProvider>
	);
}
