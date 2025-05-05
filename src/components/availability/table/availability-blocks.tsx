import React from "react";
import { AvailabilityBlockCells } from "@/components/availability/table/availability-block-cells";
import {
    AvailabilityBlockType,
    SelectionStateType,
} from "@/lib/types/availability";
import { ZotDate } from "@/lib/zotdate";

interface AvailabilityBlocksProps {
    setAvailabilities: (startBlock: AvailabilityBlockType) => void;
    isTopOfHour: boolean;
    isHalfHour: boolean;
    isLastRow: boolean;
    timeBlock: number;
    blockIndex: number;
    currentPage: number;
    itemsPerPage: number;
    currentPageAvailability: (ZotDate | null)[];
    startBlockSelection: AvailabilityBlockType | undefined;
    setStartBlockSelection: (block: AvailabilityBlockType | undefined) => void;
    endBlockSelection: AvailabilityBlockType | undefined;
    setEndBlockSelection: (block: AvailabilityBlockType | undefined) => void;
    selectionState: SelectionStateType | undefined;
}

export function AvailabilityBlocks({
    setAvailabilities,
    isTopOfHour,
    isHalfHour,
    isLastRow,
    timeBlock,
    blockIndex,
    currentPage,
    itemsPerPage,
    currentPageAvailability,
    startBlockSelection,
    setStartBlockSelection,
    endBlockSelection,
    setEndBlockSelection,
    selectionState,
}: AvailabilityBlocksProps) {
    const generateDateKey = (
        selectedDate: ZotDate | null,
        timeBlock: number,
        pageDateIndex: number
    ) => {
        return selectedDate
            ? `date-${selectedDate.valueOf()}-${timeBlock}`
            : `padding-${pageDateIndex}`;
    };

    return (
        <>
            {currentPageAvailability?.map((selectedDate, pageDateIndex) => {
                const key = generateDateKey(
                    selectedDate,
                    timeBlock,
                    pageDateIndex
                );

                if (selectedDate) {
                    const zotDateIndex =
                        pageDateIndex + currentPage * itemsPerPage;

                    const isAvailable =
                        selectedDate.getBlockAvailability(blockIndex);

                    return (
                        <AvailabilityBlockCells
                            key={key}
                            blockIndex={blockIndex}
                            isAvailable={isAvailable}
                            zotDateIndex={zotDateIndex}
                            setAvailabilities={setAvailabilities}
                            isTopOfHour={isTopOfHour}
                            isHalfHour={isHalfHour}
                            isLastRow={isLastRow}
                            startBlockSelection={startBlockSelection}
                            setStartBlockSelection={setStartBlockSelection}
                            endBlockSelection={endBlockSelection}
                            setEndBlockSelection={setEndBlockSelection}
                            selectionState={selectionState}
                        />
                    );
                } else {
                    return <td key={key}></td>;
                }
            })}
        </>
    );
}
