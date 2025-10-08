import { getTimestampFromBlockIndex } from "@/components/availability/group-availability";
import { GroupAvailabilityBlock } from "@/components/availability/group-availability-block";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";
import { generateDateKey } from "@/lib/availability/utils";
import { SelectionStateType } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityPaginationStore } from "@/store/useAvailabilityPaginationStore";

interface GroupAvailabilityRowProps {
    timeBlock: number;
    blockIndex: number;
    availabilityTimeBlocksLength: number;
    currentPageAvailability: ZotDate[];
    selectedZotDateIndex: number | undefined;
    selectedBlockIndex: number | undefined;
    fromTime: number;
    availabilityDates: ZotDate[];
    numMembers: number;
    hoveredMember: string | null;
    handleCellClick: (params: {
        isSelected: boolean;
        zotDateIndex: number;
        blockIndex: number;
    }) => void;
    handleCellHover: (params: {
        zotDateIndex: number;
        blockIndex: number;
    }) => void;
    isSchedulingMeeting: boolean;
    selectionState: SelectionStateType | undefined;
}

export function GroupAvailabilityRow({
    timeBlock,
    blockIndex,
    availabilityTimeBlocksLength,
    currentPageAvailability,
    selectedZotDateIndex,
    selectedBlockIndex,
    fromTime,
    availabilityDates,
    numMembers,
    hoveredMember,
    handleCellClick,
    handleCellHover,
    isSchedulingMeeting,
    selectionState,
}: GroupAvailabilityRowProps) {
    const { currentPage, itemsPerPage } = useAvailabilityPaginationStore();

    const isTopOfHour = timeBlock % 60 === 0;
    const isHalfHour = timeBlock % 60 === 30;
    const isLastRow = blockIndex === availabilityTimeBlocksLength - 1;

    return (
        <tr>
            <AvailabilityTimeTicks timeBlock={timeBlock} />

            {currentPageAvailability.map((selectedDate, pageDateIndex) => {
                const key = generateDateKey({
                    selectedDate,
                    timeBlock,
                    pageDateIndex,
                });

                if (selectedDate) {
                    const zotDateIndex =
                        pageDateIndex + currentPage * itemsPerPage;

                    const isSelected =
                        selectedZotDateIndex === zotDateIndex &&
                        selectedBlockIndex === blockIndex;
                    // console.log(`Rendering cell at zotDateIndex: ${zotDateIndex}, blockIndex: ${blockIndex}`);
                    // console.log(`selectedZotDateIndex: ${selectedZotDateIndex}, selectedBlockIndex: ${selectedBlockIndex}`);
                    // console.log(`Cell ${blockIndex} isSelected: ${isSelected}`);

                    const timestamp = getTimestampFromBlockIndex(
                        blockIndex,
                        zotDateIndex,
                        fromTime,
                        availabilityDates
                    );

                    // Get the block (array of member IDs available at this timestamp)
                    const block =
                        selectedDate.groupAvailability[timestamp] || [];

                    // Calculate block color
                    let blockColor = "transparent";
                    // console.log(`cell ${blockIndex} hoveredMember: ${hoveredMember}`);
                    if (hoveredMember) {
                        if (block.includes(hoveredMember)) {
                            blockColor = "rgba(55, 124, 251)";
                        } else {
                            blockColor = "transparent";
                        }
                    } else if (isSchedulingMeeting && selectionState) {
                        console.log("selectionState:", selectionState);
                        const isInSelection =
                            selectionState.earlierDateIndex <= zotDateIndex &&
                            selectionState.laterDateIndex >= zotDateIndex &&
                            selectionState.earlierBlockIndex <= blockIndex &&
                            selectionState.laterBlockIndex >= blockIndex;
                        if (isInSelection) {
                            blockColor = "rgba(249, 225, 14, 0.75)";
                        }
                    } else if (isSchedulingMeeting && isSelected) {
                        console.log("cell " + blockIndex + " turned golden");
                        // If in scheduling mode and no members, show golden block
                        blockColor = "rgba(249, 225, 14, 0.33)";
                    } else if (numMembers > 0) {
                        const opacity = block.length / numMembers;
                        blockColor = `rgba(55, 124, 251, ${opacity})`;
                    }

                    const tableCellStyles = cn(
                        isTopOfHour
                            ? "border-t-[1px] border-t-gray-medium"
                            : "",
                        isHalfHour ? "border-t-[1px] border-t-gray-base" : "",
                        isLastRow ? "border-b-[1px]" : "",
                        isSelected
                            ? "outline-dashed outline-2 outline-slate-500"
                            : ""
                    );

                    return (
                        <td
                            key={key}
                            className="px-0 py-0"
                        >
                            <GroupAvailabilityBlock
                                className="group-availability-block block"
                                onClick={() =>
                                    handleCellClick({
                                        isSelected,
                                        zotDateIndex,
                                        blockIndex,
                                    })
                                }
                                onHover={() =>
                                    handleCellHover({
                                        zotDateIndex,
                                        blockIndex,
                                    })
                                }
                                block={block}
                                blockColor={blockColor}
                                tableCellStyles={tableCellStyles}
                                hoveredMember={hoveredMember}
                            />
                        </td>
                    );
                } else {
                    return <td key={key}></td>;
                }
            })}
        </tr>
    );
}
