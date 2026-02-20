"use client";

import {
	Bell,
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
import { useTransition } from "react";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/custom/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { GroupRole, type SelectGroup } from "@/db/schema";
import { formatDateToUSNumeric } from "@/lib/availability/utils";
import { isAnchorDateString, WEEKDAYS } from "@/lib/types/chrono";
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

function MeetingRow({ meeting }: { meeting: MeetingWithStats }) {
	return (
		<Link href={`/availability/${meeting.id}`}>
			<div className="flex items-center justify-between border-gray-200 border-b px-4 py-4 transition-colors hover:bg-gray-50">
				<div className="flex flex-col gap-1">
					<h3 className="font-medium text-base text-gray-900">
						{meeting.title}
					</h3>
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
				</div>
				<div className="flex items-center gap-2">
					<button
						type="button"
						className="flex items-center gap-1.5 rounded border border-gray-300 px-3 py-1.5 font-medium text-sm uppercase tracking-wide transition-colors hover:bg-gray-100"
						onClick={(e) => e.preventDefault()}
					>
						<Bell className="size-4" />
						Nudge Members
					</button>
					<button
						type="button"
						className="rounded p-1 transition-colors hover:bg-gray-100"
						onClick={(e) => e.preventDefault()}
					>
						<MoreVertical className="size-5 text-gray-500" />
					</button>
				</div>
			</div>
		</Link>
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
}: GroupMemberListProps) {
	return (
		<div>
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<h1 className="font-bold font-montserrat text-5xl">{group.name}</h1>
					<button
						type="button"
						className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
					>
						<Pencil className="size-5" />
					</button>
				</div>
				<div className="flex items-center gap-3">
					<Link href={`/?groupId=${group.id}`}>
						<button
							type="button"
							className="flex items-center gap-2 rounded bg-black px-4 py-2 font-medium text-sm text-white uppercase tracking-wide transition-colors hover:bg-gray-800"
						>
							<Plus className="size-4" />
							Create New Meeting
						</button>
					</Link>
					<button
						type="button"
						className="flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 font-medium text-sm uppercase tracking-wide transition-colors hover:bg-gray-50"
					>
						<Share2 className="size-4" />
						Share
					</button>
				</div>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="meetings" className="mt-6">
				<TabsList className="w-full border-gray-200 border-b">
					<TabsTrigger
						value="meetings"
						className="flex items-center gap-2 px-6 pb-3 text-sm uppercase tracking-wide"
					>
						<Calendar className="size-4" />
						All Meetings ({meetings.length})
					</TabsTrigger>
					<TabsTrigger
						value="members"
						className="flex items-center gap-2 px-6 pb-3 text-sm uppercase tracking-wide"
					>
						<Users className="size-4" />
						Members ({members.length})
					</TabsTrigger>
					<TabsTrigger
						value="settings"
						className="flex items-center gap-2 px-6 pb-3 text-sm uppercase tracking-wide"
					>
						<Settings className="size-4" />
						Settings
					</TabsTrigger>
				</TabsList>

				<TabsContent value="meetings" className="mt-4">
					{meetings.length > 0 ? (
						<div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
							{meetings.map((meeting) => (
								<MeetingRow key={meeting.id} meeting={meeting} />
							))}
						</div>
					) : (
						<div className="flex items-center justify-center py-32">
							<p className="text-gray-500 text-lg italic">No meetings yet!</p>
						</div>
					)}
				</TabsContent>

				<TabsContent value="members" className="mt-4">
					<MembersList
						members={members}
						isAdmin={isAdmin}
						groupId={group.id}
						currentUserId={currentUserId}
					/>
				</TabsContent>

				<TabsContent value="settings" className="mt-4">
					<div className="flex items-center justify-center py-32">
						<p className="text-gray-500 text-lg">Settings coming soon</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
