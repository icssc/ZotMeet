"use client";

import { Add, CalendarMonth, Notifications } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { Badge, Box, Button, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { MobileNotificationsDrawer } from "@/components/groups/mobile-notifications-drawer";
import { DeleteModal } from "@/components/meetings/delete-modal";
import { FilterChip } from "@/components/ui/filter-chip";
import MeetingCard from "@/components/ui/meeting-card";
import type { SelectMeeting } from "@/db/schema";
import type { NotificationItem } from "@/lib/auth/user";
import {
	filterMeetingsByQuery,
	toMeetingCardData,
} from "@/lib/meeting-card/mapper";

type FilterType = "all" | "unscheduled" | "scheduled" | "by-you";

interface MeetingsProps {
	meetings: (SelectMeeting & {
		hostDisplayName: string | null;
		needsAvailability: boolean;
	})[];
	memberId: string;
	meetingCounts: Record<string, number>;
	scheduledLabels?: Record<string, string>;
	scheduledDates?: Record<string, number>;
	upcomingMeetingIds?: string[];
	notifications: NotificationItem[];
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

type DeleteTarget = {
	meeting: DisplayMeeting;
	isOwner: boolean;
};

const toCard = (
	meeting: DisplayMeeting,
	memberId: string,
	meetingCounts: Record<string, number>,
	onDeleteLeave: (target: DeleteTarget) => void,
	scheduledLabels?: Record<string, string>,
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
			onDeleteLeave={() =>
				onDeleteLeave({ meeting, isOwner: cardProps.isOwner })
			}
		/>
	);
};

const MeetingSection = ({
	label,
	meetings,
	memberId,
	meetingCounts,
	onDeleteLeave,
	scheduledLabels,
}: {
	label: string;
	meetings: DisplayMeeting[];
	memberId: string;
	meetingCounts: Record<string, number>;
	onDeleteLeave: (target: DeleteTarget) => void;
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
					toCard(m, memberId, meetingCounts, onDeleteLeave, scheduledLabels),
				)}
			</Box>
		</Box>
	);
};

export const Meetings = ({
	meetings,
	memberId,
	meetingCounts,
	scheduledLabels,
	scheduledDates,
	upcomingMeetingIds,
	notifications,
}: MeetingsProps) => {
	const [search, setSearch] = useState("");
	const [activeFilter, setActiveFilter] = useState<FilterType>("all");
	const [notificationsOpen, setNotificationsOpen] = useState(false);

	const unreadCount = notifications.filter((n) => !n.readAt).length;
	const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
	const [isDeletionPending, setIsDeletionPending] = useState(false);

	const handleDeleteLeaveRequest = useCallback((target: DeleteTarget) => {
		setDeleteTarget(target);
	}, []);

	const upcomingSet = useMemo(
		() => new Set(upcomingMeetingIds ?? []),
		[upcomingMeetingIds],
	);

	const counts = useMemo(
		() => ({
			all: meetings.length,
			unscheduled: meetings.filter((m) => !m.scheduled).length,
			scheduled: meetings.filter((m) => m.scheduled === true).length,
			"by-you": meetings.filter((m) => m.hostId === memberId).length,
		}),
		[meetings, memberId],
	);

	const filteredByOwner = useMemo(() => {
		switch (activeFilter) {
			case "by-you":
				return meetings.filter((m) => m.hostId === memberId);
			case "unscheduled":
				return meetings.filter((m) => !m.scheduled);
			case "scheduled":
				return meetings.filter((m) => m.scheduled === true);
			default:
				return meetings;
		}
	}, [meetings, memberId, activeFilter]);

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
						memberId={memberId}
						meetingCounts={meetingCounts}
						onDeleteLeave={handleDeleteLeaveRequest}
						scheduledLabels={scheduledLabels}
					/>
					<MeetingSection
						label="Scheduled"
						meetings={rest}
						memberId={memberId}
						meetingCounts={meetingCounts}
						onDeleteLeave={handleDeleteLeaveRequest}
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
						memberId={memberId}
						meetingCounts={meetingCounts}
						onDeleteLeave={handleDeleteLeaveRequest}
						scheduledLabels={scheduledLabels}
					/>
					<MeetingSection
						label="Unscheduled"
						meetings={rest}
						memberId={memberId}
						meetingCounts={meetingCounts}
						onDeleteLeave={handleDeleteLeaveRequest}
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
				{displayMeetings.map((m) =>
					toCard(
						m,
						memberId,
						meetingCounts,
						handleDeleteLeaveRequest,
						scheduledLabels,
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
				<Typography variant="h3">Meetings</Typography>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
					<Badge badgeContent={unreadCount} color="primary">
						<Button
							variant="outlined"
							size="square"
							onClick={() => setNotificationsOpen(true)}
						>
							<Notifications sx={{ color: "text.primary", fontSize: 24 }} />
						</Button>
					</Badge>
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

			<MobileNotificationsDrawer
				open={notificationsOpen}
				onClose={() => setNotificationsOpen(false)}
				notifications={notifications}
			/>

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
