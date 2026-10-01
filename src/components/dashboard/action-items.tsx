"use client";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EditIcon from "@mui/icons-material/Edit";
import GridViewIcon from "@mui/icons-material/GridView";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import ViewListIcon from "@mui/icons-material/ViewList";
import {
	Box,
	Button,
	Chip,
	Divider,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Link from "next/link";
import { useState } from "react";
import {
	type MetaEntry,
	MetaRow,
	SectionCard,
	SectionHeading,
} from "@/components/dashboard/dashboard-parts";
import MeetingCard from "@/components/ui/meeting-card";
import {
	formatMeetingCardDateLabel,
	toMeetingCardData,
} from "@/lib/meeting-card/mapper";
import type {
	DashboardActionItem,
	DashboardActionKind,
} from "@/lib/meetings/utils";
import type { MeetingListRow } from "@/server/data/meeting/queries";

const VISIBLE_ITEMS = 5;

type ViewMode = "list" | "cards";

type ActionItemsProps = {
	items: DashboardActionItem<MeetingListRow>[];
	memberId: string;
	meetingCounts: Record<string, number>;
	groupNames: Record<string, string>;
};

export function ActionItems({
	items,
	memberId,
	meetingCounts,
	groupNames,
}: ActionItemsProps) {
	const [view, setView] = useState<ViewMode>("list");
	const visible = items.slice(0, VISIBLE_ITEMS);

	return (
		<SectionCard
			component="section"
			sx={{
				p: { xs: 2, sm: 3.75 },
				display: "flex",
				flexDirection: "column",
				gap: 1.5,
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<SectionHeading count={items.length}>Action Items</SectionHeading>
				<ToggleButtonGroup
					value={view}
					exclusive
					size="small"
					onChange={(_, next: ViewMode | null) => next && setView(next)}
					aria-label="Action items layout"
					sx={{
						bgcolor: "action.hover",
						borderRadius: 1,
						px: 0.5,
						py: 0.375,
						gap: 1.5,
						"& .MuiToggleButton-root": {
							border: 0,
							borderRadius: 1,
							p: 0,
							width: 27,
							"&.Mui-selected": { bgcolor: "action.focus" },
						},
					}}
				>
					<ToggleButton value="list" aria-label="List view">
						<ViewListIcon />
					</ToggleButton>
					<ToggleButton value="cards" aria-label="Card view">
						<GridViewIcon />
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>

			{items.length === 0 ? (
				<Typography color="text.secondary" sx={{ py: 3 }}>
					You're all caught up. Nothing needs your attention right now.
				</Typography>
			) : view === "list" ? (
				<Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
					{visible.map((item, i) => (
						<Box component="li" key={item.meeting.id}>
							{i > 0 && <Divider sx={{ my: 1.5 }} />}
							<ActionItemRow
								item={item}
								memberId={memberId}
								responderCount={meetingCounts[item.meeting.id] ?? 0}
								groupName={
									item.meeting.group_id
										? groupNames[item.meeting.group_id]
										: undefined
								}
							/>
						</Box>
					))}
				</Box>
			) : (
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
						gap: 2,
					}}
				>
					{visible.map(({ meeting }) => {
						const { meeting: _meeting, ...cardProps } = toMeetingCardData(
							meeting,
							memberId,
							{ responderCount: meetingCounts[meeting.id] ?? 0 },
						);
						return (
							<MeetingCard
								key={meeting.id}
								{...cardProps}
								needsAvailability={meeting.needsAvailability}
								allAvailabilityFilled={meeting.allAvailabilityFilled}
							/>
						);
					})}
				</Box>
			)}

			{items.length > VISIBLE_ITEMS && (
				<Button
					component={Link}
					href="/summary"
					endIcon={<ChevronRightIcon sx={{ color: "inherit" }} />}
					sx={{ alignSelf: "flex-end", color: "primary.main" }}
				>
					View all {items.length}
				</Button>
			)}
		</SectionCard>
	);
}

function ActionItemRow({
	item,
	memberId,
	responderCount,
	groupName,
}: {
	item: DashboardActionItem<MeetingListRow>;
	memberId: string;
	responderCount: number;
	groupName: string | undefined;
}) {
	const card = toMeetingCardData(item.meeting, memberId, { responderCount });

	const meta: MetaEntry[] = [
		...(groupName
			? [
					{
						key: "group",
						label: (
							<Chip
								label={groupName}
								size="small"
								sx={{
									height: 18,
									bgcolor: "action.hover",
									"& .MuiChip-label": {
										px: 1.25,
										typography: "caption",
										color: "text.secondary",
									},
								}}
							/>
						),
					},
				]
			: []),
		{
			key: "dates",
			label: formatMeetingCardDateLabel(card.dateStart, card.dateEnd),
			icon: DateRangeIcon,
		},
		{ key: "responders", label: String(responderCount), icon: PeopleIcon },
		{
			key: "time",
			label: `${card.timeStart} - ${card.timeEnd}`,
			icon: AccessTimeIcon,
		},
		...(card.location
			? [{ key: "location", label: card.location, icon: LocationOnIcon }]
			: []),
	];

	return (
		<Box
			component={Link}
			href={card.meetingLink}
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 1.5,
				color: "inherit",
				textDecoration: "none",
				borderRadius: 1,
				"&:hover .action-item-title": { textDecoration: "underline" },
			}}
		>
			<Box sx={{ flex: 1, minWidth: 0 }}>
				<Typography
					variant="h6"
					component="h3"
					noWrap
					className="action-item-title"
				>
					{card.meetingName}
				</Typography>
				<MetaRow entries={meta} />
			</Box>
			<ActionPill kind={item.kind} />
			<ChevronRightIcon sx={{ color: "action.active", flexShrink: 0 }} />
		</Box>
	);
}

function ActionPill({ kind }: { kind: DashboardActionKind }) {
	const isSchedule = kind === "schedule";
	const Icon = isSchedule ? DateRangeIcon : EditIcon;
	const color = isSchedule ? "info" : "primary";

	return (
		<Box
			sx={(theme) => ({
				display: { xs: "none", sm: "flex" },
				alignItems: "center",
				gap: 0.5,
				flexShrink: 0,
				px: 1.25,
				py: 0.5,
				borderRadius: 38,
				bgcolor: alpha(theme.palette[color].main, 0.2),
				color: `${color}.main`,
			})}
		>
			<Icon sx={{ fontSize: 18, color: "inherit" }} />
			<Typography
				variant="caption"
				color="inherit"
				sx={{ lineHeight: "20px", letterSpacing: "0.14px" }}
			>
				{isSchedule ? "Schedule meeting" : "Add Availability"}
			</Typography>
		</Box>
	);
}
