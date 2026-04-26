import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DateRangeIcon from "@mui/icons-material/DateRange";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import GroupIcon from "@mui/icons-material/Group";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	IconButton,
	Typography,
} from "@mui/material";
import Link from "next/link";

interface MeetingCardProps {
	meetingName: string;
	meetingOrganizer: string;
	dateStart: string;
	dateEnd: string;
	timeStart: string;
	timeEnd: string;
	numResponders: number;
	location: string | null;
	scheduled?: boolean;
	meetingLink: string;
}

const MeetingCard = ({
	meetingName,
	meetingOrganizer,
	dateStart,
	dateEnd,
	timeStart,
	timeEnd,
	numResponders,
	location,
	scheduled = false,
	meetingLink,
}: MeetingCardProps) => {
	const dateLabel =
		dateStart && dateEnd && dateStart !== dateEnd
			? `${dateStart} - ${dateEnd}`
			: dateStart;

	return (
		<Card
			variant="outlined"
			sx={{
				display: "flex",
				flexDirection: "column",
			}}
		>
			<CardContent
				sx={{
					pt: 3,
					px: 2.5,
					pb: 0,
					"&:last-child": { pb: 0 },
					display: "flex",
					flexDirection: "column",
					gap: 2,
					flexGrow: 1,
				}}
			>
				<Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Typography variant="h5" noWrap>
							{meetingName}
						</Typography>
						<Typography variant="body1" color="text.secondary" noWrap>
							{meetingOrganizer}
						</Typography>
					</Box>
					<IconButton size="small" edge="end" sx={{ mt: -0.5, flexShrink: 0 }}>
						<MoreVertIcon sx={{ fontSize: 20 }} />
					</IconButton>
				</Box>

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "auto auto",
						columnGap: 1.5,
						rowGap: 1.5,
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
						<DateRangeIcon
							sx={{ fontSize: 16, color: "text.secondary", flexShrink: 0 }}
						/>
						<Typography variant="body1" color="text.secondary" noWrap>
							{dateLabel}
						</Typography>
					</Box>

					<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
						<AccessTimeIcon
							sx={{ fontSize: 16, color: "text.secondary", flexShrink: 0 }}
						/>
						<Typography variant="body1" color="text.secondary" noWrap>
							{timeStart} - {timeEnd}
						</Typography>
					</Box>

					<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
						<GroupIcon
							sx={{ fontSize: 16, color: "text.secondary", flexShrink: 0 }}
						/>
						<Typography variant="body1" color="text.secondary" noWrap>
							{numResponders} Responders
						</Typography>
					</Box>

					{location ? (
						<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
							<FmdGoodIcon
								sx={{ fontSize: 16, color: "text.secondary", flexShrink: 0 }}
							/>
							<Typography variant="body1" color="text.secondary" noWrap>
								{location}
							</Typography>
						</Box>
					) : (
						<Box />
					)}
				</Box>
			</CardContent>

			<CardActions sx={{ px: 2.5, pb: 2.5, pt: 0, justifyContent: "flex-end" }}>
				<Button
					variant="text"
					color="primary"
					endIcon={<NavigateNextIcon />}
					component={Link}
					href={meetingLink}
					size="small"
					sx={{ textTransform: "capitalize", fontWeight: 600 }}
				>
					{scheduled ? "View schedule" : "Add availability"}
				</Button>
			</CardActions>
		</Card>
	);
};

export default MeetingCard;
