import { Login } from "@mui/icons-material";
import {
	AppBar,
	Box,
	Button,
	Container,
	Toolbar,
	Typography,
} from "@mui/material";
import Image from "next/image";
import { loginPathWithReturnTo } from "@/lib/auth/return-to";
import { APP_NAME } from "@/lib/pwa-config.mjs";

const LOGO_SIZE = 40;

const WORDMARK_OFFSET = LOGO_SIZE * 0.064;

const sectionLinks = [
	{ title: "Features", href: "/features" },
	{ title: "Meet the Team", href: "/team" },
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
			<Container maxWidth="lg">
				<Toolbar disableGutters sx={{ gap: 2 }}>
					<Box sx={{ flex: 1, display: "flex" }}>
						<Box component="a" href="/" className="flex items-center gap-2">
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

					<Box
						component="nav"
						sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}
					>
						{sectionLinks.map((link) => (
							<Button key={link.href} href={link.href} variant="outlined">
								{link.title}
							</Button>
						))}
					</Box>

					<Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
						<Button
							variant="contained"
							href={loginPathWithReturnTo("/")}
							startIcon={<Login />}
						>
							Sign in
						</Button>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
