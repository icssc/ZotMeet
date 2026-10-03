"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer/footer";
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

function footerClasses(pathname: string) {
	return pathname === "/"
		? { footer: undefined, aboveFooter: "min-h-screen" }
		: { footer: "hidden lg:block", aboveFooter: "lg:min-h-screen" };
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
	const footer = footerClasses(pathname);

	// Signed-out visitors on "/" get the landing page, which renders its own nav.
	if (!user && pathname === "/") {
		return (
			<Box
				sx={{
					bgcolor: "background.default",
					color: "text.primary",
					minHeight: "100vh",
				}}
			>
				<Box className={footer.aboveFooter}>{children}</Box>
				<Footer className={footer.footer} />
			</Box>
		);
	}

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
				className={footer.aboveFooter}
				sx={{
					flex: 1,
					overflow: "auto",
					paddingBottom: isMobile && showBottomNav ? 7 : "40px",
				}}
			>
				{children}
			</Box>

			<Footer className={footer.footer} />
			{isMobile && showBottomNav && <MuiBottomNav user={user} />}
		</Box>
	);
}
