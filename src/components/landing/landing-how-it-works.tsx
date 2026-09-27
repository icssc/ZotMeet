import DateRangeIcon from "@mui/icons-material/DateRange";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Card, Chip, Typography } from "@mui/material";
import type { ElementType } from "react";

interface Step {
	title: string;
	description: string;
	bannerBgColor: string;
	bannerColor: string;
	bannerIcon?: ElementType;
	bannerLabel: string;
	bannerAlign?: "flex-start" | "flex-end";
	video?: string;
}

const steps: Step[] = [
	{
		title: "Connect your calendar",
		description: "Sign in and link your gcal to zotmeet",
		bannerBgColor: "action.selected",
		bannerColor: "primary.contrastText",
		bannerIcon: EditIcon,
		bannerLabel: "Add your availability.",
		video: "/landing/sign-in.mov",
	},
	{
		title: "Add your availability",
		description:
			"Fill out your availability with the calendar overlay or manually.",
		bannerBgColor: "primary.main",
		bannerColor: "primary.contrastText",
		bannerIcon: EditIcon,
		bannerLabel: "Add your availability.",
		video: "/landing/add-availability.mp4",
	},
	{
		title: "Schedule when & where",
		description: "Use your attendee availability and room recommendations.",
		bannerBgColor: "info.main",
		bannerColor: "info.contrastText",
		bannerIcon: DateRangeIcon,
		bannerLabel: "Availability complete. Schedule this meeting.",
		video: "/landing/room-results.mp4",
	},
	{
		title: "Track Upcoming Events",
		description:
			"Your dashboard has easy filters to help you notice the meetings you need.",
		bannerBgColor: "secondary.main",
		bannerColor: "secondary.contrastText",
		bannerLabel: "Scheduled: 2/17, 12:30AM-2PM",
		bannerAlign: "flex-end",
		video: "/landing/dashboard.mp4",
	},
];

function StepCard({ step, index }: { step: Step; index: number }) {
	const Icon = step.bannerIcon;

	return (
		<Card
			elevation={0}
			sx={{
				bgcolor: step.bannerBgColor,
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
				flex: 1,
				minWidth: 0,
			}}
		>
			<Card
				variant="outlined"
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 2,
					flexGrow: 1,
					minHeight: { xs: 160, lg: 300 },
					p: 2.5,
				}}
			>
				<Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
					<Chip label={index + 1} sx={{ flexShrink: 0 }} />
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Typography variant="h6" component="h3">
							{step.title}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{step.description}
						</Typography>
					</Box>
				</Box>
				{step.video && (
					<video
						src={step.video}
						autoPlay
						loop
						muted
						playsInline
						aria-hidden
						className="mx-auto h-auto w-full rounded-lg"
					/>
				)}
			</Card>
			<Box
				sx={{
					px: 2.5,
					py: 1.5,
					display: "flex",
					alignItems: "center",
					justifyContent: step.bannerAlign ?? "flex-start",
					gap: 0.5,
					color: step.bannerColor,
				}}
			>
				{Icon && <Icon sx={{ fontSize: 18, color: "inherit" }} />}
				<Typography
					variant="caption"
					sx={{ color: "inherit", letterSpacing: "0.14px" }}
				>
					{step.bannerLabel}
				</Typography>
			</Box>
		</Card>
	);
}

export function LandingHowItWorks() {
	return (
		<Box
			component="section"
			id="how-it-works"
			className="mx-auto flex max-w-[1600px] scroll-mt-16 flex-col items-center gap-12 px-6 py-16 lg:gap-14 lg:px-16"
		>
			<div className="flex max-w-3xl flex-col items-center gap-5 text-center">
				<Chip
					label="How it Works"
					color="default"
					size="medium"
					variant="outlined"
				/>
				<Typography
					variant="h4"
					component="h2"
					sx={{
						typography: { xs: "h5", sm: "h4" },
						fontWeight: { xs: 600, sm: 600 },
					}}
				>
					<Box component="span" sx={{ color: "primary.main" }}>
						Scheduling
					</Box>{" "}
					syncing and{" "}
					<Box component="span" sx={{ color: "primary.main" }}>
						room
					</Box>{" "}
					booking made simple
				</Typography>
				<Typography variant="body2" color="text.secondary">
					better than when2meet. better than timeful
				</Typography>
			</div>

			<div className="flex w-full flex-col gap-6 md:grid md:grid-cols-2 lg:flex lg:flex-row lg:gap-10">
				{steps.map((step, index) => (
					<StepCard key={step.title} step={step} index={index} />
				))}
			</div>
		</Box>
	);
}
