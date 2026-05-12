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
import { useSnackbar } from "@/components/ui/snackbar-provider";
import type { GroupRole, SelectGroup } from "@/db/schema";
import { copyTextToClipboard } from "@/lib/clipboard/utils";
import { createGroupInvite } from "@/server/actions/group/invite/create/action";
import type { MeetingWithStats } from "@/server/data/groups/queries";
import { AddMemberDialog } from "./add-member-dialog";
import { GroupSettingsForm } from "./group-settings-form";
import { MeetingRow } from "./meeting-row";
import { MembersList } from "./members-list";

type Member = {
	userId: string;
	memberId: string;
	email: string;
	role: GroupRole;
};

interface GroupMemberListProps {
	group: SelectGroup;
	members: Member[];
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
	const [isCreatingInvite, setIsCreatingInvite] = useState(false);
	const [tab, setTab] = useState(0);
	const [showSettings, setShowSettings] = useState(false);
	const canShareInvites = group.createdBy === currentUserId;
	const { showSuccess, showError } = useSnackbar();
	const [activeFilter, setActiveFilter] = useState<
		"all" | "created" | "upcoming"
	>("all");
	const [showAddMembers, setShowAddMembers] = useState(false);

	async function handleCreateInviteLink() {
		if (!canShareInvites) {
			showError("Only the group creator can generate invite links.");
			return;
		}
		setIsCreatingInvite(true);
		try {
			const res = await createGroupInvite(group.id);
			if (!res.success || !res.inviteUrl) {
				showError(res.message || "Failed to generate invite link.");
				return;
			}
			try {
				const copied = await copyTextToClipboard(res.inviteUrl);
				if (!copied) {
					throw new Error("Clipboard write failed");
				}
				showSuccess("Invite link copied to clipboard.");
			} catch (_clipboardError) {
				showError("Invite link generated, but failed to copy to clipboard.");
			}
		} catch (_error) {
			showError("Failed to generate invite link.");
		} finally {
			setIsCreatingInvite(false);
		}
	}

	const { meetingsPendingAvailability, allMeetings } = useMemo(() => {
		const getSortDate = (meeting: MeetingWithStats) =>
			meeting.scheduledDate
				? new Date(meeting.scheduledDate)
				: new Date(meeting.dates[0]); // meeting window start
		// Pending Availability section
		const meetingsPendingAvailability = meetings
			.filter((meeting) => {
				return !meeting.userHasResponded;
			})
			.sort((a, b) => getSortDate(a).getTime() - getSortDate(b).getTime());
		// All meeting section
		const allMeetings = [...meetings].sort(
			(a, b) => getSortDate(a).getTime() - getSortDate(b).getTime(),
		);
		return { meetingsPendingAvailability, allMeetings };
	}, [meetings]);

	const counts = {
		all: meetings.length,
		created: meetings.filter((m) => m.hostId === currentMemberId).length,
		upcoming: meetings.filter(
			(m) => m.scheduledDate && new Date(m.scheduledDate) > new Date(),
		).length,
	};
	const displayedMeetings = allMeetings.filter((meeting) => {
		if (activeFilter === "created") {
			return meeting.hostId === currentMemberId;
		}

		if (activeFilter === "upcoming") {
			return (
				meeting.scheduledDate && new Date(meeting.scheduledDate) > new Date()
			);
		}
		return true;
	});

	// map is good for passing in the StatusBadge for each meeting with O(1) lookup
	const meetingsPendingAvailabilityMap = useMemo(
		() => new Set(meetingsPendingAvailability.map((m) => m.id)),
		[meetingsPendingAvailability],
	);

	return (
		<div>
			{/* Header */}
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

				{/* Top left back button on mobile */}
				<div className="absolute top-5 left-5 md:hidden">
					{tab === 1 && (
						<IconButton
							onClick={() => {
								setTab(0);
							}}
						>
							<ArrowBack className="size-6" />
						</IconButton>
					)}
				</div>

				<div className="absolute top-5 right-5 flex items-center gap-1 md:static md:gap-2">
					{/* People (mobile only) */}
					<IconButton
						sx={{ display: { xs: "inline-flex", md: "none" } }}
						onClick={() => {
							setTab(1);
						}}
					>
						<People />
					</IconButton>

					{isAdmin && (
						<>
							{/* Settings page (mobile only) */}
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
					sx={{
						color: {
							xs: "text.secondary",
							md: "text.primary",
						},
					}}
				>
					{group.description}
				</Typography>
			)}

			{/* Tabs */}
			<div className="hidden md:block">
				{" "}
				{/* tabs only on desktop */}
				<Tabs
					value={tab}
					onChange={(_, v) => {
						setTab(v);
					}}
					sx={{
						mt: 4,
						borderBottom: "none",
						borderColor: "divider",
					}}
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

			{/* Meetings header (mobile only) */}
			{tab === 0 && (
				<div className="mt-4 flex items-center justify-between md:hidden">
					<h2 className="font-semibold text-2xl">Meetings</h2>

					<div className="flex items-center gap-2">
						<Link href={`/?groupId=${group.id}`}>
							<Button
								variant="contained"
								sx={{
									minWidth: 44,
									width: 44,
									height: 44,
									p: 0,
									borderRadius: 2,
									bgcolor: "primary.main",
									"&:hover": {
										bgcolor: "primary.main",
									},
								}}
							>
								<Add className="size-5" />
							</Button>
						</Link>
						<Button
							variant="outlined"
							//onClick={handleCreateInviteLink}
							onClick={() => setShowAddMembers(true)}
							disabled={!canShareInvites || isCreatingInvite}
							sx={{
								minWidth: 44,
								width: 44,
								height: 44,
								p: 0,
								borderRadius: 2,
								borderColor: "divider",
								color: "text.primary",
								"&:hover": {
									borderColor: "divider",
									backgroundColor: "action.hover",
								},
							}}
						>
							<Share className="size-5" />
						</Button>
					</div>
				</div>
			)}

			{/* Toolbar */}
			<div className="mt-4 flex flex-col gap-4">
				{/* Top Row */}
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<input
						type="text"
						placeholder="Search..."
						className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-gray-500 md:max-w-sm"
					/>
					<div className="flex items-center gap-3">
						{/* Desktop Create */}
						<Link
							href={`/?groupId=${group.id}`}
							className="xs:none hidden md:block"
						>
							<Button
								variant="contained"
								startIcon={<Add className="size-4" />}
							>
								Create New Meeting
							</Button>
						</Link>

						{/* Desktop Share */}
						<Button
							variant="outlined"
							startIcon={
								<Share
									className="size-4"
									sx={{
										color:
											!canShareInvites || isCreatingInvite
												? "text.disabled"
												: "primary.main",
									}}
								/>
							}
							onClick={() => setShowAddMembers(true)}
							disabled={!canShareInvites || isCreatingInvite}
							sx={{
								display: {
									xs: "none",
									md: "inline-flex",
								},
							}}
						>
							{isCreatingInvite ? "Generating..." : "Share"}
						</Button>
					</div>
				</div>

				{/* Filter Chips Row */}
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

			{tab === 0 && (
				<div className="mt-6">
					<div className="mt-4">
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
												key={meeting.id}
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
												key={meeting.id}
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
				</div>
			)}
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
			{/* Settings Dialog (desktop only) */}
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
			{/* Add Members Dialog */}
			<AddMemberDialog
				open={showAddMembers}
				onClose={() => setShowAddMembers(false)}
				groupId={group.id}
				excludeUserIds={members.map((m) => m.userId)}
				canLoadInviteLink={canShareInvites}
			/>
		</div>
	);
}
