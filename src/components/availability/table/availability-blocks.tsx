import type React from "react";
import { Fragment } from "react";
import { useShallow } from "zustand/shallow";
import { AvailabilityBlockCell } from "@/components/availability/table/availability-block-cell";
import type { GridCell } from "@/hooks/use-grid-drag-selection";
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
	onPointerDown?: React.PointerEventHandler<HTMLElement>;
	onPointerMove?: React.PointerEventHandler<HTMLElement>;
	onPointerUp?: React.PointerEventHandler<HTMLElement>;
	onPointerCancel?: React.PointerEventHandler<HTMLElement>;
	onKeyCommit?: (cell: GridCell) => void;
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
	onPointerDown,
	onPointerMove,
	onPointerUp,
	onPointerCancel,
	onKeyCommit,
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
						const showImportPreview =
							Boolean(slotIso) && Boolean(importPreviewIsoSet?.has(slotIso));

						return (
							<Fragment key={key}>
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
									showImportPreview={showImportPreview}
									onPointerDown={onPointerDown}
									onPointerMove={onPointerMove}
									onPointerUp={onPointerUp}
									onPointerCancel={onPointerCancel}
									onKeyCommit={onKeyCommit}
								/>
							</Fragment>
						);
					} else {
						return (
							<Fragment key={key}>
								{spacers[pageDateIndex] && (
									<td className="w-3 md:w-4" aria-hidden="true" />
								)}
								<td></td>
							</Fragment>
						);
					}
				},
			)}
		</>
	);
}
