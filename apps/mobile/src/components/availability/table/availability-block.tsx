import { View } from "react-native";
import { HOUR_HEIGHT } from "@/components/availability/table/availability-table-metrics";

/**
 * A 1px dashed rule. React Native only draws a dashed `borderStyle` when the
 * border is set on every side, so the rule is a bordered box clipped down to
 * its top edge; the box overhangs the sides so the vertical borders' end-caps
 * are clipped away too.
 */
function DashedRule() {
	return (
		<View className="h-px w-full overflow-hidden">
			<View className="absolute top-0 -right-0.5 -left-0.5 h-[3px] border border-border border-dashed" />
		</View>
	);
}

interface AvailabilityBlockProps {
	/** Closes the bottom edge; only the last block in a column needs it. */
	isLastRow: boolean;
}

/**
 * Native counterpart to the web app's
 * `components/availability/table/availability-block.tsx`: one hour of one
 * day, a solid outline with a dashed half-hour line through it. Blocks stack,
 * so each draws only its top edge — otherwise neighbouring outlines would
 * double up into a 2px rule.
 *
 * The web block also paints availability, if-needed and draft-paint states;
 * none of that exists on mobile yet, so this is the empty cell only.
 */
export function AvailabilityBlock({ isLastRow }: AvailabilityBlockProps) {
	return (
		<View
			className={`w-full border-border border-x border-t ${isLastRow ? "border-b" : ""}`}
			style={{ height: HOUR_HEIGHT }}
		>
			<View style={{ height: HOUR_HEIGHT / 2 }} />
			<DashedRule />
		</View>
	);
}
