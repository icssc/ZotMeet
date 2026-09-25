import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Box, Button, Chip, Typography } from "@mui/material";
import Image from "next/image";
import type { ElementType } from "react";
import { type TeamMember, teamMembers } from "./team-members";

const GITHUB_URL = "https://github.com/icssc/ZotMeet";

const socialIconSx = { fontSize: 24, color: "primary.main" };

/** Renders nothing until `href` is filled in. */
function SocialLink({
	href,
	icon: Icon,
	label,
}: {
	href?: string;
	icon: ElementType;
	label: string;
}) {
	if (!href) return null;
	return (
		<a href={href} target="_blank" rel="noreferrer" aria-label={label}>
			<Icon sx={socialIconSx} />
		</a>
	);
}

function TeamCard({ member }: { member: TeamMember }) {
	return (
		<div className="flex w-[150px] flex-col items-center gap-3 sm:w-[187px]">
			<Box
				sx={{ bgcolor: "grey.300", borderRadius: 2 }}
				className="relative flex aspect-[187/225] w-full items-center justify-center overflow-hidden pt-1.5"
			>
				{member.headshot ? (
					<Image
						src={member.headshot}
						alt={member.name}
						fill
						sizes="(min-width: 640px) 187px, 150px"
						className="object-cover"
					/>
				) : (
					<Image src="/mascot.svg" alt="" width={111} height={111} />
				)}
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
						icon={LanguageIcon}
						label={`${member.name}'s website`}
					/>
					<SocialLink
						href={member.linkedinUrl}
						icon={LinkedInIcon}
						label={`${member.name} on LinkedIn`}
					/>
					<SocialLink
						href={member.githubUrl}
						icon={GitHubIcon}
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
						startIcon={<GitHubIcon sx={{ fontSize: 22 }} />}
					>
						Github
					</Button>
				</div>
			</div>

			<div className="flex flex-wrap justify-center gap-x-6 gap-y-10 sm:gap-12">
				{teamMembers.map((member) => (
					<TeamCard key={member.name} member={member} />
				))}
			</div>
		</Box>
	);
}
