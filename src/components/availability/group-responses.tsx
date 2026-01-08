import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getTimestampFromBlockIndex } from "@/components/availability/group-availability";
import { Member } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityViewStore } from "@/store/useAvailabilityViewStore";
import { useGroupSelectionStore } from "@/store/useGroupSelectionStore";
import { XIcon } from "lucide-react";
import { useShallow } from "zustand/shallow";

interface GroupResponsesProps {
	availabilityDates: ZotDate[];
	members: Member[];
	fromTime: number;
	anchorNormalizedDate: Date[];
}

export function GroupResponses({
	availabilityDates,
	fromTime,
	members,
	anchorNormalizedDate,
}: GroupResponsesProps) {
	const { availabilityView } = useAvailabilityViewStore();
	const {
		selectedZotDateIndex,
		selectedBlockIndex,
		isMobileDrawerOpen,
		setIsMobileDrawerOpen,
		setHoveredMember,
	} = useGroupSelectionStore(
		useShallow((state) => ({
			selectedZotDateIndex: state.selectedZotDateIndex,
			selectedBlockIndex: state.selectedBlockIndex,
			isMobileDrawerOpen: state.isMobileDrawerOpen,
			setIsMobileDrawerOpen: state.setIsMobileDrawerOpen,
			setHoveredMember: state.setHoveredMember,
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

		const selectedDate = availabilityDates[selectedZotDateIndex];
		const timestamp = getTimestampFromBlockIndex(
			selectedBlockIndex,
			selectedZotDateIndex,
			fromTime,
			availabilityDates,
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
		availabilityDates,
		fromTime,
		members,
	]);

	useEffect(() => {
		if (
			selectedZotDateIndex !== undefined &&
			selectedBlockIndex !== undefined
		) {
			const displayDate = anchorNormalizedDate[selectedZotDateIndex];
			const formattedDate = displayDate.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			});

			const earliestTime = availabilityDates[selectedZotDateIndex].earliestTime;
			const blockLength = availabilityDates[selectedZotDateIndex].blockLength;

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
	}, [
		selectedZotDateIndex,
		selectedBlockIndex,
		availabilityDates,
		anchorNormalizedDate,
	]);

	return (
		<div
			className={cn(
				availabilityView !== "group" && "pointer-events-none invisible",
			)}
		>
			<div className="hidden pb-1 pl-8 lg:block">
				<h3 className="font-montserrat text-xl font-medium">Responders</h3>
				<p className="font-dm-sans text-xs font-bold uppercase tracking-wide text-slate-400">
					{blockInfoString}
				</p>
			</div>

			<div
				className={cn(
					"fixed bottom-0 right-0 h-96 w-full translate-y-full overflow-auto rounded-t-xl border-[1px] border-gray-400 bg-gray-100 bg-opacity-90 transition-transform duration-500 ease-in-out sm:left-auto sm:right-0 sm:w-96 lg:relative lg:right-10 lg:top-0 lg:h-auto lg:w-64 lg:translate-y-0 lg:self-stretch lg:rounded-l-xl lg:bg-opacity-50",
					isMobileDrawerOpen && "translate-y-0",
				)}
			>
				<div className="flex items-center justify-between px-8 py-4 lg:hidden">
					<div>
						<h3 className="font-montserrat font-medium">Responders</h3>
						<p className="font-dm-sans text-xs font-bold uppercase tracking-wide text-slate-400">
							{blockInfoString}
						</p>
					</div>
					<button
						className="rounded-lg border-[1px] border-slate-400 p-0.5 lg:hidden"
						onClick={() => setIsMobileDrawerOpen(false)}
					>
						<XIcon className="text-lg text-slate-400" />
					</button>
				</div>
				<div className="grid grid-cols-2 lg:flex lg:flex-col lg:gap-10 lg:py-4">
					<div>
						<div className="border-b-[1px] border-gray-300 px-8">
							<span className="font-dm-sans text-xs font-bold uppercase tracking-wide text-slate-400">
								AVAILABLE ({availableMembers.length})
							</span>
						</div>
						<ul className="h-64 overflow-auto py-2 pl-8">
							{availableMembers.length > 0 ? (
								availableMembers.map((member) => (
									<li
										key={member.memberId}
										className="cursor-pointer text-lg text-gray-800"
										onMouseEnter={() => handleMemberHover(member.memberId)}
										onMouseLeave={() => handleMemberHover(null)}
									>
										{member.displayName}
									</li>
								))
							) : (
								<li className="text-sm italic text-gray-400">N/A</li>
							)}
						</ul>
					</div>
					<div>
						<div className="border-b-[1px] border-gray-300 px-8">
							<span className="font-dm-sans text-xs font-bold uppercase tracking-wide text-slate-400">
								NOT AVAILABLE ({notAvailableMembers.length})
							</span>
						</div>
						<ul className="h-64 overflow-auto py-2 pl-8">
							{notAvailableMembers.length > 0 ? (
								notAvailableMembers.map((member) => (
									<li
										key={member.memberId}
										className="cursor-pointer text-lg text-gray-400"
										onMouseEnter={() => handleMemberHover(member.memberId)}
										onMouseLeave={() => handleMemberHover(null)}
									>
										{member.displayName}
									</li>
								))
							) : (
								<li className="text-sm italic text-gray-400">N/A</li>
							)}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
