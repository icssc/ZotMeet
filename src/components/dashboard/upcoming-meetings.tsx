"use client";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, ButtonBase, Divider, Typography } from "@mui/material";
import Link from "next/link";
import {
	type MetaEntry,
	MetaRow,
	SectionCard,
	SectionHeading,
} from "@/components/dashboard/dashboard-parts";
import {
	type DashboardUpcomingItem,
	formatScheduledTime,
	formatUpcomingDate,
} from "@/lib/meetings/utils";
import type { MeetingListRow } from "@/server/data/meeting/queries";

const VISIBLE_UPCOMING = 5;

export function UpcomingMeetings({
	items,
}: {
	items: DashboardUpcomingItem<MeetingListRow>[];
}) {
	return (
		<SectionCard
			component="section"
			sx={{
				pt: 1.875,
				pb: 3.75,
				display: "flex",
				flexDirection: "column",
				gap: 1.5,
			}}
		>
			<Box sx={{ px: 2.5 }}>
				<SectionHeading count={items.length}>Upcoming</SectionHeading>
			</Box>

			{items.length === 0 ? (
				<Typography color="text.secondary" sx={{ px: 2.5 }}>
					No meetings scheduled yet.
				</Typography>
			) : (
				<Box
					component="ul"
					sx={{
						listStyle: "none",
						m: 0,
						p: 0,
						display: "flex",
						flexDirection: "column",
						gap: 2,
					}}
				>
					{items.slice(0, VISIBLE_UPCOMING).map((item, i) => (
						<Box
							component="li"
							key={item.meeting.id}
							sx={{ display: "flex", flexDirection: "column", gap: 2 }}
						>
							{i > 0 && <Divider />}
							<UpcomingRow item={item} />
						</Box>
					))}
				</Box>
			)}
		</SectionCard>
	);
}

function UpcomingRow({
	item: { meeting, block },
}: {
	item: DashboardUpcomingItem<MeetingListRow>;
}) {
	const { weekday, month, day } = formatUpcomingDate(block.scheduledDate);
	const time = `${formatScheduledTime(block.scheduledFromTime)} - ${formatScheduledTime(block.scheduledToTime)}`;

	const meta: MetaEntry[] = [
		{ key: "time", label: time.toLowerCase(), icon: AccessTimeIcon },
		...(meeting.location
			? [{ key: "location", label: meeting.location, icon: LocationOnIcon }]
			: []),
	];

	return (
		<ButtonBase
			component={Link}
			href={`/availability/${meeting.id}`}
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "flex-start",
				gap: 3,
				px: 2.5,
				textAlign: "left",
				"&:hover .upcoming-title": { textDecoration: "underline" },
			}}
		>
			<Box
				sx={{
					width: 67,
					flexShrink: 0,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Typography variant="h6" component="span">
					{weekday}
				</Typography>
				<Box sx={{ display: "flex", gap: 0.5, color: "text.secondary" }}>
					<Typography variant="overline" color="inherit">
						{month}
					</Typography>
					<Typography variant="caption" color="inherit">
						{day}
					</Typography>
				</Box>
			</Box>
			<Box sx={{ flex: 1, minWidth: 0 }}>
				<Typography
					variant="h6"
					component="h3"
					noWrap
					className="upcoming-title"
				>
					{meeting.title}
				</Typography>
				<Box sx={{ py: 0.5 }}>
					<MetaRow entries={meta} />
				</Box>
			</Box>
		</ButtonBase>
	);
}
