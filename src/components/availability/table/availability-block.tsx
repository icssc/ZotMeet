import {
	type CellPaintTarget,
	type ImportPreviewTarget,
	type PaintMode,
	paintWillChange,
} from "@/lib/availability/paint-selection";
import { cn } from "@/lib/utils";

interface AvailabilityBlockProps {
	isAvailable: boolean;
	isIfNeeded: boolean;
	isInDraftRange: boolean;
	paintMode: PaintMode;
	importPreviewType?: ImportPreviewTarget;
}

export function AvailabilityBlock({
	isAvailable,
	isIfNeeded,
	isInDraftRange,
	paintMode,
	importPreviewType = null,
}: AvailabilityBlockProps) {
	const state = { isAvailable, isIfNeeded };

	const draftTarget: CellPaintTarget | null =
		isInDraftRange && paintWillChange(paintMode, state) ? paintMode : null;
	const importTarget: CellPaintTarget | null =
		!draftTarget &&
		importPreviewType &&
		paintWillChange(importPreviewType, state)
			? importPreviewType
			: null;

	const previewTarget: CellPaintTarget | null = draftTarget ?? importTarget;

	const previewWillBeNonIfNeeded =
		previewTarget !== null && previewTarget !== "if-needed";
	const renderPaperBase = !isIfNeeded || previewWillBeNonIfNeeded;

	return (
		<div className="pointer-events-none relative block h-full w-full py-2">
			{renderPaperBase && (
				<div
					className={cn(
						"absolute inset-0 bg-paper",
						previewTarget === "if-needed" && "opacity-60",
					)}
				/>
			)}

			{isAvailable && (
				<div
					className={cn(
						"absolute inset-0 bg-primary",
						previewTarget && previewTarget !== "available" && "opacity-40",
					)}
				/>
			)}

			{previewTarget === "available" && !isAvailable && (
				<div className="absolute inset-0 bg-primary/40" />
			)}
			{draftTarget === "unavailable" && (isAvailable || isIfNeeded) && (
				<div className="absolute inset-0 bg-paper/60" />
			)}
		</div>
	);
}
