"use client";

import { Add, CalendarMonth, Notifications } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { DeleteModal } from "@/components/meetings/delete-modal";
import { FilterChip } from "@/components/ui/filter-chip";
import MeetingCard from "@/components/ui/meeting-card";
import type { SelectMeeting } from "@/db/schema";
import {
	filterMeetingsByQuery,
	getMeetingUpcomingPriority,
	getStartOfTodayMs,
	isMeetingPast,
	toMeetingCardData,
} from "@/lib/meeting-card/mapper";

type FilterType = "upcoming" | "past" | "by-you";

interface MeetingsProps {
	meetings: (SelectMeeting & {
		hostDisplayName: string | null;
		needsAvailability: boolean;
		allAvailabilityFilled: boolean;
	})[];
	memberId: string;
	meetingCounts: Record<string, number>;
	scheduledLabels?: Record<string, string>;
	scheduledDates?: Record<string, number>;
	upcomingMeetingIds?: string[];
}

type DisplayMeeting = MeetingsProps["meetings"][number];

type DeleteTarget = {
	meeting: DisplayMeeting;
	isOwner: boolean;
};

const FILTER_LABELS: Record<FilterType, string> = {
	upcoming: "Upcoming",
	past: "Past",
	"by-you": "By You",
};

const cardGridSx = {
	display: { xs: "flex", sm: "grid" },
	flexDirection: "column",
	gridTemplateColumns: { sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
	gap: { xs: 1.5, sm: 2 },
} as const;

const toCard = (
	meeting: DisplayMeeting,
	memberId: string,
	meetingCounts: Record<string, number>,
	onDeleteLeave: (target: DeleteTarget) => void,
	scheduledLabels?: Record<string, string>,
	upcomingSet?: Set<string>,
) => {
	const { meeting: _meeting, ...cardProps } = toMeetingCardData(
		meeting,
		memberId,
		{
			responderCount: meetingCounts[meeting.id] ?? 0,
			scheduledLabel: scheduledLabels?.[meeting.id],
		},
	);

	return (
		<MeetingCard
			key={meeting.id}
			{...cardProps}
			needsAvailability={meeting.needsAvailability}
			allAvailabilityFilled={meeting.allAvailabilityFilled}
			isUpcoming={upcomingSet?.has(meeting.id) ?? false}
			onDeleteLeave={() =>
				onDeleteLeave({ meeting, isOwner: cardProps.isOwner })
			}
		/>
	);
};

export const Meetings = ({
	meetings,
	memberId,
	meetingCounts,
	scheduledLabels,
	scheduledDates,
	upcomingMeetingIds,
}: MeetingsProps) => {
	const [search, setSearch] = useState("");
	const [activeFilter, setActiveFilter] = useState<FilterType>("upcoming");
	const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
	const [isDeletionPending, setIsDeletionPending] = useState(false);

	const handleDeleteLeaveRequest = useCallback((target: DeleteTarget) => {
		setDeleteTarget(target);
	}, []);

	const upcomingSet = useMemo(
		() => new Set(upcomingMeetingIds ?? []),
		[upcomingMeetingIds],
	);

	const todayTimestamp = useMemo(() => getStartOfTodayMs(), []);

	const isPastMeeting = useCallback(
		(m: DisplayMeeting): boolean =>
			isMeetingPast(m, scheduledDates, todayTimestamp),
		[scheduledDates, todayTimestamp],
	);

	const counts = useMemo(
		() => ({
			upcoming: meetings.filter((m) => !isPastMeeting(m)).length,
			past: meetings.filter(isPastMeeting).length,
			"by-you": meetings.filter((m) => m.hostId === memberId).length,
		}),
		[meetings, memberId, isPastMeeting],
	);

	const filteredMeetings = useMemo(() => {
		switch (activeFilter) {
			case "by-you":
				return meetings.filter((m) => m.hostId === memberId);
			case "past":
				return meetings.filter(isPastMeeting);
			default:
				return meetings.filter((m) => !isPastMeeting(m));
		}
	}, [meetings, memberId, activeFilter, isPastMeeting]);

	const displayMeetings = useMemo(
		() => filterMeetingsByQuery(filteredMeetings, search),
		[filteredMeetings, search],
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

		let sorted: DisplayMeeting[];

		if (activeFilter === "past") {
			sorted = [...displayMeetings].sort((a, b) => {
				const getTime = (m: DisplayMeeting) => {
					if (m.scheduled) return scheduledDates?.[m.id] ?? 0;
					const dates = (m.dates as string[] | null) ?? [];
					if (dates.length === 0) return 0;
					return Math.max(...dates.map((d) => new Date(d).getTime()));
				};
				return getTime(b) - getTime(a);
			});
		} else {
			sorted = [...displayMeetings].sort(
				(a, b) =>
					getMeetingUpcomingPriority(a, memberId, upcomingSet) -
					getMeetingUpcomingPriority(b, memberId, upcomingSet),
			);
		}

		return (
			<Box sx={cardGridSx}>
				{sorted.map((m) =>
					toCard(
						m,
						memberId,
						meetingCounts,
						handleDeleteLeaveRequest,
						scheduledLabels,
						upcomingSet,
					),
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
						{(["upcoming", "past", "by-you"] as const).map((f) => (
							<FilterChip
								key={f}
								label={FILTER_LABELS[f]}
								count={counts[f]}
								active={activeFilter === f}
								onClick={() => setActiveFilter(f)}
							/>
						))}
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

			{deleteTarget && (
				<DeleteModal
					meetingData={deleteTarget.meeting}
					isOpen
					handleOpenChange={(open) => {
						if (!open) setDeleteTarget(null);
					}}
					isOwner={deleteTarget.isOwner}
					isDeletionPending={isDeletionPending}
					onDeletionPendingChange={setIsDeletionPending}
				/>
			)}
		</Box>
	);
};
