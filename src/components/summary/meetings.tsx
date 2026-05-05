"use client";

import { Add, CalendarMonth, Notifications } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, IconButton, Typography } from "@mui/material";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FilterChip } from "@/components/ui/filter-chip";
import MeetingCard from "@/components/ui/meeting-card";
import type { SelectMeeting } from "@/db/schema";
import {
	filterMeetingsByQuery,
	toMeetingCardProps,
} from "@/lib/meeting-card/mapper";

type FilterType = "all" | "unscheduled" | "scheduled" | "by-you";

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
	scheduledLabels?: Record<string, string>,
) => {
	const cardProps = toMeetingCardProps(meeting, {
		responderCount: meetingCounts[meeting.id] ?? 0,
		scheduledLabel: scheduledLabels?.[meeting.id],
	});
	return <MeetingCard key={meeting.id} {...cardProps} />;
};

const MeetingSection = ({
	label,
	meetings,
	meetingCounts,
	scheduledLabels,
}: {
	label: string;
	meetings: DisplayMeeting[];
	meetingCounts: Record<string, number>;
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
				{meetings.map((m) => toCard(m, meetingCounts, scheduledLabels))}
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
	const [activeFilter, setActiveFilter] = useState<FilterType>("all");

	const upcomingSet = useMemo(
		() => new Set(upcomingMeetingIds ?? []),
		[upcomingMeetingIds],
	);

	const counts = useMemo(
		() => ({
			all: meetings.length,
			unscheduled: meetings.filter((m) => !m.scheduled).length,
			scheduled: meetings.filter((m) => m.scheduled === true).length,
			"by-you": meetings.filter((m) => m.hostId === userId).length,
		}),
		[meetings, userId],
	);

	const filteredByOwner = useMemo(() => {
		switch (activeFilter) {
			case "by-you":
				return meetings.filter((m) => m.hostId === userId);
			case "unscheduled":
				return meetings.filter((m) => !m.scheduled);
			case "scheduled":
				return meetings.filter((m) => m.scheduled === true);
			default:
				return meetings;
		}
	}, [meetings, userId, activeFilter]);

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

		if (activeFilter === "scheduled") {
			const sorted = [...displayMeetings].sort(
				(a, b) => (scheduledDates?.[a.id] ?? 0) - (scheduledDates?.[b.id] ?? 0),
			);
			const upcoming = sorted.filter((m) => upcomingSet.has(m.id));
			const rest = sorted.filter((m) => !upcomingSet.has(m.id));
			return (
				<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
					<MeetingSection
						label="Upcoming"
						meetings={upcoming}
						meetingCounts={meetingCounts}
						scheduledLabels={scheduledLabels}
					/>
					<MeetingSection
						label="Scheduled"
						meetings={rest}
						meetingCounts={meetingCounts}
						scheduledLabels={scheduledLabels}
					/>
				</Box>
			);
		}

		if (activeFilter === "unscheduled") {
			const actionRequired = displayMeetings.filter((m) => m.needsAvailability);
			const rest = displayMeetings.filter((m) => !m.needsAvailability);
			return (
				<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
					<MeetingSection
						label="Action Required"
						meetings={actionRequired}
						meetingCounts={meetingCounts}
						scheduledLabels={scheduledLabels}
					/>
					<MeetingSection
						label="Unscheduled"
						meetings={rest}
						meetingCounts={meetingCounts}
						scheduledLabels={scheduledLabels}
					/>
				</Box>
			);
		}

		// "all" and "by-you": flat grid, no sections
		return (
			<Box
				sx={{
					display: { xs: "flex", sm: "grid" },
					flexDirection: "column",
					gridTemplateColumns: { sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
					gap: { xs: 1.5, sm: 2 },
				}}
			>
				{displayMeetings.map((m) => toCard(m, meetingCounts, scheduledLabels))}
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
					<IconButton
						aria-label="Create a meeting"
						component={Link}
						href="/"
						sx={{
							bgcolor: "primary.main",
							borderRadius: 1,
							"&:hover": { bgcolor: "primary.dark" },
						}}
					>
						<Add sx={{ color: "white" }} />
					</IconButton>
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
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
							border: "1px solid",
							borderColor: "divider",
							borderRadius: 1,
							px: 1,
							py: 0.5,
							minWidth: 200,
						}}
					>
						<SearchIcon sx={{ fontSize: 20, color: "text.disabled" }} />
						<input
							aria-label="Search meetings"
							type="text"
							placeholder="Search"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="bg-transparent text-base outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
						/>
					</Box>

					<Box sx={{ display: "flex", gap: 0.75 }}>
						{(["all", "unscheduled", "scheduled", "by-you"] as const).map(
							(f) => {
								const labels: Record<FilterType, string> = {
									all: "All",
									unscheduled: "Unscheduled",
									scheduled: "Scheduled",
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
							},
						)}
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
