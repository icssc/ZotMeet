"use client";

import { ArrowBack, People, Settings } from "@mui/icons-material";
import {
	Avatar,
	Button,
	IconButton,
	Menu,
	MenuItem,
	Tab,
	Tabs,
	Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
	Calendar,
	Clock,
	MoreVertical,
	Pencil,
	Plus,
	Share2,
	Users,
} from "lucide-react";
import Link from "next/link";
import { use, useMemo, useState, useTransition } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import { GroupRole, type SelectGroup } from "@/db/schema";
import { formatDateToUSNumeric } from "@/lib/availability/utils";
import { isAnchorDateString, WEEKDAYS } from "@/lib/types/chrono";
import { createGroupInvite } from "@/server/actions/group/invite/create/action";
import { updateMemberRole } from "@/server/actions/group/update-member-role/action";
import type { MeetingWithStats } from "@/server/data/groups/queries";
import { FilterChip } from "./groups-page";

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

function DateRange({
	dates,
	meetingType,
}: {
	dates: string[];
	meetingType: "dates" | "days";
}) {
	if (!dates || dates.length === 0) return <>No dates specified</>;

	if (meetingType === "days") {
		const weekdayData = dates
			.map((dateStr) => {
				const dateString = dateStr.split("T")[0];
				if (isAnchorDateString(dateString)) {
					const date = new Date(dateStr);
					const dayIndex = date.getUTCDay();
					return { dayIndex, name: WEEKDAYS[dayIndex] };
				}
				return null;
			})
			.filter(Boolean) as { dayIndex: number; name: string }[];

		if (weekdayData.length > 0) {
			const sortedWeekdays = weekdayData
				.sort((a, b) => a.dayIndex - b.dayIndex)
				.map((day) => day.name);
			return <>{sortedWeekdays.join(", ")}</>;
		}
	}

	if (dates.length === 1) {
		return <>{formatDateToUSNumeric(new Date(dates[0]))}</>;
	}

	const sortedDates = [...dates].sort(
		(a, b) => new Date(a).getTime() - new Date(b).getTime(),
	);

	const first = formatDateToUSNumeric(new Date(sortedDates[0]));
	const last = formatDateToUSNumeric(
		new Date(sortedDates[sortedDates.length - 1]),
	);

	return <>{`${first} - ${last}`}</>;
}

function MeetingRow({
	meeting,
	currentMemberId,
}: {
	meeting: MeetingWithStats;
	currentMemberId: string;
}) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const createdByLabel =
		meeting.hostId === currentMemberId
			? "Created by You"
			: `Created by ${meeting.hostName}`;

	return (
		<div className="flex items-center justify-between rounded-xl border-gray-200 border-b px-4 py-4 transition-colors hover:bg-gray-50">
			<Link
				href={`/availability/${meeting.id}`}
				className="flex flex-1 flex-col gap-1"
			>
				<h3 className="font-medium text-base">{meeting.title}</h3>

				<div className="flex flex-wrap items-center gap-x-4 text-gray-500 text-sm">
					<div className="flex items-center gap-1">
						<Calendar className="size-4" />
						<span>
							<DateRange
								dates={meeting.dates}
								meetingType={meeting.meetingType}
							/>
						</span>
					</div>

					<div className="flex items-center gap-1">
						<Users className="size-4" />
						<span>{meeting.totalMembers} members</span>
					</div>

					<div className="flex items-center gap-1">
						<Clock className="size-4" />
						<span>
							{meeting.respondedCount}/{meeting.totalMembers} responded
						</span>
					</div>
				</div>
			</Link>

			<div className="ml-4 flex items-center gap-3">
				<p className="whitespace-nowrap font-medium text-gray-400 text-xs uppercase tracking-wide">
					{createdByLabel}
				</p>
				<IconButton
					onClick={(e) => {
						e.stopPropagation();
						setAnchorEl(open ? null : e.currentTarget);
					}}
				>
					<MoreVertical className="size-5 text-gray-500" />
				</IconButton>

				<Menu
					anchorEl={anchorEl}
					open={open}
					onClose={() => setAnchorEl(null)}
					transformOrigin={{ horizontal: "right", vertical: "top" }}
					anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
				>
					<MenuItem
						onClick={(e) => {
							e.stopPropagation();
							setAnchorEl(null);
						}}
					>
						<People className="mr-2 size-4" />
						Nudge Members
					</MenuItem>
				</Menu>
			</div>
		</div>
	);
}

function MemberAvatar({ email }: { email: string }) {
	const initials = email.split("@")[0]?.slice(0, 2).toUpperCase() ?? "??";
	return (
		<div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-slate-200 font-medium text-slate-600 text-sm">
			{initials}
		</div>
	);
}

