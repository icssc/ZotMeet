import { useCallback, useRef } from "react";
import { useShallow } from "zustand/shallow";
import { AvailabilityBlock } from "@/components/availability/table/availability-block";
import { GoogleCalendarEventBlock } from "@/components/availability/table/google-calendar-event-block";
import type {
	AvailabilityBlockType,
	EventSegment,
} from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import { useBlockSelectionStore } from "@/store/useBlockSelectionStore";

interface AvailabilityBlockCellProps {
	blockIndex: number;
	isAvailable: boolean;
	zotDateIndex: number;
	setAvailabilities: (startBlock: AvailabilityBlockType) => void;
	isTopOfHour: boolean;
	isHalfHour: boolean;
	isLastRow: boolean;
	eventSegments: EventSegment[];
	hasSpacerBefore?: boolean;
}

export function AvailabilityBlockCell({
	blockIndex,
	isAvailable,
	zotDateIndex,
	setAvailabilities,
	isTopOfHour,
	isHalfHour,
	isLastRow,
	eventSegments,
	hasSpacerBefore = false,
}: AvailabilityBlockCellProps) {
	const isDraggingRef = useRef(false);

	const {
		startBlockSelection,
		selectionState,
		setStartBlockSelection,
		setEndBlockSelection,
	} = useBlockSelectionStore(
		useShallow((state) => ({
			startBlockSelection: state.startBlockSelection,
			selectionState: state.selectionState,
			setStartBlockSelection: state.setStartBlockSelection,
			setEndBlockSelection: state.setEndBlockSelection,
		})),
	);

	// Pointer event handlers
	const handlePointerDown = useCallback(
		(e: React.PointerEvent) => {
			const target = e.currentTarget as HTMLElement;
			target.setPointerCapture(e.pointerId);

			isDraggingRef.current = true;
			const selection = { zotDateIndex, blockIndex };
			setStartBlockSelection(selection);
			setEndBlockSelection(selection);
		},
		[zotDateIndex, blockIndex, setStartBlockSelection, setEndBlockSelection],
	);

	const handlePointerMove = useCallback(
		(e: React.PointerEvent) => {
			if (!isDraggingRef.current) return;

			const element = document.elementFromPoint(e.clientX, e.clientY);
			if (!element) return;

			const touchingDateIndex = parseInt(
				element.getAttribute("data-date-index") || "",
				10,
			);
			const touchingBlockIndex = parseInt(
				element.getAttribute("data-block-index") || "",
				10,
			);

			if (
				!Number.isNaN(touchingDateIndex) &&
				!Number.isNaN(touchingBlockIndex)
			) {
				setEndBlockSelection({
					zotDateIndex: touchingDateIndex,
					blockIndex: touchingBlockIndex,
				});
			}
		},
		[setEndBlockSelection],
	);

	const handlePointerUp = useCallback(
		(e: React.PointerEvent) => {
			if (!isDraggingRef.current) return;

			const target = e.currentTarget as HTMLElement;
			if (target.hasPointerCapture(e.pointerId)) {
				target.releasePointerCapture(e.pointerId);
			}

			isDraggingRef.current = false;
			if (startBlockSelection) {
				setAvailabilities(startBlockSelection);
			}
		},
		[startBlockSelection, setAvailabilities],
	);

	return (
		<td className="relative px-0 py-0">
			<button
				type="button"
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				data-date-index={zotDateIndex}
				data-block-index={blockIndex}
				className={cn(
					"block h-full w-full cursor-row-resize border-gray-medium border-r-[1px] [touch-action:none]",
					isTopOfHour && "border-t-[1px] border-t-gray-medium",
					isHalfHour && "border-t-[1px] border-t-gray-base",
					isLastRow && "border-b-[1px]",
					hasSpacerBefore && "border-l-[1px] border-l-gray-medium",
				)}
			>
				<AvailabilityBlock
					isAvailable={isAvailable}
					zotDateIndex={zotDateIndex}
					blockIndex={blockIndex}
					selectionState={selectionState}
				/>
			</button>

			<GoogleCalendarEventBlock
				eventSegments={eventSegments}
				isAvailable={isAvailable}
			/>
		</td>
	);
}
