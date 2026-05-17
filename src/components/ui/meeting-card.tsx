import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ErrorIcon from "@mui/icons-material/Error";
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
	Chip,
	IconButton,
	Typography,
} from "@mui/material";
import { lighten } from "@mui/material/styles";
import Link from "next/link";
import type { ElementType } from "react";

interface MeetingCardProps {
	meetingName: string;
	meetingOrganizer: string;
	dateStart: string;
	dateEnd: string;
	timeStart: string;
	timeEnd: string;
	numResponders: number;
	location?: string | null;
	scheduled?: boolean;
	scheduledLabel?: string;
	meetingLink: string;
	status?: "actionRequired" | "upcoming" | null;
}

const metaIconSx = { fontSize: 16, color: "text.secondary", flexShrink: 0 };
const metaTextSx = { typography: { xs: "body2", sm: "body1" } };
const metaGridSx = {
	display: "grid",
	gridTemplateColumns: "1fr 1fr",
	width: "100%",
	columnGap: 1.5,
	rowGap: 1.5,
};

const MetaItem = ({
	icon: Icon,
	label,
}: {
	icon: ElementType;
	label: string;
}) => (
	<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
		<Icon sx={metaIconSx} />
		<Typography color="text.secondary" noWrap sx={metaTextSx}>
			{label}
		</Typography>
	</Box>
);

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
	scheduledLabel,
	meetingLink,
	status,
}: MeetingCardProps) => {
	const dateLabel =
		dateStart && dateEnd && dateStart !== dateEnd
			? `${dateStart} - ${dateEnd}`
			: dateStart;

	return (
		<Card
			variant="outlined"
			sx={{
				position: "relative",
				overflow: "visible",
				display: "flex",
				flexDirection: "column",
				p: 0,
			}}
		>
			{status && (
				<Box
					sx={(theme) => ({
						position: "absolute",
						top: 0,
						right: 48,
						display: { xs: "none", sm: "flex" },
						alignItems: "center",
						gap: "10px",
						px: "10px",
						py: "5px",
						bgcolor:
							status === "actionRequired"
								? lighten(theme.palette.error.main, 0.9)
								: lighten(theme.palette.success.main, 0.9),
						borderRadius: "0 0 5px 5px",
					})}
				>
					{status === "actionRequired" ? (
						<ErrorIcon sx={{ fontSize: 18, color: "error.main" }} />
					) : (
						<CalendarTodayIcon sx={{ fontSize: 18, color: "success.main" }} />
					)}
					<Typography
						variant="caption"
						sx={{
							color:
								status === "actionRequired" ? "error.main" : "success.main",
							fontWeight: 500,
							letterSpacing: "0.14px",
							lineHeight: "20px",
						}}
					>
						{status === "actionRequired" ? "Action Required" : "Upcoming"}
					</Typography>
				</Box>
			)}

			<CardContent
				sx={{
					pt: { xs: 2.5, sm: 3 },
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
						<Typography
							component="div"
							noWrap
							sx={{ typography: { xs: "h6", sm: "h5" } }}
						>
							{meetingName}
						</Typography>
						<Typography
							component="div"
							color="text.secondary"
							noWrap
							sx={metaTextSx}
						>
							{meetingOrganizer}
						</Typography>
					</Box>
					<IconButton size="small" edge="end" sx={{ mt: -0.5, flexShrink: 0 }}>
						<MoreVertIcon sx={{ fontSize: { xs: 24, sm: 20 } }} />
					</IconButton>
				</Box>

				{scheduled && scheduledLabel ? (
					<Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
						<Chip
							label={scheduledLabel}
							size="small"
							color="secondary"
							sx={{ borderRadius: "5px", fontWeight: 500, alignSelf: "start" }}
						/>
						<Box sx={metaGridSx}>
							<MetaItem
								icon={GroupIcon}
								label={`${numResponders} Responders`}
							/>
							{location && <MetaItem icon={FmdGoodIcon} label={location} />}
						</Box>
					</Box>
				) : (
					<Box sx={metaGridSx}>
						<MetaItem icon={DateRangeIcon} label={dateLabel} />
						<MetaItem
							icon={AccessTimeIcon}
							label={`${timeStart} - ${timeEnd}`}
						/>
						<MetaItem icon={GroupIcon} label={`${numResponders} Responders`} />
						{location && <MetaItem icon={FmdGoodIcon} label={location} />}
					</Box>
				)}
			</CardContent>

			<CardActions sx={{ px: 2.5, pb: 2.5, pt: 2, justifyContent: "flex-end" }}>
				<Button
					variant="text"
					color="primary"
					endIcon={<NavigateNextIcon />}
					component={Link}
					href={meetingLink}
					size="small"
					sx={{ textTransform: "capitalize", fontWeight: 600 }}
				>
					Add availability
				</Button>
			</CardActions>
		</Card>
	);
};

export default MeetingCard;
