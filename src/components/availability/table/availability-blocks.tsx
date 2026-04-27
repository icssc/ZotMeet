import { Fragment } from "react";
import { useShallow } from "zustand/shallow";
import {
	AvailabilityBlockCell,
	type GridCellHandlers,
} from "@/components/availability/table/availability-block-cell";
import type { PaintMode } from "@/lib/availability/paint-selection";
import {
	generateCellKey,
	generateDateKey,
	getTimestampFromBlockIndex,
	spacerBeforeDate,
} from "@/lib/availability/utils";
import type {
	EventSegment,
	ProcessedCellEventSegments,
	SelectionStateType,
} from "@/lib/types/availability";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

const EMPTY_EVENT_SEGMENTS: EventSegment[] = [];

function coversCell(
	range: SelectionStateType | undefined,
	zotDateIndex: number,
	blockIndex: number,
): boolean {
	if (!range) return false;
	return (
		range.earlierDateIndex <= zotDateIndex &&
		zotDateIndex <= range.laterDateIndex &&
		range.earlierBlockIndex <= blockIndex &&
		blockIndex <= range.laterBlockIndex
	);
}

interface AvailabilityBlocksProps extends GridCellHandlers {
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
	paintMode: PaintMode;
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
	paintMode,
	onPointerDown,
	onPointerMove,
	onPointerUp,
	onPointerCancel,
	onKeyDown,
}: AvailabilityBlocksProps) {
	// Single subscription per row. Cells receive a derived boolean, not the
	// range itself — this is the one place that still needs to react to
	// draftRange changes, so the re-render surface is bounded to the rows
	// whose membership flipped.
	const { currentPage, itemsPerPage, draftRange } = useAvailabilityStore(
		useShallow((state) => ({
			currentPage: state.currentPage,
			itemsPerPage: state.itemsPerPage,
			draftRange: state.draftRange,
		})),
	);
	const importPreviewIsoSet = useAvailabilityStore(
		(s) => s.importPreviewIsoSet,
	);

	const isTopOfHour = timeBlock % 60 === 0;
	const isHalfHour = timeBlock % 60 === 30;
	const isLastRow = blockIndex === availabilityTimeBlocksLength - 1;

	const spacers = spacerBeforeDate(currentPageAvailability.availabilities);

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
						const segmentsForCell =
							processedCellSegments.get(cellKey) ?? EMPTY_EVENT_SEGMENTS;

						const slotIso = getTimestampFromBlockIndex(
							blockIndex,
							zotDateIndex,
							fromTimeMinutes,
							availabilityDates,
							timeZone,
						);
						const showImportPreview =
							Boolean(slotIso) && Boolean(importPreviewIsoSet?.has(slotIso));

						const isInDraftRange = coversCell(
							draftRange,
							zotDateIndex,
							blockIndex,
						);

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
									isInDraftRange={isInDraftRange}
									paintMode={paintMode}
									onPointerDown={onPointerDown}
									onPointerMove={onPointerMove}
									onPointerUp={onPointerUp}
									onPointerCancel={onPointerCancel}
									onKeyDown={onKeyDown}
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
