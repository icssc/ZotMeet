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
	const showDraftOverlay =
		isInDraftRange && paintWillChange(paintMode, { isAvailable, isIfNeeded });

	return (
		<div className="pointer-events-none relative block h-full w-full py-2">
			{!isIfNeeded && (
				<div
					className={cn(
						"absolute inset-0 bg-paper",
						showDraftOverlay && paintMode === "if-needed" && "opacity-60",
					)}
				/>
			)}

			{isAvailable && (
				<div
					className={cn(
						"absolute inset-0 bg-primary",
						showDraftOverlay && paintMode !== "available" && "opacity-40",
					)}
				/>
			)}

			{showDraftOverlay && paintMode === "available" && !isAvailable && (
				<div className="absolute inset-0 bg-primary/40" />
			)}
			{showDraftOverlay && paintMode === "unavailable" && (
				<div className="absolute inset-0 bg-paper/60" />
			)}

			{importPreviewType && (
				<div
					aria-hidden
					className={cn(
						"absolute inset-0 border-2 border-primary/70",
						importPreviewType === "available" ? "bg-primary/20" : "bg-paper/40",
					)}
				/>
			)}
		</div>
	);
}
