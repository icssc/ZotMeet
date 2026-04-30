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
	scheduled?: boolean;
	scheduledLabel?: string;
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
	scheduled = false,
	scheduledLabel,
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
				p: 0,
			}}
		>
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
							sx={{ typography: { xs: "body2", sm: "body1" } }}
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
						<Box
							sx={{
								display: "inline-flex",
								alignItems: "center",
								bgcolor: "secondary.main",
								color: "secondary.contrastText",
								borderRadius: "5px",
								px: 1.25,
								height: "24px",
								alignSelf: "start",
							}}
						>
							<Typography
								variant="caption"
								sx={{ fontWeight: 500, lineHeight: 1, whiteSpace: "nowrap" }}
							>
								{scheduledLabel}
							</Typography>
						</Box>

						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								width: "100%",
								columnGap: 1.5,
							}}
						>
							<Box
								sx={{
									gridRow: "1 / span 1",
									gridColumn: 1,
									display: "flex",
									alignItems: "center",
									gap: 0.5,
								}}
							>
								<GroupIcon
									sx={{ fontSize: 16, color: "text.secondary", flexShrink: 0 }}
								/>
								<Typography
									color="text.secondary"
									noWrap
									sx={{ typography: { xs: "body2", sm: "body1" } }}
								>
									{numResponders} Responders
								</Typography>
							</Box>
							<Box
								sx={{
									gridRow: "1 / span 1",
									gridColumn: 2,
									display: "flex",
									alignItems: "center",
									gap: 0.5,
								}}
							>
								<FmdGoodIcon
									sx={{ fontSize: 16, color: "text.secondary", flexShrink: 0 }}
								/>
								<Typography
									color="text.secondary"
									noWrap
									sx={{ typography: { xs: "body2", sm: "body1" } }}
								>
									LOCATION
								</Typography>
							</Box>
						</Box>
					</Box>
				) : (
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							width: "100%",
							columnGap: 1.5,
							rowGap: 1.5,
						}}
					>
						<Box
							sx={{
								gridRow: "1 / span 1",
								gridColumn: 1,
								display: "flex",
								alignItems: "center",
								gap: 0.5,
							}}
						>
							<DateRangeIcon
								sx={{ fontSize: 16, color: "text.secondary", flexShrink: 0 }}
							/>
							<Typography
								color="text.secondary"
								noWrap
								sx={{ typography: { xs: "body2", sm: "body1" } }}
							>
								{dateLabel}
							</Typography>
						</Box>
						<Box
							sx={{
								gridRow: "1 / span 1",
								gridColumn: 2,
								display: "flex",
								alignItems: "center",
								gap: 0.5,
							}}
						>
							<AccessTimeIcon
								sx={{ fontSize: 16, color: "text.secondary", flexShrink: 0 }}
							/>
							<Typography
								color="text.secondary"
								noWrap
								sx={{ typography: { xs: "body2", sm: "body1" } }}
							>
								{timeStart} - {timeEnd}
							</Typography>
						</Box>
						<Box
							sx={{
								gridRow: "2 / span 1",
								gridColumn: 1,
								display: "flex",
								alignItems: "center",
								gap: 0.5,
							}}
						>
							<GroupIcon
								sx={{ fontSize: 16, color: "text.secondary", flexShrink: 0 }}
							/>
							<Typography
								color="text.secondary"
								noWrap
								sx={{ typography: { xs: "body2", sm: "body1" } }}
							>
								{numResponders} Responders
							</Typography>
						</Box>
						<Box
							sx={{
								gridRow: "2 / span 1",
								gridColumn: 2,
								display: "flex",
								alignItems: "center",
								gap: 0.5,
							}}
						>
							<FmdGoodIcon
								sx={{ fontSize: 16, color: "text.secondary", flexShrink: 0 }}
							/>
							<Typography
								color="text.secondary"
								noWrap
								sx={{ typography: { xs: "body2", sm: "body1" } }}
							>
								LOCATION
							</Typography>
						</Box>
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
