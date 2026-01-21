import { useMemo } from "react";
import type { SelectionStateType } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import type { AvailabilityType } from "@/lib/zotdate";

interface AvailabilityBlockProps {
	isAvailable: boolean;
	isIfNeeded: boolean;
	zotDateIndex: number;
	blockIndex: number;
	selectionState: SelectionStateType | undefined;
	availabilityKind?: AvailabilityType;
}

export function AvailabilityBlock({
	isAvailable,
	isIfNeeded,
	zotDateIndex,
	blockIndex,
	selectionState,
	availabilityKind = "availability",
}: AvailabilityBlockProps) {
	const backgroundColor = useMemo(() => {
		// selection overlay (drag)
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
				return availabilityKind === "ifNeeded"
					? "bg-yellow-200"
					: "bg-[#BFD1F5]";
			}
		}

		// committed state: ifNeeded wins visually
		if (isIfNeeded) {
			return "bg-yellow-300";
		}
		if (isAvailable) {
			return "bg-primary";
		}
		return "bg-transparent";
	}, [
		selectionState,
		zotDateIndex,
		blockIndex,
		availabilityKind,
		isIfNeeded,
		isAvailable,
	]);

	return (
		<div
			data-date-index={zotDateIndex}
			data-block-index={blockIndex}
			className={cn("block h-full w-full py-2", backgroundColor)}
		/>
	);
}
