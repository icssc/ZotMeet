"use client";

import { Add } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FilterChip } from "@/components/groups/groups-page";
import MeetingCard from "@/components/ui/meeting-card";
import type { SelectMeeting } from "@/db/schema";
import {
	filterMeetingsByQuery,
	toMeetingCardProps,
} from "@/lib/meeting-card/mapper";

type FilterType = "all" | "by-you" | "upcoming";

interface MeetingsProps {
	meetings: (SelectMeeting & { hostDisplayName: string | null })[];
	userId: string;
	meetingCounts: Record<string, number>;
	scheduledLabels?: Record<string, string>;
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
			<Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
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
}: MeetingsProps) => {
	const [search, setSearch] = useState("");
	const [activeFilter, setActiveFilter] = useState<FilterType>("all");

	const counts = useMemo(
		() => ({
			all: meetings.length,
			"by-you": meetings.filter((m) => m.hostId === userId).length,
			upcoming: meetings.filter((m) => m.scheduled === true).length,
		}),
		[meetings, userId],
	);

	const filteredByOwner = useMemo(() => {
		switch (activeFilter) {
			case "by-you":
				return meetings.filter((m) => m.hostId === userId);
			case "upcoming":
				return meetings.filter((m) => m.scheduled === true);
			default:
				return meetings;
		}
	}, [meetings, userId, activeFilter]);

	const displayMeetings = useMemo(
		() => filterMeetingsByQuery(filteredByOwner, search),
		[filteredByOwner, search],
	);

	return (
		<Box sx={{ width: "100%" }}>
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
							type="text"
							placeholder="Search"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="bg-transparent text-base outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
						/>
					</Box>

					<Box sx={{ display: "flex", gap: 0.75 }}>
						{(["all", "by-you", "upcoming"] as const).map((f) => {
							const label =
								f === "all" ? "All" : f === "by-you" ? "By You" : "Upcoming";
							return (
								<FilterChip
									key={f}
									label={label}
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

			{displayMeetings.length === 0 ? (
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						borderRadius: 3,
						border: "2px solid",
						borderColor: "divider",
						bgcolor: "background.paper",
						p: 4,
					}}
				>
					<Typography variant="h6" color="text.secondary">
						{search.trim()
							? "No meetings match your search."
							: "No meetings found."}
					</Typography>
				</Box>
			) : (
				<>
					{/* Mobile: two sections */}
					<Box
						sx={{
							display: { xs: "flex", sm: "none" },
							flexDirection: "column",
							gap: 3,
						}}
					>
						<MeetingSection
							label="Action Required"
							meetings={displayMeetings.filter((m) => !m.scheduled)}
							meetingCounts={meetingCounts}
							scheduledLabels={scheduledLabels}
						/>
						<MeetingSection
							label="All"
							meetings={displayMeetings.filter((m) => m.scheduled)}
							meetingCounts={meetingCounts}
							scheduledLabels={scheduledLabels}
						/>
					</Box>

					{/* Desktop: grid */}
					<Box
						sx={{
							display: { xs: "none", sm: "grid" },
							gridTemplateColumns: {
								sm: "repeat(2, 1fr)",
								lg: "repeat(3, 1fr)",
							},
							gap: 2,
						}}
					>
						{displayMeetings.map((m) =>
							toCard(m, meetingCounts, scheduledLabels),
						)}
					</Box>
				</>
			)}
		</Box>
	);
};
