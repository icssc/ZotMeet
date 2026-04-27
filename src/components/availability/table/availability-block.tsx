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
	importPreviewType?: "available" | "if-needed" | null;
}

export function AvailabilityBlock({
	isAvailable,
	isIfNeeded,
	isInDraftRange,
	paintMode,
	importPreviewType = null,
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
			{importPreviewType && (
				<div
					aria-hidden
					className={cn(
						"absolute inset-0 border-2",
						importPreviewType === "if-needed"
							? "border-if-needed/70 bg-if-needed/20"
							: "border-primary/70 bg-primary/20",
					)}
				/>
			)}
		</div>
	);
}
