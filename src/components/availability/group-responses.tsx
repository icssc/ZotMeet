import {
	Close,
	EditCalendar,
	EventAvailable,
	ExpandLess,
	ExpandMore,
} from "@mui/icons-material";
import { Divider } from "@mui/material/";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { getTimestampFromBlockIndex } from "@/components/availability/group-availability";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
	isOwner: boolean;
	hasAvailability: boolean;
}

export function GroupResponses({
	availabilityDates,
	fromTime,
	members,
	currentPageAvailability,
	doesntNeedDay,
	isOwner,
	hasAvailability,
}: GroupResponsesProps) {
	const [_newBlocks, newAvailDates] = newZonedPageAvailAndDates(
		currentPageAvailability,
		availabilityDates,
		doesntNeedDay,
	);

	const {
		availabilityView,
		setAvailabilityView,
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
			setAvailabilityView: state.setAvailabilityView,
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

	const [attendeesExpanded, setAttendeesExpanded] = useState(true);

	return (
		<div
			className={cn(
				availabilityView !== "group" && "pointer-events-none invisible",
			)}
		>
			<div className="hidden w-72 shrink-0 flex-col gap-4 px-4 lg:flex">
				<div className="flex flex-col gap-2">
					<Button
						className="w-full gap-2 uppercase"
						onClick={() => setAvailabilityView("personal")}
					>
						<EditCalendar className="size-4" />
						{hasAvailability ? "Edit Availability" : "Add Availability"}
					</Button>
					{isOwner && (
						<Button
							variant="outline"
							className="w-full gap-2 uppercase"
							onClick={() => setAvailabilityView("schedule")}
						>
							<EventAvailable className="size-4" />
							Schedule Meeting
						</Button>
					)}
				</div>

				<div className="rounded-lg border bg-white">
					<button
						type="button"
						className="flex w-full items-start justify-between px-4 pt-4 pb-3"
						onClick={() => setAttendeesExpanded((v) => !v)}
					>
						<div className="text-left">
							<h3 className="font-medium font-montserrat text-lg">Attendees</h3>
							<p className="mt-0.5 text-gray-500 text-sm">
								Filter through responders and find the best meeting time.
							</p>
						</div>
						{attendeesExpanded ? (
							<ExpandLess className="mt-1 size-5 shrink-0 text-gray-500" />
						) : (
							<ExpandMore className="mt-1 size-5 shrink-0 text-gray-500" />
						)}
					</button>

					{attendeesExpanded && (
						<div className="flex flex-col gap-1 px-4 pb-4">
							<div className="mb-1 flex items-center gap-2">
								<Checkbox
									id="show-best-times"
									checked={showBestTimes}
									onCheckedChange={setShowBestTimes}
								/>
								<Label
									htmlFor="show-best-times"
									className="cursor-pointer text-sm"
								>
									Show Best Times
								</Label>
							</div>
							<Divider />
							<ul className="mt-2 flex flex-col gap-1">
								{members.map((member) => (
									<li
										key={member.memberId}
										className={cn(
											"cursor-pointer",
											isHoveringGrid &&
												notAvailableMembers.some(
													(m) => m.memberId === member.memberId,
												)
												? "text-gray-400 line-through"
												: "",
										)}
										onMouseEnter={() => handleMemberHover(member.memberId)}
										onMouseLeave={() => handleMemberHover(null)}
									>
										<div className="flex items-center gap-2">
											<Checkbox
												id={`member-${member.memberId}`}
												checked={selectedMembers.includes(member.memberId)}
												onCheckedChange={() =>
													handleMemberSelect(member.memberId)
												}
											/>
											<Label
												htmlFor={`member-${member.memberId}`}
												className="cursor-pointer truncate text-sm"
											>
												{member.displayName}
											</Label>
										</div>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>

				<div className="rounded-lg border bg-white px-4 py-4">
					<h3 className="font-medium font-montserrat text-lg">Responders</h3>
					<p className="mt-0.5 text-gray-500 text-sm">
						Share your meeting link or assign your meeting to a group.
					</p>
					<p className="mt-2 text-gray-400 text-xs">{blockInfoString}</p>
				</div>
			</div>

			{/* Mobile drawer */}
			<div
				className={cn(
					"fixed right-0 bottom-0 h-96 w-full translate-y-full overflow-auto rounded-t-xl border-[1px] border-gray-400 bg-gray-100 bg-opacity-90 transition-transform duration-500 ease-in-out sm:left-auto sm:w-96 lg:hidden",
					isMobileDrawerOpen && "translate-y-0",
				)}
			>
				<div className="flex items-center justify-between px-8 py-4">
					<div>
						<h3 className="font-figtree font-medium">Responders</h3>
						<p className="font-bold font-dm-sans text-slate-400 text-xs uppercase tracking-wide">
							{blockInfoString}
						</p>
					</div>
					<button
						type="button"
						className="rounded-lg border-[1px] border-slate-400 p-0.5"
						onClick={() => setIsMobileDrawerOpen(false)}
					>
						<Close className="text-lg text-slate-400" />
					</button>
				</div>

				<div className="flex flex-col py-2">
					<div className="px-8">
						<span className="font-bold font-dm-sans text-slate-400 text-xs uppercase tracking-wide">
							Options
						</span>
					</div>
					<div className="flex items-center gap-2 pl-8">
						<Checkbox
							id="show-best-times-mobile"
							checked={showBestTimes}
							onCheckedChange={setShowBestTimes}
						/>
						<Label
							htmlFor="show-best-times-mobile"
							className="cursor-pointer text-lg"
						>
							Show Best Times
						</Label>
					</div>
				</div>

				<Divider />

				<div className="flex h-[32rem] grow flex-col py-2">
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
										? "text-gray-medium line-through"
										: "",
								)}
								onMouseEnter={() => handleMemberHover(member.memberId)}
								onMouseLeave={() => handleMemberHover(null)}
							>
								<div className="flex w-fit items-center gap-2">
									<Checkbox
										id={`member-mobile-${member.memberId}`}
										checked={selectedMembers.includes(member.memberId)}
										onCheckedChange={() => handleMemberSelect(member.memberId)}
									/>
									<Label
										htmlFor={`member-mobile-${member.memberId}`}
										className="cursor-pointer text-lg"
									>
										{member.displayName}
									</Label>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
