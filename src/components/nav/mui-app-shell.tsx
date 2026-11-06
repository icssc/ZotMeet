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

/** Routes that build their own panels on the gray background instead of one big white panel. */
function routeSkipsEncapsulationPanel(pathname: string) {
	return (
		pathname.startsWith("/availability") || pathname.startsWith("/studyrooms")
	);
}

function footerClasses(pathname: string) {
	return pathname === "/"
		? { footer: undefined, aboveFooter: "min-h-screen" }
		: { footer: "hidden lg:block", aboveFooter: "lg:min-h-screen" };
}

const GUTTER_SIZE = 16;

export function MuiAppShell({
	user,
	notifications,
	children,
}: MuiAppShellProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const pathname = usePathname();
	const showBottomNav = !routeHidesBottomNav(pathname);
	const skipEncapsulationPanel = routeSkipsEncapsulationPanel(pathname);
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

	if (isMobile) {
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
				<Box
					className={footer.aboveFooter}
					sx={{
						flex: 1,
						overflow: "auto",
						paddingBottom: showBottomNav ? 7 : "40px",
					}}
				>
					{children}
				</Box>

				<Footer className={footer.footer} />
				{showBottomNav && <MuiBottomNav user={user} />}
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
			<MuiTopNav user={user} notifications={notifications} />

			<Box
				sx={{
					flex: 1,
					minWidth: 0,
					minHeight: 0,
					display: "flex",
					flexDirection: "column",
					pl: `${GUTTER_SIZE}px`,
					pr: `${GUTTER_SIZE}px`,
				}}
			>
				{skipEncapsulationPanel ? (
					<Box
						className={footer.aboveFooter}
						sx={{ flex: 1, overflow: "auto", paddingBottom: "40px" }}
					>
						{children}
					</Box>
				) : (
					<Box
						className={footer.aboveFooter}
						sx={{
							bgcolor: "background.paper",
							flex: 1,
							display: "flex",
							flexDirection: "column",
							borderTopLeftRadius: 12,
							borderTopRightRadius: 12,
							borderBottomLeftRadius: 12,
							borderBottomRightRadius: 12,
							overflow: "hidden",
						}}
					>
						<Box
							sx={{
								flex: 1,
								overflow: "auto",
								paddingBottom: "40px",
							}}
						>
							{children}
						</Box>
					</Box>
				)}
			</Box>

			<Footer className={footer.footer} />
		</Box>
	);
}
