"use client";

import { People } from "@mui/icons-material";
import { Button, IconButton, Menu, MenuItem, Tab, Tabs } from "@mui/material";
import {
	Calendar,
	Clock,
	MoreVertical,
	Pencil,
	Plus,
	Settings,
	Share2,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
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
		<div className="flex items-center justify-between border-gray-200 border-b px-4 py-4 transition-colors hover:bg-gray-50">
			<Link
				href={`/availability/${meeting.id}`}
				className="flex flex-1 flex-col gap-1"
			>
				<h3 className="font-medium text-base text-gray-900">{meeting.title}</h3>

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
							// handle nudge members
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
		<div className="flex h-[83px] items-center justify-between border-black/10 border-b px-4">
			<div className="flex items-center gap-4">
				<MemberAvatar email={member.email} />
				<span className="font-medium text-[#0a0a0a] text-base">
					{member.email.split("@")[0]}
					{isSelf && <span className="ml-2 text-gray-400 text-xs">(you)</span>}
				</span>
			</div>
			<Select
				value={member.role}
				onValueChange={handleRoleChange}
				disabled={isSelf || isPending}
			>
				<SelectTrigger className="h-9 w-[140px] rounded-lg border-0 bg-[#f5f5f5] text-sm focus:ring-0 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
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
	return (
		<div className="overflow-clip rounded-[10px] border border-black/10 bg-white">
			<div className="border-black/10 border-b bg-[#f5f5f5] px-4 py-4">
				<h2 className="font-semibold text-[#0a0a0a] text-base">All Members</h2>
			</div>
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
						className="flex h-[83px] items-center justify-between border-black/10 border-b px-4 last:border-b-0"
					>
						<div className="flex items-center gap-4">
							<MemberAvatar email={member.email} />
							<span className="font-medium text-[#0a0a0a] text-base">
								{member.email.split("@")[0]}
							</span>
						</div>
						<span className="font-medium text-[#3d3d3d] text-sm italic">
							{member.role === GroupRole.ADMIN ? "Admin" : "Member"}
						</span>
					</div>
				),
			)}
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
	const canShareInvites = group.createdBy === currentUserId;
	const { showSuccess, showError } = useSnackbar();

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

	const { upcomingMeetings, allMeetings } = useMemo(() => {
		const now = new Date();

		const getSortDate = (meeting: MeetingWithStats) =>
			meeting.scheduledDate
				? new Date(meeting.scheduledDate)
				: new Date(meeting.dates[0]); // meeting window start

		// Upcoming section: scheduled + future
		const upcomingMeetings = meetings
			.filter((meeting) => {
				if (!meeting.scheduledDate) return false;
				return new Date(meeting.scheduledDate) > now;
			})
			.sort((a, b) => getSortDate(a).getTime() - getSortDate(b).getTime());

		// All meeting section: unscheduled + scheduled meetings in the past
		const allMeetings = meetings
			.filter((meeting) => {
				if (!meeting.scheduledDate) return true;
				return new Date(meeting.scheduledDate) <= now;
			})
			.sort((a, b) => getSortDate(a).getTime() - getSortDate(b).getTime());

		return { upcomingMeetings, allMeetings };
	}, [meetings]);

	return (
		<div>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<h1 className="font-bold font-figtree text-5xl">{group.name}</h1>
					<button
						type="button"
						className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
					>
						<Pencil className="size-5" />
					</button>
				</div>
				<div className="flex items-center gap-3">
					<Link href={`/?groupId=${group.id}`}>
						<Button variant="contained" startIcon={<Plus className="size-4" />}>
							Create New Meeting
						</Button>
					</Link>
					<Button
						variant="outlined"
						startIcon={<Share2 className="size-4" />}
						onClick={handleCreateInviteLink}
						disabled={!canShareInvites || isCreatingInvite}
						title={
							!canShareInvites
								? "Only the group creator can share invite links."
								: undefined
						}
					>
						{isCreatingInvite ? "Generating..." : "Share"}
					</Button>
				</div>
			</div>

			<Tabs
				value={tab}
				onChange={(_, v) => setTab(v)}
				sx={{ mt: 3, borderBottom: 1, borderColor: "divider" }}
			>
				<Tab
					icon={<Calendar className="size-4" />}
					iconPosition="start"
					label={`All Meetings (${meetings.length})`}
				/>
				<Tab
					icon={<Users className="size-4" />}
					iconPosition="start"
					label={`Members (${members.length})`}
				/>
				<Tab
					icon={<Settings className="size-4" />}
					iconPosition="start"
					label="Settings"
				/>
			</Tabs>

			{tab === 0 && (
				<div className="mt-4">
					{meetings.length > 0 ? (
						<div>
							<div className="mt-8">
								<p className="p-1 font-bold text-gray-400">
									UPCOMING ({upcomingMeetings.length})
								</p>

								{upcomingMeetings.map((meeting) => (
									<div className="rounded-lg border border-gray-200">
										<MeetingRow
											key={meeting.id}
											meeting={meeting}
											currentMemberId={currentMemberId}
										/>
									</div>
								))}
							</div>

							<div className="mt-8">
								<p className="p-1 font-bold text-gray-400">
									ALL ({allMeetings.length})
								</p>

								{allMeetings.map((meeting) => (
									<div className="rounded-lg border border-gray-200">
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
			)}

			{tab === 1 && (
				<div className="mt-4">
					<MembersList
						members={members}
						isAdmin={isAdmin}
						groupId={group.id}
						currentUserId={currentUserId}
					/>
				</div>
			)}

			{tab === 2 && (
				<div className="mt-4 flex items-center justify-center py-32">
					<p className="text-gray-500 text-lg">Settings coming soon</p>
				</div>
			)}
		</div>
	);
}
