import { useMemo } from "react";
import { SelectionStateType } from "@/lib/types/availability";
import { cn } from "@/lib/utils";

interface AvailabilityBlockProps {
	isAvailable: boolean;
	zotDateIndex: number;
	blockIndex: number;
	selectionState: SelectionStateType | undefined;
}

export function AvailabilityBlock({
	isAvailable,
	zotDateIndex,
	blockIndex,
	selectionState,
}: AvailabilityBlockProps) {
	/**
	 * Computes the background color of a single time block cell
	 */
	const backgroundColor = useMemo(() => {
		// Render different background color if user is in middle of making a selection and is in range
		if (selectionState) {
			const {
				earlierDateIndex,
				laterDateIndex,
				earlierBlockIndex,
				laterBlockIndex,
			} = selectionState;
			const dateInRange =
				earlierDateIndex <= zotDateIndex && zotDateIndex <= laterDateIndex;
			const timeInRange =
				earlierBlockIndex <= blockIndex && blockIndex <= laterBlockIndex;

			if (dateInRange && timeInRange) {
				return "bg-[#BFD1F5]";
			}
		}
		return isAvailable ? "bg-primary" : "bg-transparent";
	}, [selectionState, isAvailable, zotDateIndex, blockIndex]);

	return (
		<div
			data-date-index={zotDateIndex}
			data-block-index={blockIndex}
			className={cn("block h-full w-full py-2", backgroundColor)}
		/>
	);
}
