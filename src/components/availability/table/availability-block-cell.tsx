import type React from "react";
import { AvailabilityBlock } from "@/components/availability/table/availability-block";
import { GoogleCalendarEventBlock } from "@/components/availability/table/google-calendar-event-block";
import type { GridCell } from "@/hooks/use-grid-drag-selection";
import type { EventSegment } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

interface AvailabilityBlockCellProps {
	blockIndex: number;
	isAvailable: boolean;
	isIfNeeded: boolean;
	zotDateIndex: number;
	isTopOfHour: boolean;
	isHalfHour: boolean;
	isLastRow: boolean;
	eventSegments: EventSegment[];
	hasSpacerBefore?: boolean;
	showImportPreview?: boolean;
	onPointerDown?: React.PointerEventHandler<HTMLElement>;
	onPointerMove?: React.PointerEventHandler<HTMLElement>;
	onPointerUp?: React.PointerEventHandler<HTMLElement>;
	onPointerCancel?: React.PointerEventHandler<HTMLElement>;
	onKeyCommit?: (cell: GridCell) => void;
}

export function AvailabilityBlockCell({
	blockIndex,
	isAvailable,
	isIfNeeded,
	zotDateIndex,
	isTopOfHour,
	isHalfHour,
	isLastRow,
	eventSegments,
	hasSpacerBefore = false,
	showImportPreview = false,
	onPointerDown,
	onPointerMove,
	onPointerUp,
	onPointerCancel,
	onKeyCommit,
}: AvailabilityBlockCellProps) {
	const selectionState = useAvailabilityStore((state) => state.selectionState);

	return (
		<td className="relative px-0 py-0">
			<button
				type="button"
				data-date-index={zotDateIndex}
				data-block-index={blockIndex}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerCancel={onPointerCancel}
				onClick={() => onKeyCommit?.({ zotDateIndex, blockIndex })}
				className={cn(
					"block h-full w-full cursor-pointer border-gray-medium border-r-[1px] [touch-action:none]",
					isTopOfHour && "border-t-[1px] border-t-gray-medium",
					isHalfHour && "border-top-style:dotted border-t border-t-gray-base",
					isLastRow && "border-b-[1px]",
					hasSpacerBefore && "border-l-[1px] border-l-gray-medium",
				)}
			>
				<AvailabilityBlock
					isAvailable={isAvailable}
					isIfNeeded={isIfNeeded}
					zotDateIndex={zotDateIndex}
					blockIndex={blockIndex}
					selectionState={selectionState}
					showImportPreview={showImportPreview}
				/>
			</button>

			<GoogleCalendarEventBlock
				eventSegments={eventSegments}
				isAvailable={isAvailable}
			/>
		</td>
	);
}
