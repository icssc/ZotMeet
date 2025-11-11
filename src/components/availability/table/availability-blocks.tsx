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

                const zotDateIndex = pageDateIndex + currentPage * itemsPerPage;

                return (
                    <React.Fragment key={key}>
                        {spacerBeforeDate[pageDateIndex] && (
                            <td className="w-2 border-r-[1px] border-gray-medium bg-transparent p-0" />
                        )}
                        {selectedDate ? (
                            <AvailabilityBlockCells
                                key={key}
                                blockIndex={blockIndex}
                                isAvailable={selectedDate.getBlockAvailability(
                                    blockIndex
                                )}
                                zotDateIndex={zotDateIndex}
                                setAvailabilities={setAvailabilities}
                                isTopOfHour={isTopOfHour}
                                isHalfHour={isHalfHour}
                                isLastRow={isLastRow}
                                eventSegments={
                                    processedCellSegments.get(
                                        generateCellKey(
                                            zotDateIndex,
                                            blockIndex
                                        )
                                    ) || []
                                }
                            />
                        ) : (
                            <td key={key} />
                        )}
                    </React.Fragment>
                );
            })}
        </>
    );
}
