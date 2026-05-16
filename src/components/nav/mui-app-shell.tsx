"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import { usePathname } from "next/navigation";
import type { NotificationItem, UserProfile } from "@/lib/auth/user";
import { MuiBottomNav } from "./mui-bottom-nav";
import { MuiTopNav } from "./mui-top-nav";

type MuiAppShellProps = {
	user: UserProfile | null;
	notifications: NotificationItem[];
	children: React.ReactNode;
};

/** Routes that render a custom bottom bar (e.g. mobile island) instead of MUI bottom nav. */
function routeHidesBottomNav(pathname: string) {
	return pathname.startsWith("/availability");
}

export function MuiAppShell({
	user,
	notifications,
	children,
}: MuiAppShellProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const pathname = usePathname();
	const showBottomNav = !routeHidesBottomNav(pathname);

	return (
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
	);
}
