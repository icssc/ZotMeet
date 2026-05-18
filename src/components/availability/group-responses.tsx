import { removeMeetingMember } from "@actions/meeting/leave/action";
import {
	NotificationsOutlined,
	PersonRemoveOutlined,
} from "@mui/icons-material";
import {
	Avatar,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Switch,
	Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { MuiBottomSheet } from "@/components/ui/mui/mui-bottom-sheet";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import {
	computeGroupMembersForRange,
	type GroupMembersForRange,
	type MemberRangeStatus,
	statusForMember,
} from "@/lib/availability/group-query";
import { cloneDates } from "@/lib/availability/utils";
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
/** Tailwind `lg` breakpoint — keep aligned with `lg:` utilities. */
const LG_UP_MEDIA = "(min-width: 1024px)";
const RESPONDER_CHIP_CLASS: Record<MemberRangeStatus, string> = {
	available: "",
	"if-needed": "!border-dashed [&_.MuiChip-label]:italic",
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
	hostMemberId?: string;
}

type GroupResponsesPanelProps = {
	variant: "desktop" | "mobile";
	blockInfoString: string;
	showBestTimes: boolean;
	onShowBestTimesChange: (checked: boolean) => void;
	respondedMembers: Member[];
	memberStatus: ReadonlyMap<string, MemberRangeStatus>;
	selectedMemberIds: ReadonlySet<string>;
	onMemberHover: (memberId: string | null) => void;
	onMemberSelect: (memberId: string) => void;
	onClearSelected: () => void;
	availableCount: number;
	isOwner: boolean;
	hostMemberId?: string;
	pendingMembers: Member[];
	isNudging: boolean;
	cooldownRemaining: string | null;
	onNudge: () => void;
	onRequestClose: () => void;
	onRemoveMember?: (member: Member) => void;
};

function GroupResponsesPanel({
	variant,
	blockInfoString,
	showBestTimes,
	onShowBestTimesChange,
	respondedMembers,
	memberStatus,
	selectedMemberIds,
	onMemberHover,
	onMemberSelect,
	onClearSelected,
	availableCount,
	isOwner,
	hostMemberId,
	pendingMembers,
	isNudging,
	cooldownRemaining,
	onNudge,
	onRequestClose,
	onRemoveMember,
}: GroupResponsesPanelProps) {
	const isDesktop = variant === "desktop";

	return (
		<>
			{isDesktop ? (
				<div className="hidden pb-3 lg:block">
					<Typography variant="h6">Attendees</Typography>
					<Typography variant="caption" color="textSecondary">
						{blockInfoString}
					</Typography>
				</div>
			) : (
				<div className="flex items-center justify-between py-4">
					<div>
						<h3 className="font-medium">Responders</h3>
						<Typography variant="caption" color="textSecondary">
							{blockInfoString}
						</Typography>
					</div>
					<button
						type="button"
						className="rounded-lg border-[1px] border-slate-400 p-0.5"
						onClick={onRequestClose}
						aria-label="Close responders"
					>
						<XIcon className="text-lg text-slate-400" aria-hidden />
					</button>
				</div>
			)}

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
						onChange={(e) => onShowBestTimesChange(e.target.checked)}
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
						const canRemove =
							isOwner &&
							onRemoveMember !== undefined &&
							member.memberId !== hostMemberId;
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
									selectedMemberIds.has(member.memberId) ? "primary" : "default"
								}
								variant="outlined"
								className={cn("max-w-full", RESPONDER_CHIP_CLASS[status])}
								onMouseEnter={() => onMemberHover(member.memberId)}
								onMouseLeave={() => onMemberHover(null)}
								onClick={() => onMemberSelect(member.memberId)}
								onDelete={canRemove ? () => onRemoveMember(member) : undefined}
								sx={
									canRemove
										? {
												"& .MuiChip-deleteIcon": { display: "none" },
												"&:hover .MuiChip-deleteIcon, &:focus-within .MuiChip-deleteIcon":
													{ display: "flex" },
											}
										: undefined
								}
							/>
						);
					})}
				</ul>
				<div className="mt-4 ml-auto">
					<Button variant="text" className="ml-auto" onClick={onClearSelected}>
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
							onClick={onNudge}
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
							{pendingMembers.map((member) => {
								const canRemove =
									isOwner &&
									onRemoveMember !== undefined &&
									member.memberId !== hostMemberId;
								return (
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
										onDelete={
											canRemove ? () => onRemoveMember(member) : undefined
										}
										sx={
											canRemove
												? {
														"& .MuiChip-deleteIcon": { display: "none" },
														"&:hover .MuiChip-deleteIcon, &:focus-within .MuiChip-deleteIcon":
															{ display: "flex" },
													}
												: undefined
										}
									/>
								);
							})}
						</ul>
					</div>
				) : (
					<Typography variant="caption" color="textSecondary" className="mt-2">
						Everyone has submitted availability.
					</Typography>
				)}
			</div>
		</>
	);
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
	hostMemberId,
}: GroupResponsesProps) {
	const isLgQuery = useMediaQuery(LG_UP_MEDIA, { noSsr: true });
	const [layoutReady, setLayoutReady] = useState(false);
	useEffect(() => {
		setLayoutReady(true);
	}, []);
	// Default to desktop branch until mounted so SSR + first client paint match.
	const isLg = layoutReady ? isLgQuery : true;

	const router = useRouter();
	const { showSuccess, showError } = useSnackbar();
	const [isNudging, setIsNudging] = useState(false);
	const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
	const [isRemoving, setIsRemoving] = useState(false);
	const [cooldownUntil, setCooldownUntil] = useState<Date | null>(null);
	const [cooldownRemaining, setCooldownRemaining] = useState<string | null>(
		null,
	);

	useEffect(() => {
		if (!isOwner || pendingMembers.length === 0) {
			setCooldownUntil(null);
			return;
		}
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

	const handleNudge = useCallback(async () => {
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
	}, [meetingId, showError, showSuccess]);

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

	const handleCloseMobile = useCallback(() => {
		setIsMobileDrawerOpen(false);
	}, [setIsMobileDrawerOpen]);

	const onNudge = useCallback(() => {
		void handleNudge();
	}, [handleNudge]);

	const handleRemoveMember = useCallback((member: Member) => {
		setMemberToRemove(member);
	}, []);

	const handleConfirmRemove = useCallback(async () => {
		if (!memberToRemove) return;
		setIsRemoving(true);
		try {
			const result = await removeMeetingMember(
				meetingId,
				memberToRemove.memberId,
			);
			if (result.success) {
				showSuccess(
					`${memberToRemove.displayName} has been removed from the meeting.`,
				);
				setMemberToRemove(null);
				router.refresh();
			} else {
				showError(result.error ?? "Failed to remove member.");
			}
		} catch {
			showError("Failed to remove member. Please try again.");
		} finally {
			setIsRemoving(false);
		}
	}, [memberToRemove, meetingId, router, showError, showSuccess]);

	const selectedMemberIds = useMemo(
		() => new Set(selectedMembers),
		[selectedMembers],
	);

	const mobileSheetPaperSx = useMemo(() => ({ px: 2, py: 1 }) as const, []);

	const panelProps: Omit<GroupResponsesPanelProps, "variant"> = useMemo(
		() => ({
			blockInfoString,
			showBestTimes,
			onShowBestTimesChange: setShowBestTimes,
			respondedMembers,
			memberStatus,
			selectedMemberIds,
			onMemberHover: handleMemberHover,
			onMemberSelect: handleMemberSelect,
			onClearSelected: handleClearSelected,
			availableCount,
			isOwner,
			hostMemberId,
			pendingMembers,
			isNudging,
			cooldownRemaining,
			onNudge,
			onRequestClose: handleCloseMobile,
			onRemoveMember: isOwner ? handleRemoveMember : undefined,
		}),
		[
			availableCount,
			blockInfoString,
			cooldownRemaining,
			handleClearSelected,
			handleCloseMobile,
			handleMemberHover,
			handleMemberSelect,
			handleRemoveMember,
			hostMemberId,
			isNudging,
			isOwner,
			memberStatus,
			onNudge,
			pendingMembers,
			respondedMembers,
			selectedMemberIds,
			setShowBestTimes,
			showBestTimes,
		],
	);

	const confirmRemoveDialog = (
		<Dialog
			open={memberToRemove !== null}
			onClose={() => {
				if (!isRemoving) setMemberToRemove(null);
			}}
			fullWidth
		>
			<DialogTitle>Remove Member</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Are you sure you want to remove{" "}
					<strong>{memberToRemove?.displayName}</strong> from this meeting?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => setMemberToRemove(null)} disabled={isRemoving}>
					Cancel
				</Button>
				<Button
					onClick={() => void handleConfirmRemove()}
					color="error"
					variant="contained"
					disabled={isRemoving}
					startIcon={<PersonRemoveOutlined />}
				>
					Remove
				</Button>
			</DialogActions>
		</Dialog>
	);

	if (!isLg) {
		return (
			<>
				<MuiBottomSheet
					open={isMobileDrawerOpen}
					onClose={handleCloseMobile}
					paperSx={mobileSheetPaperSx}
				>
					<div data-availability-sidebar="">
						<GroupResponsesPanel {...panelProps} variant="mobile" />
					</div>
				</MuiBottomSheet>
				{confirmRemoveDialog}
			</>
		);
	}

	return (
		<>
			<div
				data-availability-sidebar=""
				className="flex min-h-0 min-w-0 flex-1 flex-col lg:shrink-0"
			>
				<div className="relative flex min-h-0 min-w-0 flex-1 flex-col self-stretch overflow-y-auto overscroll-y-contain px-4 lg:h-full lg:max-h-none">
					<GroupResponsesPanel {...panelProps} variant="desktop" />
				</div>
			</div>
			{confirmRemoveDialog}
		</>
	);
}
