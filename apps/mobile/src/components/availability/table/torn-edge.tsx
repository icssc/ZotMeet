import { memo } from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";
import type { AnimatedProps } from "react-native-reanimated";
import { Animated } from "@/lib/animated";
import { cn } from "@/lib/utils";

/**
 * One tooth of the tear: its height along the edge. Each tooth is a square
 * rotated 45°, so its bite into the column is half its height.
 */
const TOOTH_HEIGHT = 16;
const TOOTH_DEPTH = TOOTH_HEIGHT / 2;
const TOOTH_SIDE = TOOTH_HEIGHT / Math.SQRT2;

interface TornEdgeProps {
	side: "left" | "right";
	height: number;
	/** Applied to the strip — the pager fades the tear out mid-swipe. */
	style?: AnimatedProps<ViewProps>["style"];
}

/**
 * Mobile-only: a sawtooth notched into the outer edge of the first or last
 * day column to show the grid continues on to another page — the arrows in
 * the header are easy to miss, and the web table has no equivalent because
 * it shows the arrows beside a full-width table.
 *
 * Each tooth is a diamond (a rotated square) in the screen background colour
 * centred on the column's edge, clipped to the half that lies inside the
 * column, so nothing spills onto the time ticks beside the first column. The
 * two sides of the diamond that face into the column carry the same
 * `gray-medium` border as the cells, so the tear reads as the column's
 * outline even where the paper is unpainted and the notch would otherwise be
 * background-on-background. Memoised like `StripeBackdrop` — it depends only
 * on the column's height and a paint drag re-renders the column often.
 */
export const TornEdge = memo(function TornEdge({
	side,
	height,
	style,
}: TornEdgeProps) {
	if (height <= 0) return null;

	const count = Math.ceil(height / TOOTH_HEIGHT);
	// Centre the diamond on the column edge: the strip's left edge for the
	// left tear, its right edge for the right tear.
	const centreX = side === "left" ? 0 : TOOTH_DEPTH;

	return (
		<Animated.View
			className={cn(
				"absolute inset-y-0 overflow-hidden",
				side === "left" ? "left-0" : "right-0",
			)}
			pointerEvents="none"
			aria-hidden
			style={[{ width: TOOTH_DEPTH }, style]}
		>
			{Array.from({ length: count }, (_, i) => (
				<View
					// Rotating 45° clockwise turns the square's top and right sides
					// into the diamond's top-right and bottom-right — the ones a
					// left tear shows — and its bottom and left into the two a right
					// tear shows.
					className={cn(
						"absolute border-gray-medium bg-background",
						side === "left" ? "border-t border-r" : "border-b border-l",
					)}
					key={i}
					style={{
						width: TOOTH_SIDE,
						height: TOOTH_SIDE,
						left: centreX - TOOTH_SIDE / 2,
						top: i * TOOTH_HEIGHT + (TOOTH_HEIGHT - TOOTH_SIDE) / 2,
						transform: [{ rotate: "45deg" }],
					}}
				/>
			))}
		</Animated.View>
	);
});
