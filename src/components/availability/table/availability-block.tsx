import { useMemo } from "react";
import {
	type PaintMode,
	paintWillChange,
} from "@/lib/availability/paint-selection";
import type { SelectionStateType } from "@/lib/types/availability";
import { cn } from "@/lib/utils";

interface AvailabilityBlockProps {
	isAvailable: boolean;
	isIfNeeded: boolean;
	zotDateIndex: number;
	blockIndex: number;
	draftRange: SelectionStateType | undefined;
	paintMode: PaintMode;
	showImportPreview?: boolean;
}

function covers(
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

export function AvailabilityBlock({
	isAvailable,
	isIfNeeded,
	zotDateIndex,
	blockIndex,
	draftRange,
	paintMode,
	showImportPreview = false,
}: AvailabilityBlockProps) {
	const backgroundColor = useMemo(() => {
		const showDraftOverlay =
			covers(draftRange, zotDateIndex, blockIndex) &&
			paintWillChange(paintMode, { isAvailable, isIfNeeded });

		if (showDraftOverlay) return "bg-primary/40";
		return isAvailable
			? "bg-primary"
			: isIfNeeded
				? "bg-if-needed"
				: "transparent";
	}, [
		draftRange,
		paintMode,
		isAvailable,
		isIfNeeded,
		zotDateIndex,
		blockIndex,
	]);

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
