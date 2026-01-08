import React from "react";
import { AvailabilityBlockCell } from "@/components/availability/table/availability-block-cell";
import {
	generateCellKey,
	generateDateKey,
	spacerBeforeDate,
} from "@/lib/availability/utils";
import type {
	AvailabilityBlockType,
	ProcessedCellEventSegments,
} from "@/lib/types/availability";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityPaginationStore } from "@/store/useAvailabilityPaginationStore";
import { useShallow } from "zustand/shallow";

interface AvailabilityBlocksProps {
	setAvailabilities: (startBlock: AvailabilityBlockType) => void;
	timeBlock: number;
	blockIndex: number;
	availabilityTimeBlocksLength: number;
	currentPageAvailability: ZotDate[];
	processedCellSegments: ProcessedCellEventSegments;
}

export function AvailabilityBlocks({
	setAvailabilities,
	timeBlock,
	blockIndex,
	availabilityTimeBlocksLength,
	currentPageAvailability,
	processedCellSegments,
}: AvailabilityBlocksProps) {
	const { currentPage, itemsPerPage } = useAvailabilityPaginationStore(
		useShallow((state) => ({
			currentPage: state.currentPage,
			itemsPerPage: state.itemsPerPage,
		})),
	);

	const isTopOfHour = timeBlock % 60 === 0;
	const isHalfHour = timeBlock % 60 === 30;
	const isLastRow = blockIndex === availabilityTimeBlocksLength - 1;

	const spacers = spacerBeforeDate(currentPageAvailability);

	return (
		<>
			{currentPageAvailability.map((selectedDate, pageDateIndex) => {
				const key = generateDateKey({
					selectedDate,
					timeBlock,
					pageDateIndex,
				});

				if (selectedDate) {
					const zotDateIndex = pageDateIndex + currentPage * itemsPerPage;

					const isAvailable = selectedDate.getBlockAvailability(blockIndex);

					const cellKey = generateCellKey(zotDateIndex, blockIndex);
					const segmentsForCell = processedCellSegments.get(cellKey) || [];

					return (
						<React.Fragment key={key}>
							{spacers[pageDateIndex] && (
								<td className="w-3 md:w-4" aria-hidden="true" />
							)}
							<AvailabilityBlockCell
								blockIndex={blockIndex}
								isAvailable={isAvailable}
								zotDateIndex={zotDateIndex}
								setAvailabilities={setAvailabilities}
								isTopOfHour={isTopOfHour}
								isHalfHour={isHalfHour}
								isLastRow={isLastRow}
								eventSegments={segmentsForCell}
								hasSpacerBefore={spacers[pageDateIndex]}
							/>
						</React.Fragment>
					);
				} else {
					return (
						<React.Fragment key={key}>
							{spacers[pageDateIndex] && (
								<td className="w-3 md:w-4" aria-hidden="true" />
							)}
							<td></td>
						</React.Fragment>
					);
				}
			})}
		</>
	);
}
