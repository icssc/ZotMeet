import { Box, Button, Chip, Typography } from "@mui/material";
import Image from "next/image";

const GITHUB_URL = "https://github.com/icssc/ZotMeet";

interface TeamMember {
	name: string;
	position: string;
	websiteUrl?: string;
	linkedinUrl?: string;
	githubUrl?: string;
}

const team: TeamMember[] = [
	{ name: "Ethan Chao", position: "Project Lead" },
	{ name: "Kailee Kaocharoen", position: "Design Lead" },
	{ name: "Valerie Hyunh", position: "Design Lead" },
	{ name: "Arshia Aravinthan", position: "Developer" },
	{ name: "Alex Zhuang", position: "Developer" },
	{ name: "Arya Palanivel", position: "Developer" },
	{ name: "Anna Chen", position: "Developer" },
	{ name: "Ethan Tran", position: "Developer" },
	{ name: "Isaac Phoon", position: "Developer" },
	{ name: "Alex Liu", position: "Winter PL 26'" },
	{ name: "Kyle Tran", position: "PL 25'-26'" },
	{ name: "Arya Mhaiskar", position: "Developer 24'-26'" },
];

function SocialLink({
	href,
	icon,
	label,
}: {
	href?: string;
	icon: string;
	label: string;
}) {
	const img = (
		<Image src={icon} alt={href ? label : ""} width={24} height={24} />
	);
	if (!href) return img;
	return (
		<a href={href} target="_blank" rel="noreferrer" aria-label={label}>
			{img}
		</a>
	);
}

function TeamCard({ member }: { member: TeamMember }) {
	return (
		<div className="flex w-[150px] flex-col items-center gap-3 sm:w-[187px]">
			{/* Headshot placeholder until real photos land. */}
			<Box
				sx={{ bgcolor: "grey.300", borderRadius: 2 }}
				className="flex aspect-[187/225] w-full items-center justify-center pt-1.5"
			>
				<Image src="/mascot.svg" alt="" width={111} height={111} />
			</Box>
			<div className="flex w-full flex-col items-center gap-2 text-center">
				<div className="flex w-full flex-col gap-0.5">
					<Typography variant="subtitle1">{member.name}</Typography>
					<Typography variant="body1" color="text.secondary">
						{member.position}
					</Typography>
				</div>
				<div className="flex gap-2">
					<SocialLink
						href={member.websiteUrl}
						icon="/landing/website.svg"
						label={`${member.name}'s website`}
					/>
					<SocialLink
						href={member.linkedinUrl}
						icon="/landing/linkedin.svg"
						label={`${member.name} on LinkedIn`}
					/>
					<SocialLink
						href={member.githubUrl}
						icon="/landing/github.svg"
						label={`${member.name} on GitHub`}
					/>
				</div>
			</div>
		</div>
	);
}

export function LandingMeetTheTeam() {
	return (
		<Box
			component="section"
			id="team"
			className="mx-auto flex max-w-[1600px] scroll-mt-16 flex-col items-center gap-12 px-6 py-16 lg:gap-16 lg:px-16"
		>
			<div className="flex flex-col items-center gap-5 text-center">
				<Chip
					label="Meet the Team"
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
					The Students behind ZotMeet
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Recruiters please hire us.
					<br />
					Interested in how to get involved? We are a project team under ICS
					Student Council and follow their recruitment cycle. Connect with our
					team on discord and checkout a Github issue.
				</Typography>
				<div className="flex gap-5">
					{/* TODO: link the team Discord invite. */}
					<Button
						variant="outlined"
						size="large"
						startIcon={
							<Image
								src="/landing/discord-button.svg"
								alt=""
								width={22}
								height={22}
							/>
						}
					>
						Discord
					</Button>
					<Button
						variant="outlined"
						size="large"
						href={GITHUB_URL}
						target="_blank"
						rel="noreferrer"
						startIcon={
							<Image
								src="/landing/github-button.svg"
								alt=""
								width={22}
								height={22}
							/>
						}
					>
						Github
					</Button>
				</div>
			</div>

			<div className="flex flex-wrap justify-center gap-x-6 gap-y-10 sm:gap-12">
				{team.map((member) => (
					<TeamCard key={member.name} member={member} />
				))}
			</div>
		</Box>
	);
}
