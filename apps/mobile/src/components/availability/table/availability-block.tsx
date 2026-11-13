import type { BlockFill, RowChrome } from "@zotmeet/shared";
import { View } from "react-native";
import { blockTop } from "@/components/availability/table/availability-table-metrics";

/**
 * A 1px dotted rule. React Native only draws a dotted `borderStyle` when the
 * border is set on every side, so the rule is a bordered box clipped down to
 * its top edge; the box overhangs the sides so the vertical borders' end-caps
 * are clipped away too.
 */
function DottedRule() {
	return (
		<View className="absolute top-0 right-0 left-0 h-px overflow-hidden">
			<View className="absolute top-0 -right-0.5 -left-0.5 h-[3px] border border-gray-base border-dotted" />
		</View>
	);
}

interface AvailabilityBlockProps {
	blockIndex: number;
	fill: BlockFill;
	chrome: RowChrome;
	hasSpacerBefore?: boolean;
}

/**
 * Native counterpart to the web app's `GroupAvailabilityBlock`: one 15-minute
 * slot of one day. The rules take the web cell's greys — `gray-medium`
 * verticals, `gray-base` hour and half-hour lines — rather than the theme
 * border, which all but vanishes against dark paper. The fill comes from the shared `calculateBlockFill`, and
 * the layers are the web's — a paper base that thins to reveal the column's
 * stripe backdrop for if-needed responses, with the primary fill on top at
 * the available share's opacity.
 *
 * Each block draws only its top rule (solid on the hour, dotted on the half)
 * — otherwise neighbouring outlines would double into a 2px line. Blocks are
 * placed absolutely at `blockTop` so their edges meet on whole pixels.
 */
export function AvailabilityBlock({
	blockIndex,
	fill,
	chrome,
	hasSpacerBefore = false,
}: AvailabilityBlockProps) {
	const paperOpacity = fill.stripes ? 1 - fill.stripes.opacity : 1;
	const top = blockTop(blockIndex);

	return (
		<View
			className={[
				"absolute right-0 left-0 border-gray-medium border-r",
				hasSpacerBefore ? "border-l" : "",
				chrome.isTopOfHour ? "border-t border-t-gray-base" : "",
				chrome.isLastRow ? "border-b" : "",
			].join(" ")}
			style={{ top, height: blockTop(blockIndex + 1) - top }}
		>
			{paperOpacity > 0 && (
				<View
					className="absolute inset-0 bg-paper"
					style={{ opacity: paperOpacity }}
				/>
			)}
			{fill.solid && (
				<View
					className="absolute inset-0 bg-primary"
					style={{ opacity: fill.solid.ratio }}
				/>
			)}
			{chrome.isHalfHour && <DottedRule />}
		</View>
	);
}
