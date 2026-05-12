"use client";

import { Add, ArrowBack, People, Settings, Share } from "@mui/icons-material";
import {
	Avatar,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Tab,
	Tabs,
	Typography,
} from "@mui/material";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FilterChip } from "@/components/ui/filter-chip";
import type { SelectGroup } from "@/db/schema";
import { useIsMobile } from "@/hooks/use-mobile";
import type { MeetingWithStats } from "@/server/data/groups/queries";
import { AddMemberDialog } from "./add-member-dialog";
import { GroupSettingsForm } from "./group-settings-form";
import { MeetingRow } from "./meeting-row";
import { MembersList } from "./members-list";
import type { GroupMember } from "./types";

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

	const {
		meetingsPendingAvailability,
		meetingsPendingAvailabilityMap,
		allMeetings,
	} = useMemo(() => {
		const getSortDate = (meeting: MeetingWithStats) =>
			meeting.scheduledDate
				? new Date(meeting.scheduledDate)
				: new Date(meeting.dates[0]);

		const meetingsPendingAvailability = meetings
			.filter((meeting) => !meeting.userHasResponded)
			.sort((a, b) => getSortDate(a).getTime() - getSortDate(b).getTime());

		const meetingsPendingAvailabilityMap = new Set(
			meetingsPendingAvailability.map((m) => m.id),
		);

		const allMeetings = [...meetings].sort(
			(a, b) => getSortDate(a).getTime() - getSortDate(b).getTime(),
		);

		return {
			meetingsPendingAvailability,
			meetingsPendingAvailabilityMap,
			allMeetings,
		};
	}, [meetings]);

	const counts = {
		all: meetings.length,
		created: meetings.filter((m) => m.hostId === currentMemberId).length,
		upcoming: meetings.filter(
			(m) => m.scheduledDate && new Date(m.scheduledDate) > new Date(),
		).length,
	};

	const displayedMeetings = allMeetings.filter((meeting) => {
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
						<div>
							<div className="mt-8">
								<p className="mb-2 font-bold text-[#969696] text-xs uppercase tracking-wide">
									Action Required ({meetingsPendingAvailability.length})
								</p>
								{meetingsPendingAvailability.map((meeting) => (
									<div
										key={meeting.id}
										className="mb-3 rounded-xl border border-gray-300"
									>
										<MeetingRow
											meeting={meeting}
											currentMemberId={currentMemberId}
											status="actionRequired"
										/>
									</div>
								))}
							</div>
							<div className="mt-8">
								<p className="mb-5 font-bold text-[#969696] text-xs uppercase tracking-wide">
									All ({displayedMeetings.length})
								</p>
								{displayedMeetings.map((meeting) => (
									<div
										key={meeting.id}
										className="mb-3 rounded-xl border border-gray-300"
									>
										<MeetingRow
											meeting={meeting}
											currentMemberId={currentMemberId}
											status={
												meetingsPendingAvailabilityMap.has(meeting.id)
													? "actionRequired"
													: meeting.scheduledDate &&
															new Date(meeting.scheduledDate) > new Date()
														? "upcoming"
														: null
											}
										/>
									</div>
								))}
							</div>
						</div>
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
