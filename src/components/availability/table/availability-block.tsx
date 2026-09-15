import {
	type ImportPreviewTarget,
	type PaintMode,
	personalCellLayers,
} from "@/lib/availability/paint-selection";
import { cn } from "@/lib/utils";

interface AvailabilityBlockProps {
	isAvailable: boolean;
	isIfNeeded: boolean;
	isInDraftRange: boolean;
	paintMode: PaintMode;
	importPreviewType?: ImportPreviewTarget;
}

/**
 * Draws the layer stack `personalCellLayers` decides on; the native grid
 * draws the same stack with `View`s.
 */
export function AvailabilityBlock({
	isAvailable,
	isIfNeeded,
	isInDraftRange,
	paintMode,
	importPreviewType = null,
}: AvailabilityBlockProps) {
	const layers = personalCellLayers(
		{ isAvailable, isIfNeeded },
		{ isInDraftRange, paintMode },
		importPreviewType,
	);

	return (
		<div className="pointer-events-none relative block h-full w-full py-2">
			{layers.paperBase && (
				<div
					className={cn(
						"absolute inset-0 bg-paper",
						layers.paperBase.opacity < 1 && "opacity-60",
					)}
				/>
			)}

			{layers.available && (
				<div
					className={cn(
						"absolute inset-0 bg-primary",
						layers.available.opacity < 1 && "opacity-40",
					)}
				/>
			)}

			{layers.previewAvailable && (
				<div className="absolute inset-0 bg-primary/40" />
			)}
			{layers.previewUnpaint && (
				<div className="absolute inset-0 bg-paper/60" />
			)}
		</div>
	);
}
