"use client";

import { Add, CalendarMonth, Notifications } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FilterChip } from "@/components/ui/filter-chip";
import MeetingCard from "@/components/ui/meeting-card";
import type { SelectMeeting } from "@/db/schema";
import {
	filterMeetingsByQuery,
	toMeetingCardProps,
} from "@/lib/meeting-card/mapper";

type FilterType = "upcoming" | "past" | "by-you";

interface MeetingsProps {
	meetings: (SelectMeeting & {
		hostDisplayName: string | null;
		needsAvailability: boolean;
	})[];
	userId: string;
	meetingCounts: Record<string, number>;
	scheduledLabels?: Record<string, string>;
	scheduledDates?: Record<string, number>;
	upcomingMeetingIds?: string[];
}

type DisplayMeeting = MeetingsProps["meetings"][number];

const sectionLabelSx = {
	fontSize: 12,
	fontWeight: 500,
	letterSpacing: "1px",
	textTransform: "uppercase",
	lineHeight: 1,
	color: "text.disabled",
} as const;

const toCard = (
	meeting: DisplayMeeting,
	meetingCounts: Record<string, number>,
	upcomingSet: Set<string>,
	scheduledLabels?: Record<string, string>,
) => {
	const cardProps = toMeetingCardProps(meeting, {
		responderCount: meetingCounts[meeting.id] ?? 0,
		scheduledLabel: scheduledLabels?.[meeting.id],
	});
	const status = meeting.needsAvailability
		? "actionRequired"
		: upcomingSet.has(meeting.id)
			? "upcoming"
			: null;
	return <MeetingCard key={meeting.id} {...cardProps} status={status} />;
};

const MeetingSection = ({
	label,
	meetings,
	meetingCounts,
	upcomingSet,
	scheduledLabels,
}: {
	label: string;
	meetings: DisplayMeeting[];
	meetingCounts: Record<string, number>;
	upcomingSet: Set<string>;
	scheduledLabels?: Record<string, string>;
}) => {
	if (meetings.length === 0) return null;
	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
			<Typography sx={sectionLabelSx}>
				{label} ({meetings.length})
			</Typography>
			<Box
				sx={{
					display: { xs: "flex", sm: "grid" },
					flexDirection: "column",
					gridTemplateColumns: { sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
					gap: { xs: 1.5, sm: 2 },
				}}
			>
				{meetings.map((m) =>
					toCard(m, meetingCounts, upcomingSet, scheduledLabels),
				)}
			</Box>
		</Box>
	);
};

