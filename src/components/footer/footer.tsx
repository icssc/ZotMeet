"use client";

import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import RedditIcon from "@mui/icons-material/Reddit";
import {
	Box,
	Button,
	IconButton,
	Link,
	Typography,
	useTheme,
} from "@mui/material";
import Image from "next/image";

const iconSocialLinks = [
	{
		icon: InstagramIcon,
		href: "https://www.instagram.com/icssc.uci",
		label: "Instagram",
	},
	{
		icon: GitHubIcon,
		href: "https://github.com/icssc/ZotMeet",
		label: "GitHub",
	},
	{
		icon: LinkedInIcon,
		href: "https://www.linkedin.com/company/uci-icssc",
		label: "LinkedIn",
	},
	{
		icon: RedditIcon,
		href: "https://www.reddit.com/user/icsscprojects/",
		label: "Reddit",
	},
];

const pageLinks = [
	{ label: "Meetings", href: "/summary" },
	{ label: "Groups", href: "/groups" },
	{ label: "Rooms", href: "/studyrooms" },
];

export function Footer() {
	const theme = useTheme();
	const isDark = theme.palette.mode === "dark";

	const iconRow = (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				gap: 0.5,
				mb: 4,
				position: "relative",
				top: 40,
			}}
		>
			{iconSocialLinks.map(({ icon: Icon, href, label }) => (
				<IconButton
					key={label}
					component={Link}
					href={href}
					target="_blank"
					rel="noopener"
					aria-label={label}
					sx={{
						color: "secondary.contrastText",
						borderRadius: 1,
					}}
				>
					<Icon fontSize="small" sx={{ color: "common.white" }} />
				</IconButton>
			))}

			<IconButton
				component={Link}
				href="https://discord.com/invite/QenncaKuQ"
				target="_blank"
				rel="noopener"
				aria-label="Discord"
				sx={{
					borderRadius: 1.5,
				}}
			>
				<Image
					src="/landing/discord-button.svg"
					alt=""
					width={20}
					height={20}
					style={{ filter: "brightness(0) invert(1)" }}
				/>
			</IconButton>
		</Box>
	);

	const logoLockup = (fontSize: string, iconSize: number) => (
		<Box
			sx={{
				display: "flex",
				alignItems: "flex-end",
				gap: 2,
				ml: { xs: -3, md: -6 },
				mb: { xs: -2, md: -2 },
			}}
		>
			<Image
				src="/icon.svg"
				alt=""
				width={iconSize}
				height={iconSize}
				style={{ filter: isDark ? "none" : "brightness(0) invert(1)" }}
			/>
			<Typography
				sx={{
					color: (theme) =>
						theme.palette.mode === "dark"
							? theme.palette.primary.main
							: theme.palette.common.white,
					fontWeight: 575,
					fontSize: { xs: "3rem", md: "7rem" },
					lineHeight: 1,
				}}
			>
				ZotMeet
			</Typography>
		</Box>
	);

	const pagesLinks = (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: { xs: "flex-end", md: "flex-end" },
				gap: 0.25,
			}}
		>
			{pageLinks.map(({ label, href }) => (
				<Link
					key={href}
					href={href}
					underline="hover"
					sx={{ color: "secondary.contrastText", fontSize: "0.825rem" }}
				>
					{label}
				</Link>
			))}
		</Box>
	);

	const submitButton = (
		<Button
			variant="contained"
			size="small"
			href="https://docs.google.com/forms/d/e/1FAIpQLSc8OLzVQPfoeaGb1vfXBlVPoR1HVGIvUl4t0eNMN3pbi4er0Q/viewform"
			target="_blank"
			rel="noopener"
			sx={{
				bgcolor: "common.white",
				color: "common.black",
				boxShadow: (theme) =>
					isDark
						? "0 4px 0 0 rgba(0,0,0,0.15), 0 4px 0 0 #000000"
						: "0 4px 0 0 rgba(0,0,0,0.15), 0 4px 0 0 " +
							theme.palette.primary.main,
				"&:hover": {
					boxShadow: (theme) =>
						isDark
							? "0 2px 0 0 rgba(0,0,0,0.15), 0 2px 0 0 "
							: "0 2px 0 0 rgba(0,0,0,0.15), 0 2px 0 0 " +
								theme.palette.primary.main,
					bgcolor: "grey.100",
				},
			}}
		>
			Submit Feedback
		</Button>
	);

	return (
		<Box
			component="footer"
			position="relative"
			sx={{
				overflow: "hidden",
				px: { xs: 3, md: 6 },
				py: { xs: 2, md: 2 },
				color: "secondary.contrastText",
				background: (theme) => {
					if (isDark) {
						return `linear-gradient(180deg, 
                                    ${theme.palette.background.default} 0%, 
                                    ${theme.palette.background.paper} 20%,
                                    ${theme.palette.background.paper} 100%)`;
					} else {
						return `linear-gradient(180deg, 
                                    ${theme.palette.background.default} 0%,
                                    ${theme.palette.primary.light} 15%,
                                    ${theme.palette.primary.main} 90%,
                                    ${theme.palette.primary.main} 100%)`;
					}
				},
			}}
		>
			{iconRow}

			{/* mobile layout*/}
			<Box sx={{ display: { xs: "block", md: "none" } }}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						mb: 3,
					}}
				>
					<Box sx={{ mt: 5 }}>{submitButton}</Box>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-end",
							gap: 1,
							mt: 5,
						}}
					>
						<Typography variant="subtitle1" fontWeight={700}>
							Pages
						</Typography>
						{pagesLinks}
					</Box>
				</Box>
				{logoLockup("3rem", 60)}
			</Box>

			{/* desktop */}
			<Box
				sx={{
					display: { xs: "none", md: "flex" },
					alignItems: "flex-end",
					justifyContent: "space-between",
					gap: 3,
				}}
			>
				<Box sx={{}}>{logoLockup("7rem", 150)}</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-end",
						gap: 1,
						pr: 4,
						mb: 2,
					}}
				>
					<Typography variant="subtitle1" fontWeight={700}>
						Pages
					</Typography>
					{pagesLinks}
					<Box sx={{ mt: 2 }}>{submitButton}</Box>
				</Box>
			</Box>
		</Box>
	);
}
