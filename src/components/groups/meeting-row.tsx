import { nudgePendingMembers } from "@actions/meeting/nudge/action";
import { People } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { Calendar, Clock, MoreVertical, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import type { MeetingWithStats } from "@/server/data/groups/queries";
import { DateRange } from "./date-range";
import { StatusBadge } from "./status-badge";

export function MeetingRow({
	meeting,
	currentMemberId,
	status,
}: {
	meeting: MeetingWithStats;
	currentMemberId: string;
	status: "actionRequired" | "upcoming" | null;
}) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [isNudging, setIsNudging] = useState(false);
	const { showSuccess, showError } = useSnackbar();
	const open = Boolean(anchorEl);
	const isOwner = meeting.hostId === currentMemberId;
	const createdByLabel = isOwner
		? "Created by You"
		: `Created by ${meeting.hostName}`;

	return (
		<div className="relative flex items-center justify-between rounded-xl border-gray-200 border-b px-4 py-4 transition-colors hover:bg-primary/5">
			<Link
				href={`/availability/${meeting.id}`}
				className="absolute inset-0 rounded-xl"
				aria-label={`Open ${meeting.title}`}
			/>
			<div className="pointer-events-none relative z-10 flex flex-1 flex-col gap-1">
				<div className="flex flex-wrap items-center gap-2">
					<h3 className="font-medium text-base">{meeting.title}</h3>
					{status && <StatusBadge status={status} />}
				</div>

				<div className="flex flex-wrap items-center gap-x-4 text-gray-500 text-sm">
					<div className="flex items-center gap-1">
						<Calendar className="size-4" />
						<span>
							<DateRange
								dates={
									meeting.scheduledDate
										? [meeting.scheduledDate.toISOString()]
										: meeting.dates
								}
								meetingType={
									meeting.scheduledDate ? "dates" : meeting.meetingType
								}
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

			<div className="relative z-20 ml-4 flex items-center gap-3">
				<p className="pointer-events-none whitespace-nowrap font-medium text-gray-400 text-xs uppercase tracking-wide">
					{createdByLabel}
				</p>
				{isOwner && (
					<>
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
								disabled={isNudging}
								onClick={async (e) => {
									e.stopPropagation();
									setAnchorEl(null);
									setIsNudging(true);
									try {
										const result = await nudgePendingMembers(meeting.id);
										if (result.success) {
											showSuccess(result.message);
										} else {
											showError(result.message);
										}
									} catch {
										showError("Failed to send nudge. Please try again.");
									} finally {
										setIsNudging(false);
									}
								}}
							>
								<People className="mr-2 size-4" />
								Nudge Members
							</MenuItem>
						</Menu>
					</>
				)}
			</div>
		</div>
	);
}
