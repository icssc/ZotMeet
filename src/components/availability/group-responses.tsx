import { Button, Chip, Switch, Typography } from "@mui/material/";
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
		selectedZotDateIndex,
		selectedBlockIndex,
		isMobileDrawerOpen,
		setIsMobileDrawerOpen,
		setHoveredMember,
		toggleSelectedMember,
		setSelectedMember,
		selectedMembers,
		isHoveringGrid,
		enabled: showBestTimes,
		setEnabled: setShowBestTimes,
	} = useAvailabilityStore(
		useShallow((state) => ({
			selectedZotDateIndex: state.selectedZotDateIndex,
			selectedBlockIndex: state.selectedBlockIndex,
			isMobileDrawerOpen: state.isMobileDrawerOpen,
			setIsMobileDrawerOpen: state.setIsMobileDrawerOpen,
			setHoveredMember: state.setHoveredMember,
			toggleSelectedMember: state.toggleSelectedMember,
			setSelectedMember: state.setSelectedMember,
			selectedMembers: state.selectedMembers,
			isHoveringGrid: state.isHoveringGrid,
			enabled: state.enabled,
			setEnabled: state.setEnabled,
		})),
	);

	const [blockInfoString, setBlockInfoString] = useState(
		"Filter through responders and find the best meeting time",
	);

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

	const { availableMembers } = useMemo(() => {
		if (
			selectedZotDateIndex === undefined ||
			selectedBlockIndex === undefined
		) {
			return {
				availableMembers: [],
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
		<div className="min-w-0 lg:shrink-0">
			<div
				className={cn(
					// Cap height so the flex row does not grow with responder count (see availability layout).
					"fixed bottom-0 h-96 max-h-[85dvh] w-full min-w-0 translate-y-full overflow-auto rounded-t-xl bg-opacity-90 px-4 transition-transform duration-500 ease-in-out sm:right-0 sm:left-auto sm:w-96 lg:relative lg:top-0 lg:max-h-[min(calc(100dvh-10rem),56rem)] lg:w-96 lg:shrink-0 lg:translate-y-0 lg:self-start lg:overflow-y-auto lg:overscroll-y-contain lg:rounded-l-xl lg:bg-opacity-50",
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
							Available (
							{isHoveringGrid ? availableMembers.length : members.length})
						</Typography>
					</div>

					<ul className="mt-3 flex flex-wrap gap-2">
						{members.map((member) => (
							<Chip
								key={member.memberId}
								clickable
								//put pfp here once user settings merged. icon={}
								label={member.displayName}
								color={
									selectedMembers.includes(member.memberId)
										? "primary"
										: "default"
								}
								variant="outlined"
								sx={{ maxWidth: "100%" }}
								onMouseEnter={() => handleMemberHover(member.memberId)}
								onMouseLeave={() => handleMemberHover(null)}
								onClick={() => handleMemberSelect(member.memberId)}
							/>
						))}
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
			</div>
		</div>
	);
}