function AdminMemberRow({
	member,
	groupId,
	isSelf,
}: {
	member: Member;
	groupId: string;
	isSelf: boolean;
}) {
	const [isPending, startTransition] = useTransition();
	const theme = useTheme();

	function handleRoleChange(value: string) {
		startTransition(async () => {
			await updateMemberRole({
				groupId,
				targetUserId: member.userId,
				role: value as GroupRole,
			});
		});
	}

	return (
		<div
			style={{ borderBottom: `1px solid ${theme.palette.divider}` }}
			className="flex h-[83px] items-center justify-between px-4 transition-colors hover:bg-gray-50/50"
		>
			<div className="flex items-center gap-4">
				<MemberAvatar email={member.email} />
				<span
					style={{ color: theme.palette.text.primary }}
					className="font-medium text-base"
				>
					{member.email.split("@")[0]}
					{isSelf && (
						<span
							style={{ color: theme.palette.text.secondary }}
							className="ml-2 text-xs"
						>
							(you)
						</span>
					)}
				</span>
			</div>

			<Select
				value={member.role}
				onValueChange={handleRoleChange}
				disabled={isSelf || isPending}
			>
				<SelectTrigger
					style={{
						backgroundColor: theme.palette.background.default,
						color: theme.palette.text.primary,
						border: `1px solid ${theme.palette.divider}`, // Added subtle border to trigger
					}}
					className="h-9 w-[140px] rounded-lg text-sm focus:ring-0 focus:ring-offset-0 disabled:opacity-50"
				>
					<SelectValue />
				</SelectTrigger>

				<SelectContent
					style={{
						backgroundColor: theme.palette.background.paper,
						color: theme.palette.text.primary,
						borderColor: theme.palette.divider,
					}}
				>
					<SelectItem value={GroupRole.ADMIN}>Admin</SelectItem>
					<SelectItem value={GroupRole.MEMBER}>Member</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}

function MembersList({
	members,
	isAdmin,
	groupId,
	currentUserId,
}: {
	members: Member[];
	isAdmin: boolean;
	groupId: string;
	currentUserId: string;
}) {
	const theme = useTheme();

	return (
		<div className="mt-4">
			<p className="mb-2 px-4 font-bold text-[#969696] text-xs uppercase tracking-wide">
				All Members ({members.length})
			</p>

			<div className="flex flex-col">
				{members.map((member) =>
					isAdmin ? (
						<AdminMemberRow
							key={member.userId}
							member={member}
							groupId={groupId}
							isSelf={member.userId === currentUserId}
						/>
					) : (
						<div
							key={member.userId}
							style={{ borderBottom: `1px solid ${theme.palette.divider}` }}
							className="flex h-[83px] items-center justify-between px-4 transition-colors hover:bg-gray-50/50"
						>
							<div className="flex items-center gap-4">
								<MemberAvatar email={member.email} />
								<span
									style={{ color: theme.palette.text.primary }}
									className="font-medium text-base"
								>
									{member.email.split("@")[0]}
									{member.userId === currentUserId && (
										<span
											style={{ color: theme.palette.text.secondary }}
											className="ml-2 text-xs"
										>
											(you)
										</span>
									)}
								</span>
							</div>

							<span
								style={{ color: theme.palette.text.secondary }}
								className="font-medium text-sm italic"
							>
								{member.role === GroupRole.ADMIN ? "Admin" : "Member"}
							</span>
						</div>
					),
				)}
			</div>
		</div>
	);
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
				await navigator.clipboard.writeText(res.inviteUrl);
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
		const now = new Date();

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

	const theme = useTheme();
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

							<IconButton size="small">
								<Pencil className="size-4" />
							</IconButton>
						</div>
					</div>
				</div>

				{/* Top left back button on mobile */}
				<div className="absolute top-5 left-5 md:hidden">
					{(tab === 1 || showSettings) && (
						<IconButton
							onClick={() => {
								setTab(0);
								setShowSettings(false);
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
							setShowSettings(false);
						}}
					>
						<People />
					</IconButton>

					{/* Settings */}
					<IconButton onClick={() => setShowSettings(true)}>
						<Settings className="size-6" />
					</IconButton>
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
						setShowSettings(false);
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
								<Plus className="size-5" />
							</Button>
						</Link>

						<Button
							variant="outlined"
							onClick={handleCreateInviteLink}
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
							<Share2 className="size-5" />
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
								startIcon={<Plus className="size-4" />}
							>
								Create New Meeting
							</Button>
						</Link>

						{/* Desktop Share */}
						<Button
							variant="outlined"
							startIcon={<Share2 className="size-4" />}
							onClick={handleCreateInviteLink}
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

			{/* Existing tab content below here */}
			{tab === 0 && !showSettings && (
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

			{tab === 1 && !showSettings && (
				<div className="mt-6">
					<MembersList
						members={members}
						isAdmin={isAdmin}
						groupId={group.id}
						currentUserId={currentUserId}
					/>
				</div>
			)}

			{showSettings && (
				<div className="mt-6 flex items-center justify-center py-32">
					<p className="text-gray-500 text-lg">Settings coming soon</p>
				</div>
			)}
		</div>
	);
}
