import { Login } from "@mui/icons-material";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import Image from "next/image";
import { loginPathWithReturnTo } from "@/lib/auth/return-to";
import { APP_NAME } from "@/lib/pwa-config.mjs";
import { type LandingNavLink, LandingNavMenu } from "./landing-nav-menu";

const LOGO_SIZE = 40;
const WORDMARK_OFFSET = LOGO_SIZE * 0.064;

const sectionLinks: LandingNavLink[] = [
	{ title: "Features", href: "#how-it-works" },
	{ title: "Meet the Team", href: "#team" },
];

export function LandingNav() {
	return (
		<AppBar
			position="sticky"
			elevation={0}
			sx={{
				backgroundColor: "background.paper",
				color: "text.primary",
				borderBottom: 1,
				borderColor: "divider",
			}}
		>
			<Toolbar disableGutters sx={{ gap: 2 }}>
				<Box sx={{ flex: 1, display: "flex" }}>
					<Box component="a" href="/" className="ml-8 flex items-center gap-2">
						<Image
							src="/zotmeet-logo.svg"
							alt=""
							width={LOGO_SIZE}
							height={LOGO_SIZE}
							priority
						/>
						<Typography
							variant="h6"
							component="span"
							fontWeight={700}
							sx={{ position: "relative", top: WORDMARK_OFFSET }}
						>
							{APP_NAME}
						</Typography>
					</Box>
				</Box>

				<div className="hidden items-center justify-center gap-2 sm:flex">
					{sectionLinks.map((link) => (
						<Button key={link.href} href={link.href} variant="outlined">
							{link.title}
						</Button>
					))}
				</div>

				<div className="mr-8 flex flex-1 items-center justify-end gap-2">
					<Button
						variant="contained"
						href={loginPathWithReturnTo("/")}
						startIcon={<Login />}
					>
						Sign in
					</Button>
					<LandingNavMenu links={sectionLinks} />
				</div>
			</Toolbar>
		</AppBar>
	);
}
