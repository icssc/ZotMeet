import React from "react";
import { useShallow } from "zustand/shallow";
import { AvailabilityBlockCell } from "@/components/availability/table/availability-block-cell";
import {
	generateCellKey,
	generateDateKey,
	getTimestampFromBlockIndex,
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
	currentPageAvailability: {
		availabilities: ZotDate[];
		ifNeeded: ZotDate[];
	};
	processedCellSegments: ProcessedCellEventSegments;
	timeZone: string;
}

export function AvailabilityBlocks({
	timeBlock,
	blockIndex,
	fromTimeMinutes,
	availabilityDates,
	availabilityTimeBlocksLength,
	currentPageAvailability,
	processedCellSegments,
	timeZone,
}: AvailabilityBlocksProps) {
	const { currentPage, itemsPerPage } = useAvailabilityStore(
		useShallow((state) => ({
			currentPage: state.currentPage,
			itemsPerPage: state.itemsPerPage,
		})),
	);
	const importPreview = useAvailabilityStore((s) => s.importPreview);

	const isTopOfHour = timeBlock % 60 === 0;
	const isHalfHour = timeBlock % 60 === 30;
	const isLastRow = blockIndex === availabilityTimeBlocksLength - 1;

	const spacers = spacerBeforeDate(currentPageAvailability["availabilities"]);

	return (
		<>
			{currentPageAvailability.availabilities.map(
				(selectedDate, pageDateIndex) => {
					const ifNeededDate = currentPageAvailability.ifNeeded[pageDateIndex];
					const key = generateDateKey({
						selectedDate,
						timeBlock,
						pageDateIndex,
					});

					if (selectedDate) {
						const zotDateIndex = pageDateIndex + currentPage * itemsPerPage;

						const isAvailable = selectedDate.getBlockAvailability(blockIndex);
						const isIfNeeded =
							!isAvailable &&
							(ifNeededDate?.getBlockAvailability(blockIndex) ?? false);

						const cellKey = generateCellKey(zotDateIndex, blockIndex);
						const segmentsForCell = processedCellSegments.get(cellKey) || [];

						const slotIso = getTimestampFromBlockIndex(
							blockIndex,
							zotDateIndex,
							fromTimeMinutes,
							availabilityDates,
							timeZone,
						);
						const importPreviewType =
							slotIso && importPreview?.ifNeededIsoSet.has(slotIso)
								? "if-needed"
								: slotIso && importPreview?.availableIsoSet.has(slotIso)
									? "available"
									: null;

						return (
							<React.Fragment key={key}>
								{spacers[pageDateIndex] && (
									<td className="w-3 md:w-4" aria-hidden="true" />
								)}
								<AvailabilityBlockCell
									blockIndex={blockIndex}
									isAvailable={isAvailable}
									isIfNeeded={isIfNeeded}
									zotDateIndex={zotDateIndex}
									isTopOfHour={isTopOfHour}
									isHalfHour={isHalfHour}
									isLastRow={isLastRow}
									eventSegments={segmentsForCell}
									hasSpacerBefore={spacers[pageDateIndex]}
									importPreviewType={importPreviewType}
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
				},
			)}
		</>
	);
}
