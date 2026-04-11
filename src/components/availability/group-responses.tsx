import {
	Checkbox,
	Chip,
	Divider,
	FormControlLabel,
	Switch,
} from "@mui/material/";
import { XIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { getTimestampFromBlockIndex } from "@/components/availability/group-availability";
import { newZonedPageAvailAndDates } from "@/lib/availability/utils";
import type { Member } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

interface GroupResponsesProps {
	availabilityDates: ZotDate[];
	members: Member[];
	fromTime: number;
	timezone: string;
	anchorNormalizedDate: Date[];
	currentPageAvailability: ZotDate[];
	availabilityTimeBlocks: number[];
	doesntNeedDay: boolean;
}

export function GroupResponses({
	availabilityDates,
	fromTime,
	members,
	currentPageAvailability,
	doesntNeedDay,
}: GroupResponsesProps) {
	const [_newBlocks, newAvailDates] = newZonedPageAvailAndDates(
		currentPageAvailability,
		availabilityDates,
		doesntNeedDay,
	);

	const {
		availabilityView,
		selectedZotDateIndex,
		selectedBlockIndex,
		isMobileDrawerOpen,
		setIsMobileDrawerOpen,
		setHoveredMember,
		toggleSelectedMember,
		selectedMembers,
		isHoveringGrid,
		enabled: showBestTimes,
		setEnabled: setShowBestTimes,
	} = useAvailabilityStore(
		useShallow((state) => ({
			availabilityView: state.availabilityView,
			selectedZotDateIndex: state.selectedZotDateIndex,
			selectedBlockIndex: state.selectedBlockIndex,
			isMobileDrawerOpen: state.isMobileDrawerOpen,
			setIsMobileDrawerOpen: state.setIsMobileDrawerOpen,
			setHoveredMember: state.setHoveredMember,
			toggleSelectedMember: state.toggleSelectedMember,
			selectedMembers: state.selectedMembers,
			isHoveringGrid: state.isHoveringGrid,
			enabled: state.enabled,
			setEnabled: state.setEnabled,
		})),
	);

	const [blockInfoString, setBlockInfoString] = useState(
		"Filter through responders and find the best meeting time",
	);

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

	const { availableMembers, notAvailableMembers } = useMemo(() => {
		if (
			selectedZotDateIndex === undefined ||
			selectedBlockIndex === undefined
		) {
			return {
				availableMembers: [],
				notAvailableMembers: members,
			};
		}
		const selectedDate = newAvailDates[selectedZotDateIndex];
		const timestamp = getTimestampFromBlockIndex(
			selectedBlockIndex,
			selectedZotDateIndex,
			fromTime,
			newAvailDates,
		);
		const availableMemberIds = selectedDate.groupAvailability[timestamp] || [];

		return {
			availableMembers: members.filter((member) =>
				availableMemberIds.includes(member.memberId),
			),
			notAvailableMembers: members.filter(
				(member) => !availableMemberIds.includes(member.memberId),
			),
		};
	}, [
		selectedZotDateIndex,
		selectedBlockIndex,
		newAvailDates,
		fromTime,
		members,
	]);

	useEffect(() => {
		if (
			selectedZotDateIndex !== undefined &&
			selectedBlockIndex !== undefined
		) {
			const displayDate = newAvailDates[selectedZotDateIndex].day;

			const formattedDate = displayDate.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			});

			const earliestTime = newAvailDates[selectedZotDateIndex].earliestTime;
			const blockLength = newAvailDates[selectedZotDateIndex].blockLength;

			const startTime = ZotDate.toTimeBlockString(
				earliestTime + selectedBlockIndex * blockLength,
				false,
			);
			const endTime = ZotDate.toTimeBlockString(
				earliestTime + selectedBlockIndex * blockLength + blockLength,
				false,
			);
			setBlockInfoString(`${formattedDate}, ${startTime} - ${endTime}`);
		} else {
			setBlockInfoString("Select a cell to view");
		}
	}, [selectedZotDateIndex, selectedBlockIndex, newAvailDates]);

	return (
		<div
			className={cn(
				"lg:shrink-0",
				availabilityView !== "group" && "pointer-events-none invisible",
			)}
		>
			<div className="hidden pb-1 pl-6 lg:block">
				<h3 className="font-medium text-xl">Attendees</h3>
				<p className="font-bold text-slate-400 text-xs uppercase tracking-wide">
					{blockInfoString}
				</p>
			</div>

			<div
				className={cn(
					"fixed bottom-0 h-96 w-full translate-y-full overflow-auto rounded-t-xl bg-opacity-90 transition-transform duration-500 ease-in-out sm:right-0 sm:left-auto sm:w-96 lg:relative lg:top-0 lg:right-2 lg:h-auto lg:w-96 lg:shrink-0 lg:translate-y-0 lg:self-stretch lg:rounded-l-xl lg:bg-opacity-50",
					isMobileDrawerOpen && "translate-y-0",
				)}
			>
				<div className="flex items-center justify-between px-8 py-4 lg:hidden">
					<div>
						<h3 className="font-figtree font-medium">Responders</h3>
						<p className="font-bold font-dm-sans text-slate-400 text-xs uppercase tracking-wide">
							{blockInfoString}
						</p>
					</div>
					<button
						type="button"
						className="rounded-lg border-[1px] border-slate-400 p-0.5 lg:hidden"
						onClick={() => setIsMobileDrawerOpen(false)}
					>
						<XIcon className="text-lg text-slate-400" />
					</button>
				</div>

				<div className="mt-4 flex flex-col py-2">
					<div className="px-8">
						<h1>Map Display</h1>
						<p className="text-slate-500 text-xs">
							Filter how responder availability shows together on the map
						</p>
					</div>

					<div className="mt-2 pl-8">
						<FormControlLabel
							control={
								<Switch
									checked={showBestTimes}
									onChange={(e) => setShowBestTimes(e.target.checked)}
								/>
							}
							label="Best Times"
						/>
					</div>
				</div>

				<div className="h-[32rem] flex-col py-2">
					<div className="px-8">
						<h1>Responders</h1>
						<span className="font-bold font-dm-sans text-slate-400 text-xs uppercase tracking-wide">
							AVAILABLE (
							{isHoveringGrid ? availableMembers.length : members.length})
						</span>
					</div>

					<ul className="mt-3 overflow-auto pl-8">
						{members.map((member) => (
							<Chip
								clickable
								//put pfp here once user settings merged. icon={}
								label={member.displayName}
								color={
									selectedMembers.includes(member.memberId)
										? "primary"
										: "default"
								}
								variant="outlined"
								onMouseEnter={() => handleMemberHover(member.memberId)}
								onMouseLeave={() => handleMemberHover(null)}
								onClick={() => handleMemberSelect(member.memberId)}
							/>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
