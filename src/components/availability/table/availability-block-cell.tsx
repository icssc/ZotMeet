import { useShallow } from "zustand/shallow";
import { AvailabilityBlock } from "@/components/availability/table/availability-block";
import { GoogleCalendarEventBlock } from "@/components/availability/table/google-calendar-event-block";
import type { EventSegment } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

interface AvailabilityBlockCellProps {
	blockIndex: number;
	isAvailable: boolean;
	zotDateIndex: number;
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
	isTopOfHour,
	isHalfHour,
	isLastRow,
	eventSegments,
	hasSpacerBefore = false,
}: AvailabilityBlockCellProps) {
	const { selectionState } = useAvailabilityStore(
		useShallow((state) => ({
			startBlockSelection: state.startBlockSelection,
			selectionState: state.selectionState,
			setStartBlockSelection: state.setStartBlockSelection,
			setEndBlockSelection: state.setEndBlockSelection,
		})),
	);

	return (
		<td className="relative px-0 py-0">
			<button
				type="button"
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
