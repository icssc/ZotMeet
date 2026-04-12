import { Checkbox, Chip, Divider, FormControlLabel } from "@mui/material/";
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
		"Select a cell to view",
	);
	// made this cause i thought front end was a part of this pr at first :facepalm: just gonna keep for now
	const capacityOptions = ["1-2", "3-4", "5-6", "7-8", "9-12", "13+"];
	const buildingOptions = [
		"Anteater Learning Pavilion",
		"Science Library",
		"Langson Library",
		"Gateway Study Center",
	];

	const [selectedCapacity, setSelectedCapacity] = useState<string[]>([]);
	const [selectedBuildings, setSelectedBuildings] = useState<string[]>([]);

	const toggleSelection = (
		value: string,
		selected: string[],
		setSelected: React.Dispatch<React.SetStateAction<string[]>>,
	) => {
		if (selected.includes(value)) {
			setSelected(selected.filter((v) => v !== value));
		} else {
			setSelected([...selected, value]);
		}
	};

	const clearRoomFilters = () => {
		setSelectedCapacity([]);
		setSelectedBuildings([]);
	};

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
				availabilityView !== "group" && "pointer-events-none invisible",
			)}
		>
			<div className="hidden pb-1 pl-8 lg:block">
				<h3 className="font-figtree font-medium text-xl">Responders</h3>
				<p className="font-bold font-dm-sans text-slate-400 text-xs uppercase tracking-wide">
					{blockInfoString}
				</p>
			</div>

			<div
				className={cn(
					"fixed right-0 bottom-0 h-96 w-full translate-y-full overflow-auto rounded-t-xl border-[1px] border-gray-400 bg-gray-100 bg-opacity-90 transition-transform duration-500 ease-in-out sm:right-0 sm:left-auto sm:w-96 lg:relative lg:top-0 lg:right-10 lg:h-auto lg:w-64 lg:translate-y-0 lg:self-stretch lg:rounded-l-xl lg:bg-opacity-50",
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

				<div className="flex flex-col py-2">
					<div className="px-8">
						<span className="font-bold font-dm-sans text-slate-400 text-xs uppercase tracking-wide">
							Options
						</span>
					</div>

					<div className="pl-8">
						<FormControlLabel
							control={
								<Checkbox
									checked={showBestTimes}
									onChange={(e) => setShowBestTimes(e.target.checked)}
								/>
							}
							label="Show Best Times"
						/>
					</div>
				</div>

				<Divider />

				<div className="flex max-h-[32rem] grow flex-col py-2">
					<div className="px-8">
						<span className="font-bold font-dm-sans text-slate-400 text-xs uppercase tracking-wide">
							AVAILABLE (
							{isHoveringGrid ? availableMembers.length : members.length})
						</span>
					</div>

					<ul className="overflow-auto pl-8">
						{members.map((member) => (
							<li
								key={member.memberId}
								className={cn(
									"cursor-pointer text-lg",
									isHoveringGrid &&
										notAvailableMembers.some(
											(m) => m.memberId === member.memberId,
										)
										? "text-decoration-line: text-gray-medium line-through"
										: "",
								)}
								onMouseEnter={() => handleMemberHover(member.memberId)}
								onMouseLeave={() => handleMemberHover(null)}
							>
								<FormControlLabel
									control={
										<Checkbox
											checked={selectedMembers.includes(member.memberId)}
											onChange={() => handleMemberSelect(member.memberId)}
										/>
									}
									label={member.displayName}
								/>
							</li>
						))}
					</ul>
				</div>
				<div className="mb-4 px-8">
					<p className="mb-2 font-semibold">Capacity</p>
					<div className="flex flex-wrap gap-2">
						{capacityOptions.map((cap) => {
							const selected = selectedCapacity.includes(cap);

							return (
								<Chip
									key={cap}
									label={cap}
									variant="outlined"
									onClick={() =>
										toggleSelection(cap, selectedCapacity, setSelectedCapacity)
									}
									// Need to be unified with our custom mui, i kinda just picked close colors
									className={`!rounded-full !border !border-pink-500${
										selected
											? "!bg-pink-500 !text-white hover:!bg-pink-500"
											: "!text-pink-500 hover:!bg-pink-100"
									}
							`}
								/>
							);
						})}
					</div>
				</div>

				<div className="mb-2 px-8">
					<p className="mb-2 font-semibold">Buildings</p>
					<div className="flex flex-wrap gap-2">
						{buildingOptions.map((bld) => {
							const selected = selectedBuildings.includes(bld);

							return (
								<Chip
									key={bld}
									label={bld}
									variant="outlined"
									onClick={() =>
										toggleSelection(
											bld,
											selectedBuildings,
											setSelectedBuildings,
										)
									}
									className={`!rounded-full !border !border-pink-500${
										selected
											? "!bg-pink-500 !text-white hover:!bg-pink-500"
											: "!text-pink-500 hover:!bg-pink-100"
									}
								`}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
