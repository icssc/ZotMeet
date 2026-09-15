"use client";

import { Add, Notifications } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { Badge, Box, Button, TextField, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { MobileNotificationsDrawer } from "@/components/groups/mobile-notifications-drawer";
import { DeleteModal } from "@/components/meetings/delete-modal";
import { FilterChip } from "@/components/ui/filter-chip";
import MeetingCard from "@/components/ui/meeting-card";
import type { SelectMeeting } from "@/db/schema";
import type { NotificationItem } from "@/lib/auth/user";
import { toMeetingCardData } from "@/lib/meeting-card/mapper";
import {
	buildMeetingsListModel,
	getStartOfTodayMs,
	MEETINGS_LIST_FILTER_LABELS,
	MEETINGS_LIST_FILTERS,
	type MeetingsListFilter,
} from "@/lib/meetings/utils";

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
	notifications: NotificationItem[];
}

type DisplayMeeting = MeetingsProps["meetings"][number];

type DeleteTarget = {
	meeting: DisplayMeeting;
	isOwner: boolean;
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
	isPast?: boolean,
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
			isPast={isPast}
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
	notifications,
}: MeetingsProps) => {
	const [search, setSearch] = useState("");
	const [activeFilter, setActiveFilter] =
		useState<MeetingsListFilter>("upcoming");
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

	// Counts, filter, search and sort — the same model the Expo app builds.
	// Read on every render, not defaulted inside the memo, so a list that stays
	// mounted across midnight re-buckets on its next render.
	const todayMs = getStartOfTodayMs();
	const { counts, meetings: displayMeetings } = useMemo(
		() =>
			buildMeetingsListModel({
				meetings,
				memberId,
				filter: activeFilter,
				search,
				scheduledDates,
				upcomingSet,
				todayMs,
			}),
		[
			meetings,
			memberId,
			activeFilter,
			search,
			scheduledDates,
			upcomingSet,
			todayMs,
		],
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
						py: 24,
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: 137,
							height: 137,
						}}
					>
						<Image src="/mascot.svg" alt="mascot" width={111} height={111} />
					</Box>
					<Typography
						variant="h5"
						color="textSecondary"
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

		return (
			<Box sx={cardGridSx}>
				{displayMeetings.map((m) =>
					toCard(
						m,
						memberId,
						meetingCounts,
						handleDeleteLeaveRequest,
						activeFilter === "past",
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
						{MEETINGS_LIST_FILTERS.map((f) => (
							<FilterChip
								key={f}
								label={MEETINGS_LIST_FILTER_LABELS[f]}
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
