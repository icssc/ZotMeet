import React, { useEffect, useState } from "react";
import { Member } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";
import { XIcon } from "lucide-react";

interface GroupResponsesProps {
    availabilityDates: ZotDate[];
    isMobileDrawerOpen: boolean;
    selectedZotDateIndex: number | undefined;
    selectedBlockIndex: number | undefined;
    availableMembersOfSelection: Member[];
    notAvailableMembersOfSelection: Member[];
    closeMobileDrawer: VoidFunction;
    onMemberHover: (memberId: string | null) => void;
}

export function GroupResponses({
    availabilityDates,
    isMobileDrawerOpen,
    selectedZotDateIndex,
    selectedBlockIndex,
    availableMembersOfSelection,
    notAvailableMembersOfSelection,
    closeMobileDrawer,
    onMemberHover,
}: GroupResponsesProps) {
    const [blockInfoString, setBlockInfoString] = useState(
        "Select a cell to view"
    );

    useEffect(() => {
        if (
            selectedZotDateIndex !== undefined &&
            selectedBlockIndex !== undefined
        ) {
            const formattedDate = availabilityDates[
                selectedZotDateIndex
            ].day.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });

            const earliestTime =
                availabilityDates[selectedZotDateIndex].earliestTime;
            const blockLength =
                availabilityDates[selectedZotDateIndex].blockLength;

            const startTime = ZotDate.toTimeBlockString(
                earliestTime + selectedBlockIndex * blockLength,
                false
            );
            const endTime = ZotDate.toTimeBlockString(
                earliestTime + selectedBlockIndex * blockLength + blockLength,
                false
            );
            setBlockInfoString(`${formattedDate}, ${startTime} - ${endTime}`);
        } else {
            setBlockInfoString("Select a cell to view");
        }
    }, [selectedZotDateIndex, selectedBlockIndex, availabilityDates]);

    return (
        <div>
            <div className="hidden pb-1 pl-8 lg:block">
                <h3 className="font-montserrat text-xl font-medium">
                    Responders
                </h3>
                <p className="font-dm-sans text-xs font-bold uppercase tracking-wide text-slate-400">
                    {blockInfoString}
                </p>
            </div>

            <div
                className={cn(
                    "fixed bottom-0 h-96 w-full translate-y-full overflow-auto rounded-t-xl border-[1px] border-gray-400 bg-gray-100 bg-opacity-90 transition-transform duration-500 ease-in-out sm:left-auto sm:right-0 sm:w-96 lg:relative lg:right-10 lg:top-0 lg:h-auto lg:w-64 lg:translate-y-0 lg:self-stretch lg:rounded-l-xl lg:bg-opacity-50",
                    isMobileDrawerOpen && "translate-y-0"
                )}
            >
                <div className="flex items-center justify-between px-8 py-4 lg:hidden">
                    <div>
                        <h3 className="font-montserrat font-medium">
                            Responders
                        </h3>
                        <p className="font-dm-sans text-xs font-bold uppercase tracking-wide text-slate-400">
                            {blockInfoString}
                        </p>
                    </div>
                    <button
                        className="rounded-lg border-[1px] border-slate-400 p-0.5 lg:hidden"
                        onClick={closeMobileDrawer}
                    >
                        <XIcon className="text-lg text-slate-400" />
                    </button>
                </div>
                <div className="grid grid-cols-2 lg:flex lg:flex-col lg:gap-10 lg:py-4">
                    <div>
                        <div className="border-b-[1px] border-gray-300 px-8">
                            <div className="bg-success mr-1 inline-block h-2 w-2 rounded-full" />
                            <span className="font-dm-sans text-xs font-bold uppercase tracking-wide text-slate-400">
                                AVAILABLE
                            </span>
                        </div>
                        <ul className="h-64 space-y-2 overflow-auto py-2 pl-8">
                            {availableMembersOfSelection.length > 0 ? (
                                availableMembersOfSelection.map((member) => (
                                    <li
                                        key={member.memberId}
                                        className="cursor-pointer text-lg text-gray-800"
                                        onMouseEnter={() =>
                                            onMemberHover(member.memberId)
                                        }
                                        onMouseLeave={() => onMemberHover(null)}
                                    >
                                        {member.displayName}
                                    </li>
                                ))
                            ) : (
                                <li className="text-sm italic text-gray-400">
                                    N/A
                                </li>
                            )}
                        </ul>
                    </div>
                    <div>
                        <div className="border-b-[1px] border-gray-300 px-8">
                            <div className="mr-1 inline-block h-2 w-2 rounded-full bg-gray-400" />
                            <span className="font-dm-sans text-xs font-bold uppercase tracking-wide text-slate-400">
                                NOT AVAILABLE
                            </span>
                        </div>
                        <ul className="h-64 space-y-2 overflow-auto py-2 pl-8">
                            {notAvailableMembersOfSelection.length > 0 ? (
                                notAvailableMembersOfSelection.map((member) => (
                                    <li
                                        key={member.memberId}
                                        className="cursor-pointer text-lg text-gray-400"
                                        onMouseEnter={() =>
                                            onMemberHover(member.memberId)
                                        }
                                        onMouseLeave={() => onMemberHover(null)}
                                    >
                                        {member.displayName}
                                    </li>
                                ))
                            ) : (
                                <li className="text-sm italic text-gray-400">
                                    N/A
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
