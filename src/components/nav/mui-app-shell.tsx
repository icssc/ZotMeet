"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import { createContext, useContext, useState } from "react";
import type { NotificationItem, UserProfile } from "@/lib/auth/user";
import { MuiBottomNav } from "./mui-bottom-nav";
import { MuiTopNav } from "./mui-top-nav";

type MuiAppShellProps = {
	user: UserProfile | null;
	notifications: NotificationItem[];
	children: React.ReactNode;
};

type AppShellUiContextValue = {
	setShowBottomNav: (visible: boolean) => void;
};

const AppShellUiContext = createContext<AppShellUiContextValue | null>(null);

export function useAppShellUi() {
	const context = useContext(AppShellUiContext);
	if (!context) {
		throw new Error("useAppShellUi must be used within MuiAppShell");
	}
	return context;
}

export function MuiAppShell({
	user,
	notifications,
	children,
}: MuiAppShellProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [showBottomNav, setShowBottomNav] = useState(true);
	return (
		<AppShellUiContext.Provider value={{ setShowBottomNav }}>
			<Box
				sx={{
					bgcolor: "background.default",
					color: "text.primary",
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
				}}
			>
				{!isMobile && <MuiTopNav user={user} notifications={notifications} />}
				<Box
					sx={{
						flex: 1,
						overflow: "auto",
						paddingBottom: isMobile && showBottomNav ? 7 : 0,
					}}
				>
					{children}
				</Box>
				{isMobile && showBottomNav && <MuiBottomNav user={user} />}
			</Box>
		</AppShellUiContext.Provider>
	);
}
