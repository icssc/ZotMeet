"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
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

/** Width of the gray gutter on the top and right of the white panel (in px). */
const GUTTER_SIZE = 16;

/** Width of the vertical rail that holds the logo on desktop (in px). */
const LOGO_RAIL_WIDTH = 72;

/** Height of the MUI AppBar toolbar on desktop (in px). */
const TOOLBAR_HEIGHT = 64;

/** Rendered size of the ZotMeet logo in the left rail (in px). */
const LOGO_SIZE = 40;

/**
 * Top padding on the logo rail so the logo's vertical center lines up with
 * the top nav bar inside the white panel. Equal to the top gutter plus half
 * of the leftover space in the toolbar above/below the logo.
 */
const LOGO_RAIL_TOP_PADDING = GUTTER_SIZE + (TOOLBAR_HEIGHT - LOGO_SIZE) / 2;

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

	// Mobile layout: no gutter / rail — the app surface fills the viewport and
	// each page renders its own in-page header.
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

	// Desktop layout: a left logo rail sits in the gray gutter, and the main
	// content lives inside a white panel with rounded top corners — matching
	// the Figma dashboard spec. The Footer continues to span the full page
	// below the panel so its own gradient still reaches both edges.
	return (
		<Box
			sx={{
				color: "text.primary",
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
			}}
		>
			<Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
				{/* Left rail with the ZotMeet logo, sitting in the gray gutter.
				    The top padding aligns the logo's center with the nav bar
				    inside the white panel. */}
				<Box
					sx={{
						width: LOGO_RAIL_WIDTH,
						flexShrink: 0,
						display: "flex",
						justifyContent: "center",
						alignItems: "flex-start",
						pt: `${LOGO_RAIL_TOP_PADDING}px`,
					}}
				>
					<Link href="/" aria-label="ZotMeet home">
						<Image
							src="/zotmeet-logo.svg"
							alt="ZotMeet logo"
							width={LOGO_SIZE}
							height={LOGO_SIZE}
						/>
					</Link>
				</Box>

				{/* Right side: top + right gutters + white panel with rounded top
				    corners, so the panel has symmetric margins against the body
				    gradient. */}
				<Box
					sx={{
						flex: 1,
						minWidth: 0,
						display: "flex",
						flexDirection: "column",
						pt: `${GUTTER_SIZE}px`,
						pr: `${GUTTER_SIZE}px`,
					}}
				>
					<Box
						className={footer.aboveFooter}
						sx={{
							// `background.paper` is pure white in this theme, while
							// `background.default` is gray — we want the whole panel
							// (nav + content) to read as one continuous white card.
							bgcolor: "background.paper",
							flex: 1,
							display: "flex",
							flexDirection: "column",
							borderTopLeftRadius: 12,
							borderTopRightRadius: 12,
							overflow: "hidden",
						}}
					>
						<MuiTopNav user={user} notifications={notifications} />
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
				</Box>
			</Box>

			<Footer className={footer.footer} />
		</Box>
	);
}
