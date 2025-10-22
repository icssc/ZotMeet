import { getTimestampFromBlockIndex } from "@/components/availability/group-availability";
import { GroupAvailabilityBlock } from "@/components/availability/group-availability-block";
import { AvailabilityTimeTicks } from "@/components/availability/table/availability-time-ticks";
import { generateDateKey } from "@/lib/availability/utils";
import { SelectionStateType } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityPaginationStore } from "@/store/useAvailabilityPaginationStore";
import { useBlockSelectionStore } from "@/store/useBlockSelectionStore";

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
    const {
        startBlockSelection,
        endBlockSelection,
        setStartBlockSelection,
        setEndBlockSelection,
    } = useBlockSelectionStore();

    const availabilitySelection = {
        zotDateIndex: selectedZotDateIndex,
        blockIndex: selectedBlockIndex,
    };

    // TODO: SEPARATE THESE, AND LET EACH AVAILBILITY USE THEM

    const handleTouchMove = (e: React.TouchEvent) => {
        const touchingElement = document.elementFromPoint(
            e.touches[0].clientX,
            e.touches[0].clientY
        );

        if (!touchingElement) return;

        const touchingDateIndex = parseInt(
            touchingElement.getAttribute("data-date-index") || "",
            10
        );
        const touchingBlockIndex = parseInt(
            touchingElement.getAttribute("data-block-index") || "",
            10
        );

        if (
            !isNaN(touchingDateIndex) &&
            !isNaN(touchingBlockIndex) &&
            startBlockSelection
        ) {
            setEndBlockSelection({
                zotDateIndex: touchingDateIndex,
                blockIndex: touchingBlockIndex,
            });
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (e.cancelable) {
            e.preventDefault();
        }

        if (startBlockSelection) {
            if (
                availabilitySelection.zotDateIndex !== undefined &&
                availabilitySelection.blockIndex !== undefined
            ) {
                setEndBlockSelection({
                    zotDateIndex: availabilitySelection.zotDateIndex,
                    blockIndex: availabilitySelection.blockIndex,
                });
            }
            // setAvailabilities(startBlockSelection);
        }
    };

    const handleMouseUp = () => {
        if (
            startBlockSelection &&
            availabilitySelection.zotDateIndex !== undefined &&
            availabilitySelection.blockIndex !== undefined
        ) {
            setEndBlockSelection({
                zotDateIndex: availabilitySelection.zotDateIndex,
                blockIndex: availabilitySelection.blockIndex,
            });
            // setAvailabilities(startBlockSelection);
        }
        setStartBlockSelection(null);
    };

    const handleMouseDown = () => {
        if (
            availabilitySelection.zotDateIndex !== undefined &&
            availabilitySelection.blockIndex !== undefined
        ) {
            setStartBlockSelection({
                zotDateIndex: availabilitySelection.zotDateIndex,
                blockIndex: availabilitySelection.blockIndex,
            });
            setEndBlockSelection({
                zotDateIndex: availabilitySelection.zotDateIndex,
                blockIndex: availabilitySelection.blockIndex,
            });
        }
    };

    const handleMouseMove = () => {
        if (startBlockSelection) {
            if (
                startBlockSelection &&
                availabilitySelection.zotDateIndex !== undefined &&
                availabilitySelection.blockIndex !== undefined
            ) {
                setEndBlockSelection({
                    zotDateIndex: availabilitySelection.zotDateIndex,
                    blockIndex: availabilitySelection.blockIndex,
                });
            }
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        if (
            startBlockSelection &&
            availabilitySelection.zotDateIndex !== undefined &&
            availabilitySelection.blockIndex !== undefined
        ) {
            setStartBlockSelection({
                zotDateIndex: availabilitySelection.zotDateIndex,
                blockIndex: availabilitySelection.blockIndex,
            });
            setEndBlockSelection({
                zotDateIndex: availabilitySelection.zotDateIndex,
                blockIndex: availabilitySelection.blockIndex,
            });
        }
    };

    const isInDragSelection = (zotDateIndex: number, blockIndex: number) => {
        if (!startBlockSelection || !endBlockSelection) return false;
        return (
            zotDateIndex >= startBlockSelection.zotDateIndex &&
            zotDateIndex <= endBlockSelection.zotDateIndex &&
            blockIndex >= startBlockSelection.blockIndex &&
            blockIndex <= endBlockSelection.blockIndex
        );
    };

    const isInSelectionRange = (zotDateIndex: number, blockIndex: number) => {
        if (!selectionState) return false;
        return (
            zotDateIndex >= selectionState.earlierDateIndex &&
            zotDateIndex <= selectionState.laterDateIndex &&
            blockIndex >= selectionState.earlierBlockIndex &&
            blockIndex <= selectionState.laterBlockIndex
        );
    };

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
                    } else if (
                        isSchedulingMeeting &&
                        (isInDragSelection(zotDateIndex, blockIndex) ||
                            isInSelectionRange(zotDateIndex, blockIndex))
                    ) {
                        // Drag highlight or persisted selection
                        blockColor = "rgba(249, 225, 14, 0.75)";
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
                            onMouseDown={() => handleMouseDown()}
                            onMouseMove={() => handleMouseMove()}
                            onMouseUp={() => handleMouseUp()}
                            onTouchStart={(e) => handleTouchStart(e)}
                            onTouchMove={(e) => handleTouchMove(e)}
                            onTouchEnd={(e) => handleTouchEnd(e)}
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
