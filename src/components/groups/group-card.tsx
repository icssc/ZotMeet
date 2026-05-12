import {
	CalendarToday,
	Error as ErrorIcon,
	KeyboardArrowRight,
} from "@mui/icons-material";
import { Avatar, AvatarGroup, Box, Typography } from "@mui/material";
import { alpha, lighten } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import {
	MuiCard,
	MuiCardActions,
	MuiCardHeader,
} from "@/components/ui/mui/card";
import type { GroupMember } from "@/server/data/groups/queries";

const AVATAR_GROUP_MAX = 6;

interface GroupCardProps {
	id: string;
	name: string;
	members?: GroupMember[];
	totalMeetings: number;
	creatorName: string;
	creatorAvatar?: string | null;
	actionRequired?: boolean;
	pendingMeetingName?: string | null;
	upcomingMeetingName?: string | null;
	icon?: string | null;
}

export function GroupCard({
	id,
	name,
	members = [],
	totalMeetings,
	creatorName,
	creatorAvatar,
	actionRequired = false,
	pendingMeetingName,
	upcomingMeetingName,
	icon,
}: GroupCardProps) {
	return (
		<Link
			href={`/groups/${id}`}
			style={{ textDecoration: "none", height: "100%", display: "block" }}
		>
			<MuiCard
				sx={[
					{
						position: "relative",
						overflow: "visible",
						border: "1px solid",
						borderColor: "divider",
						px: { xs: 2, sm: 3 },
						py: { xs: 1.5, sm: 4 },
						height: "100%",
						display: "flex",
						flexDirection: "column",
					},
					actionRequired &&
						((theme) => ({
							"@media (max-width: 599px)": {
								background: `linear-gradient(to right, ${theme.palette.background.paper} 44.713%, ${alpha(theme.palette.primary.main, 0.25)})`,
							},
						})),
				]}
			>
				{/* Desktop only: action required badge */}
				{actionRequired && (
					<Box
						sx={(theme) => ({
							position: "absolute",
							top: -4,
							right: 24,
							display: { xs: "none", sm: "flex" },
							alignItems: "center",
							gap: "10px",
							px: "10px",
							py: "5px",
							bgcolor: lighten(theme.palette.error.main, 0.9),
							borderRadius: "0 0 5px 5px",
						})}
					>
						<ErrorIcon sx={{ fontSize: 18, color: "error.main" }} />
						<Typography
							variant="caption"
							sx={{
								color: "error.main",
								fontWeight: 500,
								letterSpacing: "0.14px",
								lineHeight: "20px",
							}}
						>
							Action Required
						</Typography>
					</Box>
				)}

				{/* Upcoming meeting badge */}
				{upcomingMeetingName && (
					<Box
						sx={(theme) => ({
							position: "absolute",
							top: -4,
							right: 24,
							display: { xs: "none", sm: "flex" },
							alignItems: "center",
							gap: "10px",
							px: "10px",
							py: "5px",
							bgcolor: lighten(theme.palette.success.main, 0.9),
							borderRadius: "0 0 5px 5px",
						})}
					>
						<CalendarToday sx={{ fontSize: 18, color: "success.main" }} />
						<Typography
							variant="caption"
							sx={{
								color: "success.main",
								fontWeight: 500,
								letterSpacing: "0.14px",
								lineHeight: "20px",
							}}
						>
							Upcoming Meeting
						</Typography>
					</Box>
				)}

				<MuiCardHeader
					sx={{ p: 0 }}
					avatar={
						<Box
							sx={{
								position: "relative",
								width: 40,
								height: 40,
								flexShrink: 0,
								borderRadius: "50%",
								overflow: "hidden",
							}}
						>
							<Image
								src={icon || "/icssc-logo.svg"}
								alt="group-pfp"
								fill
								style={{ objectFit: "cover" }}
							/>
						</Box>
					}
					title={<Typography variant="h6">{name}</Typography>}
					subheader={
						!actionRequired ? (
							<Box
								sx={{
									display: { xs: "flex", sm: "none" },
									alignItems: "center",
									gap: "5px",
									mt: "2px",
								}}
							>
								<CalendarToday sx={{ fontSize: 12, color: "text.secondary" }} />
								<Typography variant="caption" sx={{ color: "text.secondary" }}>
									{totalMeetings}
								</Typography>
							</Box>
						) : null
					}
					action={
						<Box sx={{ display: { sm: "none" }, alignSelf: "center" }}>
							<KeyboardArrowRight />
						</Box>
					}
				/>

				<AvatarGroup
					max={AVATAR_GROUP_MAX}
					sx={{
						display: { xs: "none", sm: "flex" },
						justifyContent: "flex-end",
						mt: 1.5,
						"& .MuiAvatar-root": {
							width: 32,
							height: 32,
							fontSize: "0.75rem",
							border: "2px solid",
							borderColor: "background.paper",
						},
					}}
				>
					{members.map((m) => (
						<Avatar
							key={m.userId}
							src={m.profilePicture ?? undefined}
							alt={m.displayName}
							sx={{ bgcolor: "grey.400" }}
						>
							{m.displayName[0]}
						</Avatar>
					))}
				</AvatarGroup>

				{/* Mobile only: message for action required cards */}
				{actionRequired && (
					<Typography
						variant="body2"
						sx={{
							display: { xs: "block", sm: "none" },
							color: "text.secondary",
							mt: 1,
						}}
					>
						Availability is needed for:{" "}
						<Box component="span" sx={{ fontWeight: 700, fontStyle: "italic" }}>
							{pendingMeetingName ?? "a meeting"}
						</Box>
					</Typography>
				)}

				<MuiCardActions
					sx={{
						display: { xs: "none", sm: "flex" },
						justifyContent: "space-between",
						p: 0,
						mt: "auto",
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: "5px",
							flexShrink: 0,
						}}
					>
						<CalendarToday sx={{ fontSize: 12, color: "text.secondary" }} />
						<Typography variant="overline" sx={{ color: "text.secondary" }}>
							{totalMeetings} {totalMeetings === 1 ? "Meeting" : "Meetings"}
						</Typography>
					</Box>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: "10px",
							minWidth: 0,
						}}
					>
						<Avatar
							src={creatorAvatar ?? undefined}
							alt={creatorName}
							sx={{
								width: 18,
								height: 18,
								fontSize: "0.625rem",
								bgcolor: "grey.400",
								flexShrink: 0,
							}}
						>
							{creatorName[0]}
						</Avatar>
						<Typography
							variant="overline"
							sx={{
								color: "text.secondary",
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
							}}
						>
							Owned by {creatorName}
						</Typography>
					</Box>
				</MuiCardActions>
			</MuiCard>
		</Link>
	);
}
