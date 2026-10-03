"use client";

import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import RedditIcon from "@mui/icons-material/Reddit";
import { Box, Button, IconButton, Link, Typography } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import { cn } from "@/lib/utils";

const socialLinks = [
	{
		label: "Instagram",
		href: "https://www.instagram.com/icssc.uci",
		icon: <InstagramIcon />,
	},
	{
		label: "GitHub",
		href: "https://github.com/icssc/ZotMeet",
		icon: <GitHubIcon />,
	},
	{
		label: "LinkedIn",
		href: "https://www.linkedin.com/company/uci-icssc",
		icon: <LinkedInIcon />,
	},
	{
		label: "Reddit",
		href: "https://www.reddit.com/user/icsscprojects/",
		icon: <RedditIcon />,
	},
	{
		label: "Discord",
		href: "https://discord.com/invite/QenncaKuQ",
		icon: (
			<Image
				src="/landing/discord-button.svg"
				alt=""
				width={24}
				height={24}
				className="brightness-0 invert"
			/>
		),
	},
];

const pageLinks = [
	{ label: "Meetings", href: "/summary" },
	{ label: "Groups", href: "/groups" },
	{ label: "Rooms", href: "/studyrooms" },
];

const FEEDBACK_FORM_URL =
	"https://docs.google.com/forms/d/e/1FAIpQLSc8OLzVQPfoeaGb1vfXBlVPoR1HVGIvUl4t0eNMN3pbi4er0Q/viewform";

function SocialLinks() {
	return (
		<div className="mt-10 flex items-center justify-center gap-1">
			{socialLinks.map(({ label, href, icon }) => (
				<IconButton
					key={label}
					href={href}
					target="_blank"
					rel="noopener"
					aria-label={label}
					color="inherit"
					sx={{ borderRadius: 1 }}
				>
					{icon}
				</IconButton>
			))}
		</div>
	);
}

function PageLinks() {
	return (
		<div className="flex flex-col items-end gap-1">
			<Typography variant="subtitle1" fontWeight={700}>
				Pages
			</Typography>
			<div className="flex flex-col items-end gap-0.5">
				{pageLinks.map(({ label, href }) => (
					<Link
						key={href}
						component={NextLink}
						href={href}
						variant="body2"
						color="inherit"
						underline="hover"
					>
						{label}
					</Link>
				))}
			</div>
		</div>
	);
}

function FeedbackButton() {
	return (
		<Button
			variant="contained"
			size="small"
			href={FEEDBACK_FORM_URL}
			target="_blank"
			rel="noopener"
			sx={(theme) => {
				const isDark = theme.palette.mode === "dark";
				const black = theme.palette.common.black;
				return {
					bgcolor: "common.white",
					color: "common.black",
					...(isDark && {
						boxShadow: `0 4px 0 0 rgba(0,0,0,0.15), 0 4px 0 0 ${black}`,
					}),
					"&:hover": {
						bgcolor: "grey.100",
						...(isDark && {
							boxShadow: `0 2px 0 0 rgba(0,0,0,0.15), 0 2px 0 0 ${black}`,
						}),
					},
				};
			}}
		>
			Submit Feedback
		</Button>
	);
}

/** Icon + wordmark, pulled into the footer's bottom-left corner. */
function Logo({ large }: { large?: boolean }) {
	return (
		<div className="-mb-4 -ml-6 flex items-end gap-4 md:-ml-12">
			<Image
				src="/icon.svg"
				alt=""
				width={large ? 150 : 60}
				height={large ? 150 : 60}
				className="brightness-0 invert dark:filter-none"
			/>
			<span
				className={cn(
					"font-[575] leading-none dark:text-primary",
					large ? "text-[7rem]" : "text-[3rem]",
				)}
			>
				ZotMeet
			</span>
		</div>
	);
}

/** Site footer. Where it shows is decided by the app shell (`mui-app-shell.tsx`). */
export function Footer({ className }: { className?: string }) {
	return (
		<Box
			component="footer"
			className={cn(
				"relative overflow-hidden px-6 py-4 text-secondary-main-foreground md:px-12",
				className,
			)}
			sx={(theme) => {
				const { background, primary } = theme.palette;
				return {
					background:
						theme.palette.mode === "dark"
							? `linear-gradient(180deg, ${background.default} 0%, ${background.paper} 20%)`
							: `linear-gradient(180deg, ${background.default} 0%, ${primary.light} 15%, ${primary.main} 90%)`,
				};
			}}
		>
			<SocialLinks />

			{/* Phone: button and pages side by side, logo underneath. */}
			<div className="md:hidden">
				<div className="mt-8 mb-6 flex items-start justify-between">
					<FeedbackButton />
					<PageLinks />
				</div>
				<Logo />
			</div>

			{/* Desktop: logo on the left, pages and button stacked on the right. */}
			<div className="hidden items-end justify-between gap-6 md:flex">
				<Logo large />
				<div className="mb-4 flex flex-col items-end gap-6 pr-8">
					<PageLinks />
					<FeedbackButton />
				</div>
			</div>
		</Box>
	);
}
