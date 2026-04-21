"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import { usePathname } from "next/navigation";
import type { NotificationItem, UserProfile } from "@/lib/auth/user";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";
import { MuiBottomNav } from "./mui-bottom-nav";
import { MuiTopNav } from "./mui-top-nav";

type MuiAppShellProps = {
	user: UserProfile | null;
	notifications: NotificationItem[];
	children: React.ReactNode;
};

export function MuiAppShell({
	user,
	notifications,
	children,
}: MuiAppShellProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const pathname = usePathname();
	const availabilityView = useAvailabilityStore(
		(state) => state.availabilityView,
	);
	const hideBottomNavWhileAddingAvailability =
		pathname.startsWith("/availability/") && availabilityView === "personal";
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
					paddingBottom:
						isMobile && !hideBottomNavWhileAddingAvailability ? 7 : 0,
				}}
			>
				{children}
			</Box>
			{isMobile && !hideBottomNavWhileAddingAvailability && (
				<MuiBottomNav user={user} />
			)}
		</Box>
	);
}
