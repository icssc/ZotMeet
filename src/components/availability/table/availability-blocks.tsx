import React from "react";
import { useShallow } from "zustand/shallow";
import { AvailabilityBlockCell } from "@/components/availability/table/availability-block-cell";
import { getTimestampFromBlockIndex } from "@/lib/availability/grid-timestamps";
import {
	generateCellKey,
	generateDateKey,
	spacerBeforeDate,
} from "@/lib/availability/utils";
import type { ProcessedCellEventSegments } from "@/lib/types/availability";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

interface AvailabilityBlocksProps {
	timeBlock: number;
	blockIndex: number;
	fromTimeMinutes: number;
	availabilityDates: ZotDate[];
	availabilityTimeBlocksLength: number;
	currentPageAvailability: ZotDate[];
	processedCellSegments: ProcessedCellEventSegments;
}

export function AvailabilityBlocks({
	timeBlock,
	blockIndex,
	fromTimeMinutes,
	availabilityDates,
	availabilityTimeBlocksLength,
	currentPageAvailability,
	processedCellSegments,
}: AvailabilityBlocksProps) {
	const { currentPage, itemsPerPage } = useAvailabilityStore(
		useShallow((state) => ({
			currentPage: state.currentPage,
			itemsPerPage: state.itemsPerPage,
		})),
	);
	const importPreviewIsoSet = useAvailabilityStore(
		(s) => s.importPreviewIsoSet,
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

					const slotIso = getTimestampFromBlockIndex(
						blockIndex,
						zotDateIndex,
						fromTimeMinutes,
						availabilityDates,
					);
					const showImportPreview =
						Boolean(slotIso) && Boolean(importPreviewIsoSet?.has(slotIso));

					return (
						<React.Fragment key={key}>
							{spacers[pageDateIndex] && (
								<td className="w-3 md:w-4" aria-hidden="true" />
							)}
							<AvailabilityBlockCell
								blockIndex={blockIndex}
								isAvailable={isAvailable}
								zotDateIndex={zotDateIndex}
								isTopOfHour={isTopOfHour}
								isHalfHour={isHalfHour}
								isLastRow={isLastRow}
								eventSegments={segmentsForCell}
								hasSpacerBefore={spacers[pageDateIndex]}
								showImportPreview={showImportPreview}
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
