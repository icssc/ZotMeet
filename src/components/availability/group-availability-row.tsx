import { getTimestampFromBlockIndex } from "@/components/availability/group-availability";
import { GroupAvailabilityBlock } from "@/components/availability/group-availability-block";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";
import { generateDateKey } from "@/lib/availability/utils";
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
                    if (hoveredMember) {
                        if (block.includes(hoveredMember)) {
                            blockColor = "rgba(55, 124, 251)";
                        } else {
                            blockColor = "transparent";
                        }
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
