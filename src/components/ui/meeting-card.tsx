import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EditIcon from "@mui/icons-material/Edit";
import EventIcon from "@mui/icons-material/Event";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import GroupIcon from "@mui/icons-material/Group";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
	Box,
	Card,
	CardContent,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import Link from "next/link";
import { type ElementType, type ReactNode, useId, useState } from "react";
import type { MeetingCardViewModel } from "@/lib/meeting-card/mapper";
import { getDeleteLeaveAction } from "@/lib/meetings/delete-leave-action";

interface MeetingCardProps extends MeetingCardViewModel {
	isOwner: boolean;
	onDeleteLeave?: () => void;
	extraMenuItems?: (close: () => void) => ReactNode;
	totalMembers?: number;
	needsAvailability?: boolean;
	allAvailabilityFilled?: boolean;
	isUpcoming?: boolean;
	isPast?: boolean;
}

const metaIconSx = { fontSize: 16, color: "text.secondary", flexShrink: 0 };
const metaTextSx = { typography: { xs: "body2", sm: "body1" } };
const bannerBaseSx = {
	px: 2.5,
	py: 1.5,
	display: "flex",
	alignItems: "center",
	gap: 0.5,
} as const;
const bannerTextSx = { color: "inherit", letterSpacing: "0.14px" } as const;
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
	extraMenuItems,
	totalMembers,
	needsAvailability = false,
	allAvailabilityFilled = false,
	isUpcoming = false,
	isPast = false,
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

	const variant = isPast
		? "default"
		: needsAvailability
			? "action-required"
			: !scheduled && allAvailabilityFilled && isOwner
				? "schedule-alert"
				: scheduled && isUpcoming
					? "upcoming"
					: scheduled
						? "scheduled"
						: "default";

	const cardContent = (
		<CardContent
			sx={{
				pt: { xs: 2.5, sm: 3 },
				px: 2.5,
				pb: 2.5,
				"&:last-child": { pb: 2.5 },
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
				{(onDeleteLeave || extraMenuItems) && (
					<>
						<IconButton
							size="small"
							edge="end"
							sx={{ mt: -0.5, flexShrink: 0, position: "relative", zIndex: 1 }}
							aria-label="Meeting options"
							aria-haspopup="true"
							aria-expanded={open}
							aria-controls={open ? menuId : undefined}
							onClick={(e) => {
								e.stopPropagation();
								setAnchorEl(e.currentTarget);
							}}
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
							{onDeleteLeave && (
								<MenuItem
									onClick={handleOpenDeleteLeave}
									sx={{ color: menuColor }}
								>
									<ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
										<Icon fontSize="small" />
									</ListItemIcon>
									{actionLabel}
								</MenuItem>
							)}
							{extraMenuItems?.(() => setAnchorEl(null))}
						</Menu>
					</>
				)}
			</Box>

			<Box sx={metaGridSx}>
				<MetaItem icon={DateRangeIcon} label={dateLabel} />
				<MetaItem icon={AccessTimeIcon} label={`${timeStart} - ${timeEnd}`} />
				<MetaItem
					icon={GroupIcon}
					label={
						totalMembers !== undefined
							? `${numResponders}/${totalMembers} Responders`
							: `${numResponders} Responders`
					}
				/>
				{location && <MetaItem icon={FmdGoodIcon} label={location} />}
			</Box>
		</CardContent>
	);

	if (variant === "default") {
		return (
			<Card
				variant="outlined"
				sx={{
					display: "flex",
					flexDirection: "column",
					position: "relative",
					cursor: "pointer",
				}}
			>
				<Link
					href={meetingLink}
					aria-label={meetingName}
					style={{ position: "absolute", inset: 0, zIndex: 0 }}
				/>
				{cardContent}
				<Box
					aria-hidden
					sx={{
						px: 2.5,
						py: 1.5,
						display: "flex",
						alignItems: "center",
						gap: 0.5,
						visibility: "hidden",
					}}
				>
					<Box sx={{ width: 18, height: 18, flexShrink: 0 }} />
					<Typography variant="caption">&nbsp;</Typography>
				</Box>
			</Card>
		);
	}

	const bannerBgColor =
		variant === "action-required"
			? "primary.main"
			: variant === "schedule-alert"
				? "info.main"
				: "secondary.main";

	const banner =
		variant === "action-required" ? (
			<Box sx={{ ...bannerBaseSx, color: "primary.contrastText" }}>
				<EditIcon sx={{ fontSize: 18, color: "inherit" }} />
				<Typography variant="caption" sx={bannerTextSx}>
					Add your availability.
				</Typography>
			</Box>
		) : variant === "schedule-alert" ? (
			<Box sx={{ ...bannerBaseSx, color: "info.contrastText" }}>
				<DateRangeIcon sx={{ fontSize: 18, color: "inherit" }} />
				<Typography variant="caption" sx={bannerTextSx}>
					Availability complete. Schedule this meeting.
				</Typography>
			</Box>
		) : variant === "upcoming" ? (
			<Box
				sx={{
					...bannerBaseSx,
					gap: undefined,
					justifyContent: "space-between",
					color: "secondary.contrastText",
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
					<EventIcon sx={{ fontSize: 18, color: "inherit" }} />
					<Typography variant="caption" sx={bannerTextSx}>
						Upcoming
					</Typography>
				</Box>
				{scheduledLabel && (
					<Typography variant="caption" sx={bannerTextSx}>
						{scheduledLabel}
					</Typography>
				)}
			</Box>
		) : (
			<Box sx={{ ...bannerBaseSx, color: "secondary.contrastText" }}>
				{scheduledLabel && (
					<Typography variant="caption" sx={bannerTextSx}>
						{scheduledLabel}
					</Typography>
				)}
			</Box>
		);

	return (
		<Card
			elevation={0}
			sx={{
				bgcolor: bannerBgColor,
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
				position: "relative",
				cursor: "pointer",
			}}
		>
			<Link
				href={meetingLink}
				aria-label={meetingName}
				style={{ position: "absolute", inset: 0, zIndex: 0 }}
			/>
			<Card
				variant="outlined"
				sx={{
					display: "flex",
					flexDirection: "column",
				}}
			>
				{cardContent}
			</Card>
			{banner}
		</Card>
	);
};

export default MeetingCard;
