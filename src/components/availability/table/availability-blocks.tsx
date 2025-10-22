import React from "react";
import { AvailabilityBlockCells } from "@/components/availability/table/availability-block-cells";
import { generateCellKey, generateDateKey } from "@/lib/availability/utils";
import type {
    AvailabilityBlockType,
    ProcessedCellEventSegments,
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
    currentPageAvailability: ZotDate[];
    processedCellSegments: ProcessedCellEventSegments;
    spacerBeforeDate: boolean[];
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
    processedCellSegments,
    spacerBeforeDate,
}: AvailabilityBlocksProps) {
    return (
        <>
            {currentPageAvailability.map((selectedDate, pageDateIndex) => {
                const key = generateDateKey({
                    selectedDate,
                    timeBlock,
                    pageDateIndex,
                });
                const cells: React.ReactNode[] = []; // Insert spacer if needed
                if (spacerBeforeDate?.[pageDateIndex]) {
                    cells.push(
                        <td
                            key={`spacer-${pageDateIndex}`}
                            className="w-2 bg-transparent p-0"
                        />
                    );
                }
                if (selectedDate) {
                    const zotDateIndex =
                        pageDateIndex + currentPage * itemsPerPage;

                    const isAvailable =
                        selectedDate.getBlockAvailability(blockIndex);

                    const cellKey = generateCellKey(zotDateIndex, blockIndex);
                    const segmentsForCell =
                        processedCellSegments.get(cellKey) || [];
                    cells.push(
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
                    cells.push(<td key={key} />);
                }
                return cells;
            })}
        </>
    );
}