export const Meetings = ({
	meetings,
	userId,
	meetingCounts,
	scheduledLabels,
	scheduledDates,
	upcomingMeetingIds,
}: MeetingsProps) => {
	const [search, setSearch] = useState("");
	const [activeFilter, setActiveFilter] = useState<FilterType>("upcoming");

	const upcomingSet = useMemo(
		() => new Set(upcomingMeetingIds ?? []),
		[upcomingMeetingIds],
	);

	const startOfToday = useMemo(() => {
		const d = new Date();
		d.setHours(0, 0, 0, 0);
		return d.getTime();
	}, []);

	const isPast = useMemo(
		() => (m: DisplayMeeting) =>
			m.scheduled === true &&
			(scheduledDates?.[m.id] ?? Number.POSITIVE_INFINITY) < startOfToday,
		[scheduledDates, startOfToday],
	);

	const counts = useMemo(
		() => ({
			upcoming: meetings.filter((m) => !isPast(m)).length,
			past: meetings.filter(isPast).length,
			"by-you": meetings.filter((m) => m.hostId === userId).length,
		}),
		[meetings, userId, isPast],
	);

	const filteredByOwner = useMemo(() => {
		switch (activeFilter) {
			case "upcoming":
				return meetings.filter((m) => !isPast(m));
			case "past":
				return meetings.filter(isPast);
			case "by-you":
				return meetings.filter((m) => m.hostId === userId);
		}
	}, [meetings, userId, activeFilter, isPast]);

	const displayMeetings = useMemo(
		() => filterMeetingsByQuery(filteredByOwner, search),
		[filteredByOwner, search],
	);

	const renderMeetings = () => {
		if (displayMeetings.length === 0) {
			return (
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 1.25,
						py: 4,
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: 137,
							height: 137,
							borderRadius: "50%",
							bgcolor: "action.hover",
							opacity: 0.4,
						}}
					>
						<CalendarMonth sx={{ fontSize: 85, color: "text.disabled" }} />
					</Box>
					<Typography
						variant="h5"
						color="text.secondary"
						sx={{
							fontStyle: "italic",
							textAlign: "center",
							maxWidth: 400,
							pt: 1,
						}}
					>
						{search.trim()
							? "No meetings match your search."
							: "Create your first meeting to start collaborating with your team."}
					</Typography>
				</Box>
			);
		}

		if (activeFilter === "upcoming") {
			const actionRequired = displayMeetings.filter((m) => m.needsAvailability);
			const upcomingSoon = displayMeetings.filter(
				(m) => !m.needsAvailability && upcomingSet.has(m.id),
			);
			const rest = displayMeetings.filter(
				(m) => !m.needsAvailability && !upcomingSet.has(m.id),
			);
			return (
				<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
					<MeetingSection
						label="Action Required"
						meetings={actionRequired}
						meetingCounts={meetingCounts}
						upcomingSet={upcomingSet}
						scheduledLabels={scheduledLabels}
					/>
					<MeetingSection
						label="Upcoming"
						meetings={upcomingSoon}
						meetingCounts={meetingCounts}
						upcomingSet={upcomingSet}
						scheduledLabels={scheduledLabels}
					/>
					{rest.length > 0 && (
						<Box
							sx={{
								display: { xs: "flex", sm: "grid" },
								flexDirection: "column",
								gridTemplateColumns: {
									sm: "repeat(2, 1fr)",
									lg: "repeat(3, 1fr)",
								},
								gap: { xs: 1.5, sm: 2 },
							}}
						>
							{rest.map((m) =>
								toCard(m, meetingCounts, upcomingSet, scheduledLabels),
							)}
						</Box>
					)}
				</Box>
			);
		}

		// "past" and "by-you": flat grid, no sections
		return (
			<Box
				sx={{
					display: { xs: "flex", sm: "grid" },
					flexDirection: "column",
					gridTemplateColumns: { sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
					gap: { xs: 1.5, sm: 2 },
				}}
			>
				{displayMeetings.map((m) =>
					toCard(m, meetingCounts, upcomingSet, scheduledLabels),
				)}
			</Box>
		);
	};

	return (
		<Box sx={{ width: "100%" }}>
			{/* Mobile header */}
			<Box
				sx={{
					display: { xs: "flex", sm: "none" },
					alignItems: "center",
					justifyContent: "space-between",
					mb: 3,
				}}
			>
				<Typography variant="h4">Meetings</Typography>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							border: "1px solid",
							borderColor: "divider",
							borderRadius: 1,
							p: 1,
						}}
					>
						<Notifications sx={{ color: "text.primary", fontSize: 24 }} />
					</Box>
					<Button variant="contained" size="square" href="/">
						<Add />
					</Button>
				</Box>
			</Box>

			<Box
				sx={{
					display: "flex",
					alignItems: "flex-start",
					justifyContent: "space-between",
					mb: 2,
				}}
			>
				<Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
					<TextField
						aria-label="Search meetings"
						placeholder="Search"
						size="small"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						slotProps={{
							input: {
								startAdornment: (
									<SearchIcon
										sx={{ fontSize: 20, color: "text.disabled", mr: 0.5 }}
									/>
								),
							},
						}}
						sx={{ minWidth: 200 }}
					/>

					<Box sx={{ display: "flex", gap: 0.75 }}>
						{(["upcoming", "past", "by-you"] as const).map((f) => {
							const labels: Record<FilterType, string> = {
								upcoming: "Upcoming",
								past: "Past",
								"by-you": "By You",
							};
							return (
								<FilterChip
									key={f}
									label={labels[f]}
									count={counts[f]}
									active={activeFilter === f}
									onClick={() => setActiveFilter(f)}
								/>
							);
						})}
					</Box>
				</Box>

				<Button
					component={Link}
					href="/"
					variant="contained"
					startIcon={<Add />}
					sx={{ display: { xs: "none", md: "flex" }, flexShrink: 0 }}
				>
					Create A Meeting
				</Button>
			</Box>

			{renderMeetings()}
		</Box>
	);
};
