import {
	type PaintMode,
	personalCellLayers,
	type RowChrome,
} from "@zotmeet/shared";
import { memo } from "react";
import { View } from "react-native";
import { blockTop } from "@/components/availability/table/availability-table-metrics";

interface PersonalAvailabilityBlockProps {
	blockIndex: number;
	chrome: RowChrome;
	hasSpacerBefore?: boolean;
	isAvailable: boolean;
	isIfNeeded: boolean;
	isInDraftRange: boolean;
	paintMode: PaintMode;
}

/**
 * Native personal cell — same `personalCellLayers` stack the web
 * `AvailabilityBlock` draws, with the group cell's border chrome.
 *
 * Memoised on its scalar props, so a drag re-renders only the cells whose
 * `isInDraftRange` flipped — not every cell of every column per pointer move.
 */
export const PersonalAvailabilityBlock = memo(
	function PersonalAvailabilityBlock({
		blockIndex,
		chrome,
		hasSpacerBefore = false,
		isAvailable,
		isIfNeeded,
		isInDraftRange,
		paintMode,
	}: PersonalAvailabilityBlockProps) {
		const layers = personalCellLayers(
			{ isAvailable, isIfNeeded },
			{ isInDraftRange, paintMode },
		);
		const top = blockTop(blockIndex);

		return (
			<View
				className={[
					"absolute right-0 left-0 border-border border-r",
					hasSpacerBefore ? "border-l" : "",
					chrome.isTopOfHour ? "border-t" : "",
					chrome.isLastRow ? "border-b" : "",
				].join(" ")}
				pointerEvents="none"
				style={{ top, height: blockTop(blockIndex + 1) - top }}
			>
				{layers.paperBase && (
					<View
						className="absolute inset-0 bg-paper"
						style={{ opacity: layers.paperBase.opacity }}
					/>
				)}
				{layers.available && (
					<View
						className="absolute inset-0 bg-primary"
						style={{ opacity: layers.available.opacity }}
					/>
				)}
				{layers.previewAvailable && (
					<View className="absolute inset-0 bg-primary opacity-40" />
				)}
				{layers.previewUnpaint && (
					<View className="absolute inset-0 bg-paper opacity-60" />
				)}
				{chrome.isHalfHour && (
					<View className="absolute top-0 right-0 left-0 h-px overflow-hidden">
						<View className="absolute top-0 -right-0.5 -left-0.5 h-[3px] border border-border border-dashed" />
					</View>
				)}
			</View>
		);
	},
);
