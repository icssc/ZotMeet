import React from "react";
import { AvailabilityBlockCells } from "@/components/availability/table/availability-block-cells";
import { generateCellKey, generateDateKey } from "@/lib/availability/utils";
import type {
    AvailabilityBlockType,
    ProcessedCellEventSegments,
} from "@/lib/types/availability";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityPaginationStore } from "@/store/useAvailabilityPaginationStore";

interface AvailabilityBlocksProps {
    setAvailabilities: (startBlock: AvailabilityBlockType) => void;
    isTopOfHour: boolean;
    isHalfHour: boolean;
    isLastRow: boolean;
    timeBlock: number;
    blockIndex: number;
    currentPageAvailability: ZotDate[];
    processedCellSegments: ProcessedCellEventSegments;
}

export function AvailabilityBlocks({
    setAvailabilities,
    isTopOfHour,
    isHalfHour,
    isLastRow,
    timeBlock,
    blockIndex,
    currentPageAvailability,
    processedCellSegments,
}: AvailabilityBlocksProps) {
    const { currentPage, itemsPerPage } = useAvailabilityPaginationStore();

    return (
        <>
            {currentPageAvailability.map((selectedDate, pageDateIndex) => {
                const key = generateDateKey({
                    selectedDate,
                    timeBlock,
                    pageDateIndex,
                });

                if (selectedDate) {
                    const zotDateIndex =
                        pageDateIndex + currentPage * itemsPerPage;

                    const isAvailable =
                        selectedDate.getBlockAvailability(blockIndex);

                    const cellKey = generateCellKey(zotDateIndex, blockIndex);
                    const segmentsForCell =
                        processedCellSegments.get(cellKey) || [];

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
                            eventSegments={segmentsForCell}
                        />
                    );
                } else {
                    return <td key={key}></td>;
                }
            })}
        </>
    );
}
