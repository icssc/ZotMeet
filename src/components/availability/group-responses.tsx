import { NotificationsOutlined } from "@mui/icons-material";
import { Avatar, Button, Chip, Switch, Typography } from "@mui/material/";
import { XIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import { cloneDates } from "@/lib/availability/utils";
import {
	computeGroupMembersForRange,
	type GroupMembersForRange,
	type MemberRangeStatus,
	statusForMember,
} from "@/lib/availability/group-query";
import type { Member, SelectionStateType } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";
import {
	getNudgeCooldown,
	nudgePendingMembers,
} from "@/server/actions/meeting/nudge/action";
import {
	useActiveSelectionRange,
	useAvailabilityStore,
} from "@/store/useAvailabilityStore";

const EN_DASH = "\u2013";

const RESPONDER_CHIP_CLASS: Record<MemberRangeStatus, string> = {
	available: "",
	"if-needed": "[&_.MuiChip-label]:italic",
	unavailable: "[&_.MuiChip-label]:line-through",
};

/**
 * Formats a selection range for display in the sidebar. The range is a
 * rectangle in (day, time) space, not a continuous interval, so the day and
 * time components are formatted independently:
 *
 *   - single cell:     "Apr 4, 8:00 AM – 8:15 AM"
 *   - same-day range:  "Apr 4, 8:00 AM – 9:00 AM"
 *   - multi-day range: "Apr 4 – Apr 6, 8:00 AM – 9:00 AM"
 *
 * In the future, we should handle the time as a continuous interval instead of a "block."
 */
function formatRangeLabel(range: SelectionStateType, dates: ZotDate[]): string {
	const startDay = dates[range.earlierDateIndex];
	const endDay = dates[range.laterDateIndex];
	if (!startDay || !endDay) return "Select a cell to view";

	const fmtDay = (d: Date) =>
		d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

	const earliestMinutes = startDay.earliestTime;
	const blockLength = startDay.blockLength;
	const startTime = ZotDate.toTimeBlockString(
		earliestMinutes + range.earlierBlockIndex * blockLength,
		false,
	);
	const endTime = ZotDate.toTimeBlockString(
		earliestMinutes + (range.laterBlockIndex + 1) * blockLength,
		false,
	);

	const dayPart =
		range.earlierDateIndex === range.laterDateIndex
			? fmtDay(startDay.day)
			: `${fmtDay(startDay.day)} ${EN_DASH} ${fmtDay(endDay.day)}`;
	return `${dayPart}, ${startTime} ${EN_DASH} ${endTime}`;
}

function formatCooldown(ms: number): string {
	const totalSeconds = Math.ceil(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

interface GroupResponsesProps {
	availabilityDates: ZotDate[];
	ifNeededDates: ZotDate[];
	members: Member[];
	pendingMembers: Member[];
	fromTime: number;
	timezone: string;
	currentPageAvailability: {
		availabilities: (ZotDate | null)[];
		ifNeeded: (ZotDate | null)[];
	};
	doesntNeedDay: boolean;
	meetingId: string;
	isOwner: boolean;
}

export function GroupResponses({
	availabilityDates,
	ifNeededDates,
	fromTime,
	members,
	pendingMembers,
	timezone,
	currentPageAvailability,
	doesntNeedDay,
	meetingId,
	isOwner,
}: GroupResponsesProps) {
	const { showSuccess, showError } = useSnackbar();
	const [isNudging, setIsNudging] = useState(false);
	const [cooldownUntil, setCooldownUntil] = useState<Date | null>(null);
	const [cooldownRemaining, setCooldownRemaining] = useState<string | null>(null);

	useEffect(() => {
		if (!isOwner || pendingMembers.length === 0) return;
		getNudgeCooldown(meetingId).then(({ cooldownUntil: until }) => {
			if (until) setCooldownUntil(new Date(until));
		});
	}, [meetingId, isOwner, pendingMembers.length]);

	useEffect(() => {
		if (!cooldownUntil) {
			setCooldownRemaining(null);
			return;
		}
		const tick = () => {
			const remaining = cooldownUntil.getTime() - Date.now();
			if (remaining <= 0) {
				setCooldownUntil(null);
				setCooldownRemaining(null);
			} else {
				setCooldownRemaining(formatCooldown(remaining));
			}
		};
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	}, [cooldownUntil]);

	const handleNudge = async () => {
		setIsNudging(true);
		try {
			const result = await nudgePendingMembers(meetingId);
			if (result.success) {
				showSuccess(result.message);
				setCooldownUntil(new Date(Date.now() + 45 * 60 * 1000));
			} else if (result.cooldownUntil) {
				setCooldownUntil(new Date(result.cooldownUntil));
				showError(result.message);
			} else {
				showError(result.message);
			}
		} catch {
			showError("Failed to send nudge. Please try again.");
		} finally {
			setIsNudging(false);
		}
	};

	const newAvailDates = useMemo(
		() =>
			cloneDates(
				currentPageAvailability.availabilities,
				availabilityDates,
				doesntNeedDay,
			),
		[currentPageAvailability.availabilities, availabilityDates, doesntNeedDay],
	);
	const newIfNeededDates = useMemo(
		() =>
			cloneDates(
				currentPageAvailability.ifNeeded,
				ifNeededDates,
				doesntNeedDay,
			),
		[currentPageAvailability.ifNeeded, ifNeededDates, doesntNeedDay],
	);

	const {
		isMobileDrawerOpen,
		setIsMobileDrawerOpen,
		setHoveredMember,
		toggleSelectedMember,
		setSelectedMember,
		selectedMembers,
		enabled: showBestTimes,
		setEnabled: setShowBestTimes,
	} = useAvailabilityStore(
		useShallow((state) => ({
			isMobileDrawerOpen: state.isMobileDrawerOpen,
			setIsMobileDrawerOpen: state.setIsMobileDrawerOpen,
			setHoveredMember: state.setHoveredMember,
			toggleSelectedMember: state.toggleSelectedMember,
			setSelectedMember: state.setSelectedMember,
			selectedMembers: state.selectedMembers,
			enabled: state.enabled,
			setEnabled: state.setEnabled,
		})),
	);

	const activeRange = useActiveSelectionRange();

	const handleClearSelected = useCallback(() => {
		setSelectedMember([]);
	}, [setSelectedMember]);

	const handleMemberHover = useCallback(
		(memberId: string | null) => {
			setHoveredMember(memberId);
		},
		[setHoveredMember],
	);

	const handleMemberSelect = useCallback(
		(memberId: string) => {
			toggleSelectedMember(memberId);
		},
		[toggleSelectedMember],
	);

	const respondedMembers = useMemo(() => {
		const pendingMemberIds = new Set(pendingMembers.map((m) => m.memberId));
		return members.filter((member) => !pendingMemberIds.has(member.memberId));
	}, [members, pendingMembers]);

	const groups = useMemo<GroupMembersForRange | null>(() => {
		if (!activeRange) return null;
		return computeGroupMembersForRange({
			range: activeRange,
			availabilityDates: newAvailDates,
			ifNeededDates: newIfNeededDates,
			fromTimeMinutes: fromTime,
			timeZone: timezone,
		});
	}, [activeRange, newAvailDates, newIfNeededDates, fromTime, timezone]);

	const memberStatus = useMemo<ReadonlyMap<string, MemberRangeStatus>>(() => {
		if (!groups) return new Map();
		const map = new Map<string, MemberRangeStatus>();
		for (const m of respondedMembers) {
			map.set(m.memberId, statusForMember(m.memberId, groups));
		}
		return map;
	}, [groups, respondedMembers]);

	const availableCount = activeRange
		? respondedMembers.filter(
				(m) => memberStatus.get(m.memberId) !== "unavailable",
			).length
		: respondedMembers.length;

	const blockInfoString = activeRange
		? formatRangeLabel(activeRange, newAvailDates)
		: "Select a cell to view";

	return (
		<div
			data-availability-sidebar=""
			className="flex min-h-0 min-w-0 flex-1 flex-col lg:shrink-0"
		>
			<div
				className={cn(
					"fixed bottom-0 h-96 max-h-[85dvh] w-full min-w-0 translate-y-full overflow-auto rounded-t-xl bg-opacity-90 px-4 transition-transform duration-500 ease-in-out sm:right-0 sm:left-auto sm:w-96 lg:relative lg:top-0 lg:h-full lg:max-h-none lg:min-h-0 lg:w-full lg:flex-1 lg:shrink-0 lg:translate-y-0 lg:self-stretch lg:overflow-y-auto lg:overscroll-y-contain lg:rounded-l-xl lg:bg-opacity-50",
					isMobileDrawerOpen && "translate-y-0",
				)}
			>
				<div className="hidden pb-3 lg:block">
					<Typography variant="h6">Attendees</Typography>
					<Typography variant="caption" color="textSecondary">
						{blockInfoString}
					</Typography>
				</div>

				<div className="flex items-center justify-between py-4 lg:hidden">
					<div>
						<h3 className="font-medium">Responders</h3>
						<Typography variant="caption" color="textSecondary">
							{blockInfoString}
						</Typography>
					</div>
					<button
						type="button"
						className="rounded-lg border-[1px] border-slate-400 p-0.5 lg:hidden"
						onClick={() => setIsMobileDrawerOpen(false)}
					>
						<XIcon className="text-lg text-slate-400" />
					</button>
				</div>

				<div className="mt-3 flex flex-col">
					<div>
						<Typography variant="h6">Map Display</Typography>
						<Typography variant="caption" color="textSecondary">
							Filter how responder availability shows together on the map
						</Typography>
					</div>

					<div className="mt-2 flex items-center gap-2">
						<Switch
							id="availability-best-times"
							checked={showBestTimes}
							onChange={(e) => setShowBestTimes(e.target.checked)}
							size="medium"
							inputProps={{ "aria-label": "Best Times" }}
						/>
						<label
							htmlFor="availability-best-times"
							className="cursor-pointer text-md"
						>
							Best Times
						</label>
					</div>
				</div>

				<div className="flex flex-col py-2">
					<div>
						<h2 className="font-medium text-xl">Responders</h2>
						<Typography variant="caption" color="textSecondary">
							Available ({availableCount})
						</Typography>
					</div>

					<ul className="mt-3 flex flex-wrap gap-2">
						{respondedMembers.map((member) => {
							const status = memberStatus.get(member.memberId) ?? "available";
							return (
								<Chip
									key={member.memberId}
									clickable
									icon={
										<Avatar
											alt={member.displayName}
											src={member.profilePicture ?? undefined}
											slotProps={{ img: { referrerPolicy: "no-referrer" } }}
											sx={{ width: 24, height: 24, fontSize: 12 }}
										/>
									}
									label={member.displayName}
									color={
										selectedMembers.includes(member.memberId)
											? "primary"
											: "default"
									}
									variant="outlined"
									className={cn("max-w-full", RESPONDER_CHIP_CLASS[status])}
									onMouseEnter={() => handleMemberHover(member.memberId)}
									onMouseLeave={() => handleMemberHover(null)}
									onClick={() => handleMemberSelect(member.memberId)}
								/>
							);
						})}
					</ul>
					<div className="mt-4 ml-auto">
						<Button
							variant="text"
							className="ml-auto"
							onClick={handleClearSelected}
						>
							Clear Selected
						</Button>
					</div>
				</div>

				<div className="flex flex-col py-2">
					<div className="flex items-center justify-between">
						<Typography variant="h6">Pending Responders</Typography>
						{isOwner && pendingMembers.length > 0 && (
							<Button
								variant="outlined"
								size="small"
								startIcon={<NotificationsOutlined />}
								disabled={isNudging || cooldownRemaining !== null}
								onClick={handleNudge}
							>
								Nudge
							</Button>
						)}
					</div>

					{isOwner && cooldownRemaining !== null && (
						<Typography variant="caption" sx={{ color: "error.main", mt: 0.5 }}>
							Nudge available in {cooldownRemaining}
						</Typography>
					)}

					{pendingMembers.length > 0 ? (
						<div>
							<Typography variant="caption" color="textSecondary">
								Waiting on responses from your group ({pendingMembers.length})
							</Typography>
							<ul className="mt-3 flex flex-wrap gap-2">
								{pendingMembers.map((member) => (
									<Chip
										key={member.memberId}
										icon={
											<Avatar
												alt={member.displayName}
												src={member.profilePicture ?? undefined}
												slotProps={{ img: { referrerPolicy: "no-referrer" } }}
												sx={{ height: 24, width: 24 }}
											/>
										}
										label={member.displayName}
										variant="outlined"
									/>
								))}
							</ul>
						</div>
					) : (
						<Typography
							variant="caption"
							color="textSecondary"
							className="mt-2"
						>
							Everyone has submitted availability.
						</Typography>
					)}
				</div>
			</div>
		</div>
	);
}