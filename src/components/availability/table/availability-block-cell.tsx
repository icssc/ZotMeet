import type React from "react";
import { memo } from "react";
import { AvailabilityBlock } from "@/components/availability/table/availability-block";
import { GoogleCalendarEventBlock } from "@/components/availability/table/google-calendar-event-block";
import type { GridCell } from "@/hooks/use-grid-drag-selection";
import type { PaintMode } from "@/lib/availability/paint-selection";
import type { EventSegment } from "@/lib/types/availability";
import { cn } from "@/lib/utils";

export interface GridCellHandlers {
	onPointerDown: React.PointerEventHandler<HTMLElement>;
	onPointerMove: React.PointerEventHandler<HTMLElement>;
	onPointerUp: React.PointerEventHandler<HTMLElement>;
	onPointerCancel: React.PointerEventHandler<HTMLElement>;
	onKeyDown: React.KeyboardEventHandler<HTMLElement>;
	/**
	 * Optional hover callback; used by the group view for the hoverRange
	 * preview. Called with the cell under the pointer on `pointerenter`.
	 */
	onCellHover?: (cell: GridCell) => void;
}

interface AvailabilityBlockCellProps
	extends Omit<GridCellHandlers, "onCellHover"> {
	blockIndex: number;
	isAvailable: boolean;
	isIfNeeded: boolean;
	zotDateIndex: number;
	isTopOfHour: boolean;
	isHalfHour: boolean;
	isLastRow: boolean;
	eventSegments: EventSegment[];
	hasSpacerBefore?: boolean;
	importPreviewType?: "available" | "if-needed" | null;
	isInDraftRange: boolean;
	paintMode: PaintMode;
}

export const AvailabilityBlockCell = memo(function AvailabilityBlockCell({
	blockIndex,
	isAvailable,
	isIfNeeded,
	zotDateIndex,
	isTopOfHour,
	isHalfHour,
	isLastRow,
	eventSegments,
	hasSpacerBefore = false,
	importPreviewType = null,
	isInDraftRange,
	paintMode,
	onPointerDown,
	onPointerMove,
	onPointerUp,
	onPointerCancel,
	onKeyDown,
}: AvailabilityBlockCellProps) {
	return (
		<td className="relative px-0 py-0">
			<button
				type="button"
				data-date-index={zotDateIndex}
				data-block-index={blockIndex}
				tabIndex={0}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerCancel={onPointerCancel}
				onKeyDown={onKeyDown}
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
					isInDraftRange={isInDraftRange}
					paintMode={paintMode}
					importPreviewType={importPreviewType}
				/>
			</button>

			<GoogleCalendarEventBlock
				eventSegments={eventSegments}
				isAvailable={isAvailable}
			/>
		</td>
	);
});
