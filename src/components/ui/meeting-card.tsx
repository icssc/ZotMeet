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
	Chip,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import Link from "next/link";
import { type ElementType, useId, useState } from "react";
import type { MeetingCardViewModel } from "@/lib/meeting-card/mapper";
import { getDeleteLeaveAction } from "@/lib/meetings/delete-leave-action";

interface MeetingCardProps extends MeetingCardViewModel {
	isOwner: boolean;
	onDeleteLeave?: () => void;
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
	isOwner,
	onDeleteLeave,
}: MeetingCardProps) => {
	const menuId = useId();
	const { label: actionLabel, Icon, menuColor } = getDeleteLeaveAction(isOwner);

	const dateLabel =
		dateStart && dateEnd && dateStart !== dateEnd
			? `${dateStart} - ${dateEnd}`
			: dateStart;

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleOpenDeleteLeave = () => {
		setAnchorEl(null);
		onDeleteLeave?.();
	};

	return (
		<Card
			variant="outlined"
			sx={{ display: "flex", flexDirection: "column", p: 0 }}
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
							sx={metaTextSx}
						>
							{meetingOrganizer}
						</Typography>
					</Box>
					{onDeleteLeave && (
						<>
							<IconButton
								size="small"
								edge="end"
								sx={{ mt: -0.5, flexShrink: 0 }}
								aria-label="Meeting options"
								aria-haspopup="true"
								aria-expanded={open}
								aria-controls={open ? menuId : undefined}
								onClick={(e) => setAnchorEl(e.currentTarget)}
							>
								<MoreVertIcon sx={{ fontSize: { xs: 24, sm: 20 } }} />
							</IconButton>

							<Menu
								id={menuId}
								anchorEl={anchorEl}
								open={open}
								onClose={() => setAnchorEl(null)}
								anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
								transformOrigin={{ vertical: "top", horizontal: "right" }}
								slotProps={{
									paper: { sx: { minWidth: 180 } },
								}}
							>
								<MenuItem
									onClick={handleOpenDeleteLeave}
									sx={{ color: menuColor }}
								>
									<ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
										<Icon fontSize="small" />
									</ListItemIcon>
									{actionLabel}
								</MenuItem>
							</Menu>
						</>
					)}
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
