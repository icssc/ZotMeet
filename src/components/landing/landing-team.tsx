import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Avatar, Box, Card, Chip, IconButton, Typography } from "@mui/material";

interface Member {
	name: string;
	role: string;
	/** Path under `public/`, e.g. "/team/jane-doe.jpg". Falls back to initials. */
	photo?: string;
	github?: string;
	linkedin?: string;
}

// TODO: replace with the real team. Photos go in `public/team/`.
const members: Member[] = [
	{ name: "Member Name", role: "Project Lead" },
	{ name: "Member Name", role: "Design Lead" },
	{ name: "Member Name", role: "Designer" },
	{ name: "Member Name", role: "Designer" },
	{ name: "Member Name", role: "Developer" },
	{ name: "Member Name", role: "Developer" },
	{ name: "Member Name", role: "Developer" },
	{ name: "Member Name", role: "Developer" },
];

function initials(name: string) {
	return name
		.split(/\s+/)
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

function MemberCard({ member }: { member: Member }) {
	return (
		<Card
			variant="outlined"
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 1.5,
				p: 3,
				textAlign: "center",
			}}
		>
			<Avatar
				src={member.photo}
				alt={member.name}
				sx={{
					width: { xs: 72, sm: 96 },
					height: { xs: 72, sm: 96 },
					bgcolor: "primary.main",
					color: "primary.contrastText",
				}}
			>
				{initials(member.name)}
			</Avatar>
			<Box>
				<Typography variant="subtitle1" component="h3" fontWeight={600}>
					{member.name}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{member.role}
				</Typography>
			</Box>
			{(member.github || member.linkedin) && (
				<Box sx={{ display: "flex", gap: 0.5 }}>
					{member.github && (
						<IconButton
							size="small"
							href={member.github}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`${member.name} on GitHub`}
						>
							<GitHubIcon fontSize="small" />
						</IconButton>
					)}
					{member.linkedin && (
						<IconButton
							size="small"
							href={member.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`${member.name} on LinkedIn`}
						>
							<LinkedInIcon fontSize="small" />
						</IconButton>
					)}
				</Box>
			)}
		</Card>
	);
}

export function LandingTeam() {
	return (
		<Box
			component="section"
			id="team"
			className="mx-auto flex max-w-[1600px] scroll-mt-20 flex-col items-center gap-12 px-6 py-16 lg:gap-14 lg:px-16"
		>
			<div className="flex max-w-3xl flex-col items-center gap-5 text-center">
				<Chip label="Meet the Team" variant="outlined" />
				<Typography
					variant="h4"
					component="h2"
					sx={{
						typography: { xs: "h5", sm: "h4" },
						fontWeight: { xs: 600, sm: 600 },
					}}
				>
					The students behind{" "}
					<Box component="span" sx={{ color: "primary.main" }}>
						ZotMeet
					</Box>
				</Typography>
				<Typography variant="body2" color="text.secondary">
					ZotMeet is designed and built by UCI students on ICSSC Projects.
				</Typography>
			</div>

			<div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
				{members.map((member, index) => (
					// Index in the key: placeholder names repeat until the real team is filled in.
					<MemberCard key={`${member.name}-${index}`} member={member} />
				))}
			</div>
		</Box>
	);
}
