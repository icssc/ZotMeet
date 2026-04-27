import { useMemo } from "react";
import {
	type PaintMode,
	paintWillChange,
} from "@/lib/availability/paint-selection";
import { cn } from "@/lib/utils";

interface AvailabilityBlockProps {
	isAvailable: boolean;
	isIfNeeded: boolean;
	isInDraftRange: boolean;
	paintMode: PaintMode;
	showImportPreview?: boolean;
}

export function AvailabilityBlock({
	isAvailable,
	isIfNeeded,
	isInDraftRange,
	paintMode,
	showImportPreview = false,
}: AvailabilityBlockProps) {
	const backgroundColor = useMemo(() => {
		const showDraftOverlay =
			isInDraftRange && paintWillChange(paintMode, { isAvailable, isIfNeeded });

		if (showDraftOverlay) return "bg-primary/40";
		return isAvailable
			? "bg-primary"
			: isIfNeeded
				? "bg-if-needed"
				: "transparent";
	}, [isInDraftRange, paintMode, isAvailable, isIfNeeded]);

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
