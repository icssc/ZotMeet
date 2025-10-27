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
    spacerBeforeDate: boolean[];
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
    spacerBeforeDate,
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

                const cells: React.ReactNode[] = [];
                if (spacerBeforeDate?.[pageDateIndex]) {
                    cells.push(
                        <td
                            key={`spacer-${pageDateIndex}`}
                            className="w-2 border-r-[1px] border-gray-medium bg-transparent p-0"
                        />
                    );
                }

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
                    const block =
                        selectedDate.groupAvailability[timestamp] || [];

                    let blockColor = "transparent";
                    if (hoveredMember) {
                        blockColor = block.includes(hoveredMember)
                            ? "rgba(55, 124, 251)"
                            : "transparent";
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

                    cells.push(
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
                    cells.push(<td key={key}></td>);
                }
                return cells;
            })}
        </tr>
    );
}
