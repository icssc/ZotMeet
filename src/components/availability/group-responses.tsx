import { XIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { getTimestampFromBlockIndex } from "@/components/availability/group-availability";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Member } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityViewStore } from "@/store/useAvailabilityViewStore";
import { useGroupSelectionStore } from "@/store/useGroupSelectionStore";

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
	timezone,
	anchorNormalizedDate,
	currentPageAvailability,
	doesntNeedDay,
}: GroupResponsesProps) {
	const newBlocks = currentPageAvailability.map((date, index) => {
		if (date) {
			return new ZotDate(date);
		} else {
			return currentPageAvailability[index];
		}
	});
	let dayIndex = currentPageAvailability.length - 1;
	const newAvailDates = availabilityDates.map((date) => new ZotDate(date));
	while (currentPageAvailability[dayIndex] == null) {
		dayIndex -= 1;
	}
	if (!doesntNeedDay) {
		const prevDay = currentPageAvailability[dayIndex];
		//console.log(currentPageAvailability);
		const newDay = new Date(prevDay.day);
		newDay.setDate(newDay.getDate() + 1);
		newBlocks[dayIndex + 1] = new ZotDate(
			newDay,
			prevDay.earliestTime,
			prevDay.latestTime,
			false,
			[],
			{},
		);

		newAvailDates.push(
			new ZotDate(
				newDay,
				prevDay.earliestTime,
				prevDay.latestTime,
				false,
				[],
				{},
			),
		);
	}

	const { availabilityView } = useAvailabilityViewStore();
	const {
		selectedZotDateIndex,
		selectedBlockIndex,
		isMobileDrawerOpen,
		setIsMobileDrawerOpen,
		setHoveredMember,
		toggleSelectedMember,
		selectedMembers,
		isHoveringGrid,
	} = useGroupSelectionStore(
		useShallow((state) => ({
			selectedZotDateIndex: state.selectedZotDateIndex,
			selectedBlockIndex: state.selectedBlockIndex,
			isMobileDrawerOpen: state.isMobileDrawerOpen,
			setIsMobileDrawerOpen: state.setIsMobileDrawerOpen,
			setHoveredMember: state.setHoveredMember,
			toggleSelectedMember: state.toggleSelectedMember,
			selectedMembers: state.selectedMembers,
			isHoveringGrid: state.isHoveringGrid,
		})),
	);

	const [blockInfoString, setBlockInfoString] = useState(
		"Select a cell to view",
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
			timezone,
			newAvailDates,
		);
		//console.log(selectedDate.groupAvailability, timestamp);
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
		timezone,
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
				<h3 className="font-medium font-montserrat text-xl">Responders</h3>
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
						<h3 className="font-medium font-montserrat">Responders</h3>
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

				<div className="flex h-[32rem] grow flex-col">
					<div className="border-gray-300 border-b-[1px] px-8">
						<span className="font-bold font-dm-sans text-slate-400 text-xs uppercase tracking-wide">
							AVAILABLE (
							{isHoveringGrid ? availableMembers.length : members.length})
						</span>
					</div>

					<ul className="overflow-auto py-2 pl-8">
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
								<ul className="flex w-fit items-center gap-2">
									<Checkbox
										id={`MEMBER${member.memberId}`}
										checked={selectedMembers.includes(member.memberId)}
										onCheckedChange={() => handleMemberSelect(member.memberId)}
									/>
									<Label
										htmlFor={`MEMBER${member.memberId}`}
										className="cursor-pointer text-lg"
									>
										{member.displayName}
									</Label>
								</ul>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
