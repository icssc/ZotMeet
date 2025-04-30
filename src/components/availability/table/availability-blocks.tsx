"use client";

import { AvailabilityBlockCells } from "@/components/availability/table/availability-block-cells";
import { ZotDate } from "@/lib/zotdate";

interface AvailabilityBlocksProps {
    setAvailabilities: (block: {
        zotDateIndex: number;
        blockIndex: number;
    }) => void;
    isTopOfHour: boolean;
    isHalfHour: boolean;
    isLastRow: boolean;
    timeBlock: number;
    blockIndex: number;
    currentPage: number;
    itemsPerPage: number;
    currentPageAvailability: ZotDate[] | undefined;
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
}: AvailabilityBlocksProps) {
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
