import { useMemo } from "react";
import type { SelectionStateType } from "@/lib/types/availability";
import { cn } from "@/lib/utils";

interface AvailabilityBlockProps {
	isAvailable: boolean;
	zotDateIndex: number;
	blockIndex: number;
	selectionState: SelectionStateType | undefined;
	showImportPreview?: boolean;
}

export function AvailabilityBlock({
	isAvailable,
	zotDateIndex,
	blockIndex,
	selectionState,
	showImportPreview = false,
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
		<div className="pointer-events-none relative block h-full w-full py-2">
			<div className={cn("absolute inset-0", backgroundColor)} />
			{showImportPreview && (
				<div
					className="absolute inset-0 border-2 border-primary/70 bg-primary/20"
					aria-hidden
				/>
			)}
		</div>
	);
}
