"use client";

import { nudgePendingMembers } from "@actions/meeting/nudge/action";
import { Add, ArrowBack, People, Settings, Share } from "@mui/icons-material";
import {
	Avatar,
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	MenuItem,
	Tab,
	Tabs,
	Typography,
} from "@mui/material";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FilterChip } from "@/components/ui/filter-chip";
import MeetingCard from "@/components/ui/meeting-card";
import type { SelectGroup } from "@/db/schema";
import { useIsMobile } from "@/hooks/use-mobile";
import { toMeetingCardProps } from "@/lib/meeting-card/mapper";
import { buildScheduledLabel } from "@/lib/meetings/utils";
import type { MeetingWithStats } from "@/server/data/groups/queries";
import { useSnackbar } from "../ui/snackbar-provider";
import { AddMemberDialog } from "./add-member-dialog";
import { GroupSettingsForm } from "./group-settings-form";
import { MembersList } from "./members-list";
import type { GroupMember } from "./types";

const cardGridSx = {
	display: { xs: "flex", sm: "grid" } as const,
	flexDirection: "column" as const,
	gridTemplateColumns: { sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
	gap: { xs: 1.5, sm: 2 },
};

function GroupMeetingCard({
	meeting,
	currentMemberId,
	status,
}: {
	meeting: MeetingWithStats;
	currentMemberId: string;
	status: "actionRequired" | "upcoming" | null;
}) {
	const [isNudging, setIsNudging] = useState(false);
	const { showSuccess, showError } = useSnackbar();
	const isOwner = meeting.hostId === currentMemberId;

	const scheduledLabel =
		meeting.scheduledDate &&
		meeting.scheduledFromTime &&
		meeting.scheduledToTime
			? buildScheduledLabel(
					meeting.scheduledDate,
					meeting.scheduledFromTime,
					meeting.scheduledToTime,
				)
			: undefined;

	const cardProps = toMeetingCardProps(
		{ ...meeting, hostDisplayName: meeting.hostName },
		{ responderCount: meeting.respondedCount, scheduledLabel },
	);

	const nudgeItem = isOwner ? (
		<MenuItem
			disabled={isNudging}
			onClick={async (e) => {
				e.stopPropagation();
				setIsNudging(true);
				try {
					const result = await nudgePendingMembers(meeting.id);
					if (result.success) showSuccess(result.message);
					else showError(result.message);
				} catch {
					showError("Failed to send nudge. Please try again.");
				} finally {
					setIsNudging(false);
				}
			}}
		>
			<People sx={{ mr: 1, fontSize: 16 }} />
			Nudge Members
		</MenuItem>
	) : undefined;

	return (
		<MeetingCard
			{...cardProps}
			scheduled={Boolean(meeting.scheduledDate)}
			isOwner={isOwner}
			totalMembers={meeting.totalMembers}
			needsAvailability={status === "actionRequired"}
			allAvailabilityFilled={meeting.respondedCount >= meeting.totalMembers}
			isUpcoming={status === "upcoming"}
			isPast={Boolean(
				meeting.scheduledDate && new Date(meeting.scheduledDate) < new Date(),
			)}
			extraMenuItems={nudgeItem}
		/>
	);
}

interface GroupMemberListProps {
	group: SelectGroup;
	members: GroupMember[];
	meetings: MeetingWithStats[];
	isAdmin: boolean;
	currentUserId: string;
	currentMemberId: string;
}

export function GroupMemberList({
	group,
	members,
	meetings,
	isAdmin,
	currentUserId,
	currentMemberId,
}: GroupMemberListProps) {
	const [tab, setTab] = useState(0);
	const [showSettings, setShowSettings] = useState(false);
	const [showAddMembers, setShowAddMembers] = useState(false);
	const isMobile = useIsMobile();
	const [activeFilter, setActiveFilter] = useState<
		"all" | "created" | "upcoming"
	>("all");

	const { allMeetingsSorted, upcomingSet } = useMemo(() => {
		const startOfToday = new Date();
		startOfToday.setHours(0, 0, 0, 0);
		const windowEnd = startOfToday.getTime() + 3 * 24 * 60 * 60 * 1000;

		const upcomingSet = new Set(
			meetings
				.filter((m) => {
					if (!m.scheduledDate) return false;
					const t = m.scheduledDate.getTime();
					return t >= startOfToday.getTime() && t <= windowEnd;
				})
				.map((m) => m.id),
		);

		const getPriority = (m: MeetingWithStats) => {
			if (!m.userHasResponded && !m.scheduledDate) return 0;
			if (
				m.respondedCount >= m.totalMembers &&
				m.hostId === currentMemberId &&
				!m.scheduledDate
			)
				return 1;
			if (upcomingSet.has(m.id)) return 2;
			if (m.scheduledDate) return 3;
			return 4;
		};

		const getSortDate = (m: MeetingWithStats) =>
			m.scheduledDate
				? m.scheduledDate.getTime()
				: new Date(m.dates[0]).getTime();

		const allMeetingsSorted = [...meetings].sort((a, b) => {
			const pDiff = getPriority(a) - getPriority(b);
			if (pDiff !== 0) return pDiff;
			return getSortDate(a) - getSortDate(b);
		});

		return { allMeetingsSorted, upcomingSet };
	}, [meetings, currentMemberId]);

	const counts = {
		all: meetings.length,
		created: meetings.filter((m) => m.hostId === currentMemberId).length,
		upcoming: meetings.filter(
			(m) => m.scheduledDate && new Date(m.scheduledDate) > new Date(),
		).length,
	};

	const displayedMeetings = allMeetingsSorted.filter((meeting) => {
		if (activeFilter === "created") return meeting.hostId === currentMemberId;
		if (activeFilter === "upcoming") {
			return (
				meeting.scheduledDate && new Date(meeting.scheduledDate) > new Date()
			);
		}
		return true;
	});

	const shareButton = (
		<Button
			variant="outlined"
			size={isMobile ? "square" : undefined}
			onClick={() => setShowAddMembers(true)}
			disabled={!isAdmin}
		>
			<Share
				sx={{
					color: !isAdmin ? "text.disabled" : "primary.main",
				}}
			/>
			<Typography className="hidden md:block">Share</Typography>
		</Button>
	);

	const createButton = (
		<Link href={`/?groupId=${group.id}`}>
			<Button variant="contained" size={isMobile ? "square" : undefined}>
				<Add />
				<Typography className="hidden md:block">Create New Meeting</Typography>
			</Button>
		</Link>
	);

	return (
		<div>
			<div className="mb-4 flex flex-col items-center gap-4 text-center md:flex-row md:items-start md:justify-between md:text-left">
				<div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-4">
					<Avatar
						src={group.icon ?? "/icssc-logo.svg"}
						alt="Group Icon"
						sx={{
							width: { xs: 100, md: 80 },
							height: { xs: 100, md: 80 },
						}}
					/>
					<div className="flex flex-col items-center md:items-start">
						<div className="flex items-center gap-2">
							<h1 className="font-bold font-figtree text-3xl md:text-5xl">
								{group.name}
							</h1>
						</div>
					</div>
				</div>

				{/* Mobile back button (members tab only) */}
				<div className="absolute top-5 left-5 md:hidden">
					{tab === 1 && (
						<IconButton onClick={() => setTab(0)}>
							<ArrowBack className="size-6" />
						</IconButton>
					)}
				</div>

				<div className="absolute top-5 right-5 flex items-center gap-1 md:static md:gap-2">
					{/* Members tab toggle (mobile only) */}
					<IconButton
						sx={{ display: { xs: "inline-flex", md: "none" } }}
						onClick={() => setTab(1)}
					>
						<People />
					</IconButton>

					{/* Settings — navigates on mobile, opens dialog on desktop */}
					{isAdmin && (
						<>
							<Link href={`/groups/${group.id}/settings`} className="md:hidden">
								<IconButton>
									<Settings className="size-6" />
								</IconButton>
							</Link>
							<IconButton
								sx={{ display: { xs: "none", md: "inline-flex" } }}
								onClick={() => setShowSettings(true)}
							>
								<Settings className="size-6" />
							</IconButton>
						</>
					)}
				</div>
			</div>

			{group.description && (
				<Typography
					className="mt-4 text-center md:text-left"
					variant="body2"
					sx={{ color: { xs: "text.secondary", md: "text.primary" } }}
				>
					{group.description}
				</Typography>
			)}

			{/* Desktop tabs */}
			<div className="hidden md:block">
				<Tabs
					value={tab}
					onChange={(_, v) => setTab(v)}
					sx={{ mt: 4, borderBottom: "none", borderColor: "divider" }}
				>
					<Tab
						label={`Meetings (${meetings.length})`}
						sx={{ textTransform: "none" }}
					/>
					<Tab
						label={`Members (${members.length})`}
						sx={{ textTransform: "none" }}
					/>
				</Tabs>
			</div>

			<div className="mt-4 flex flex-col gap-4">
				{/* Mobile-only header row: section title + action buttons */}
				<div className="flex items-center justify-between md:hidden">
					<h2 className="font-semibold text-2xl">
						{tab === 0 ? "Meetings" : "Members"}
					</h2>
					<div className="flex items-center gap-2">
						{tab === 0 && createButton}
						{shareButton}
					</div>
				</div>

				{/* Search input + desktop action buttons */}
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<input
						type="text"
						placeholder="Search..."
						className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-gray-500 md:max-w-sm"
					/>
					<div className="hidden items-center gap-2 md:flex">
						{tab === 0 && createButton}
						{shareButton}
					</div>
				</div>

				{/* Filter chips (meetings tab only) */}
				{tab === 0 && (
					<div className="flex flex-wrap gap-2">
						<FilterChip
							label="All"
							count={counts.all}
							active={activeFilter === "all"}
							onClick={() => setActiveFilter("all")}
						/>
						<FilterChip
							label="By You"
							count={counts.created}
							active={activeFilter === "created"}
							onClick={() => setActiveFilter("created")}
						/>
						<FilterChip
							label="Upcoming"
							count={counts.upcoming}
							active={activeFilter === "upcoming"}
							onClick={() => setActiveFilter("upcoming")}
						/>
					</div>
				)}
			</div>

			{/* Meetings tab */}
			{tab === 0 && (
				<div className="mt-6">
					{meetings.length > 0 ? (
						<Box sx={cardGridSx}>
							{displayedMeetings.map((meeting) => (
								<GroupMeetingCard
									key={meeting.id}
									meeting={meeting}
									currentMemberId={currentMemberId}
									status={
										meeting.scheduledDate
											? upcomingSet.has(meeting.id)
												? "upcoming"
												: null
											: !meeting.userHasResponded
												? "actionRequired"
												: null
									}
								/>
							))}
						</Box>
					) : (
						<div className="flex items-center justify-center py-32">
							<p className="text-gray-500 text-lg italic">No meetings yet!</p>
						</div>
					)}
				</div>
			)}

			{/* Members tab */}
			{tab === 1 && (
				<div className="mt-6">
					<MembersList
						members={members}
						isAdmin={isAdmin}
						groupId={group.id}
						currentUserId={currentUserId}
					/>
				</div>
			)}

			{/* Settings dialog (desktop only) */}
			<Dialog
				open={showSettings}
				onClose={() => setShowSettings(false)}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Group Settings</DialogTitle>
				<DialogContent>
					<GroupSettingsForm
						group={group}
						onCancel={() => setShowSettings(false)}
					/>
				</DialogContent>
			</Dialog>

			{/* Add Members dialog */}
			<AddMemberDialog
				open={showAddMembers}
				onClose={() => setShowAddMembers(false)}
				groupId={group.id}
				excludeUserIds={members.map((m) => m.userId)}
				canLoadInviteLink={isAdmin}
			/>
		</div>
	);
}
