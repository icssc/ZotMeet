import React from "react";
import { useAvailabilityContext } from "@/components/availability/context/availability-context";
import { AvailabilityBlockCells } from "@/components/availability/table/availability-block-cells";
import { AvailabilityBlockType } from "@/lib/types/availability";
import { ZotDate } from "@/lib/zotdate";

interface AvailabilityBlocksProps {
    setAvailabilities: (startBlock: AvailabilityBlockType) => void;
    isTopOfHour: boolean;
    isHalfHour: boolean;
    isLastRow: boolean;
    timeBlock: number;
    blockIndex: number;
}

export function AvailabilityBlocks({
    setAvailabilities,
    isTopOfHour,
    isHalfHour,
    isLastRow,
    timeBlock,
    blockIndex,
}: AvailabilityBlocksProps) {
    const { currentPage, itemsPerPage, currentPageAvailability } =
        useAvailabilityContext();

    const generateDateKey = (
        selectedDate: ZotDate,
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
                        />
                    );
                } else {
                    return <td key={key}></td>;
                }
            })}
        </>
    );
}
