import { XIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { getTimestampFromBlockIndex } from "@/components/availability/group-availability";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { newZonedPageAvailAndDates } from "@/lib/availability/utils";
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
	const [newBlocks, newAvailDates] = newZonedPageAvailAndDates(
		currentPageAvailability,
		availabilityDates,
		doesntNeedDay,
	);

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

	/**
	 * For the selected cell, split members into:
	 * - availableMembers: members in (available OR ifNeeded)
	 * - notAvailableMembers: members in neither
	 * - ifNeededOnlySet: members who are ONLY in ifNeeded (used for "*" marker)
	 *
	 * Note: if there is no selected cell, default to "nobody available" and "everyone not available"
	 * so the UI shows N/A / full list accordingly.
	 */
	const { availableMembers, notAvailableMembers, ifNeededOnlySet } =
		useMemo(() => {
			if (
				selectedZotDateIndex === undefined ||
				selectedBlockIndex === undefined
			) {
				return {
					availableMembers: [] as Member[],
					notAvailableMembers: members,
					ifNeededOnlySet: new Set<string>(),
				};
			}

			const selectedDate = newAvailDates[selectedZotDateIndex];
			if (!selectedDate) {
				return {
					availableMembers: [] as Member[],
					notAvailableMembers: members,
					ifNeededOnlySet: new Set<string>(),
				};
			}

			const timestamp = getTimestampFromBlockIndex(
				selectedBlockIndex,
				selectedZotDateIndex,
				fromTime,
				timezone,
				newAvailDates,
			);

			const availableIds = selectedDate.groupAvailability?.[timestamp] ?? [];
			const ifNeededIds =
				selectedDate.groupIfNeededAvailability?.[timestamp] ?? [];

			const availableSet = new Set(availableIds);
			const combinedAvailableSet = new Set<string>([
				...availableIds,
				...ifNeededIds,
			]);

			const ifNeededOnly = new Set<string>(
				ifNeededIds.filter((id) => !availableSet.has(id)),
			);

			return {
				availableMembers: members.filter((m) =>
					combinedAvailableSet.has(m.memberId),
				),
				notAvailableMembers: members.filter(
					(m) => !combinedAvailableSet.has(m.memberId),
				),
				ifNeededOnlySet: ifNeededOnly,
			};
		}, [
			selectedZotDateIndex,
			selectedBlockIndex,
			newAvailDates,
			fromTime,
			timezone,
			members,
		]);

	useEffect(() => {
		if (
			selectedZotDateIndex !== undefined &&
			selectedBlockIndex !== undefined
		) {
			const displayDate = newAvailDates[selectedZotDateIndex]?.day;

			if (!displayDate) {
				setBlockInfoString("Select a cell to view");
				return;
			}

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

				{/* Main + IfNeeded UI (your feature) + keep main's checkbox selection UX */}
				<div className="grid grid-cols-2 lg:flex lg:flex-col lg:gap-10 lg:py-4">
					{/* AVAILABLE */}
					<div>
						<div className="flex items-baseline justify-between border-gray-300 border-b-[1px] px-8">
							<span className="font-bold font-dm-sans text-slate-400 text-xs uppercase tracking-wide">
								AVAILABLE (
								{isHoveringGrid ? availableMembers.length : members.length})
							</span>
							<span className="text-slate-400 text-xs">* = if needed</span>
						</div>

						<ul className="h-64 overflow-auto py-2 pl-8">
							{members.map((member) => {
								const isNotAvailable =
									isHoveringGrid &&
									notAvailableMembers.some(
										(m) => m.memberId === member.memberId,
									);

								return (
									<li
										key={member.memberId}
										className={cn(
											"cursor-pointer text-lg",
											isNotAvailable
												? "text-decoration-line: text-gray-medium line-through"
												: "text-gray-800",
										)}
										onMouseEnter={() => handleMemberHover(member.memberId)}
										onMouseLeave={() => handleMemberHover(null)}
									>
										<ul className="flex w-fit items-center gap-2">
											<Checkbox
												id={`MEMBER${member.memberId}`}
												checked={selectedMembers.includes(member.memberId)}
												onCheckedChange={() =>
													handleMemberSelect(member.memberId)
												}
											/>
											<Label
												htmlFor={`MEMBER${member.memberId}`}
												className="cursor-pointer text-lg"
											>
												{member.displayName}
												{ifNeededOnlySet.has(member.memberId) ? " *" : ""}
											</Label>
										</ul>
									</li>
								);
							})}
						</ul>
					</div>

					{/* NOT AVAILABLE */}
					<div className="hidden lg:block">
						<div className="border-gray-300 border-b-[1px] px-8">
							<span className="font-bold font-dm-sans text-slate-400 text-xs uppercase tracking-wide">
								NOT AVAILABLE ({notAvailableMembers.length})
							</span>
						</div>

						<ul className="h-64 overflow-auto py-2 pl-8">
							{notAvailableMembers.length > 0 ? (
								notAvailableMembers.map((member) => (
									<li
										key={member.memberId}
										className="cursor-pointer text-gray-400 text-lg"
										onMouseEnter={() => handleMemberHover(member.memberId)}
										onMouseLeave={() => handleMemberHover(null)}
									>
										{member.displayName}
									</li>
								))
							) : (
								<li className="text-gray-400 text-sm italic">N/A</li>
							)}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
