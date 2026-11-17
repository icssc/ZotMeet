import { memo } from "react";
import { View } from "react-native";

/** Stripe pitch: 3px of primary, 3px of gap — the web's `bg-stripes-primary`. */
const STRIPE_WIDTH = 3;
const STRIPE_PITCH = STRIPE_WIDTH * 2;

interface StripeBackdropProps {
	width: number;
	height: number;
}

/**
 * Native stand-in for the web's `bg-stripes-primary` `<tbody>` background: a
 * 45° hatch that if-needed cells reveal by thinning their paper base. React
 * Native has no repeating gradient, so the hatch is a fan of rotated bars,
 * drawn once per column (not per cell) to keep the view count low.
 *
 * Memoised: it depends only on the column's size, and a paint drag re-renders
 * the column many times a second.
 */
export const StripeBackdrop = memo(function StripeBackdrop({
	width,
	height,
}: StripeBackdropProps) {
	if (width <= 0 || height <= 0) return null;

	// Each bar rotates about its own centre, which sits on the column's
	// horizontal midline, so a bar at offset x sweeps x − height/2 … x + height/2
	// across the column's full height. Centres therefore run from −height/2
	// (to reach the bottom-left corner) to width + height/2 (the top-right).
	const barLength = Math.ceil(height * Math.SQRT2) + STRIPE_PITCH;
	const first = -height / 2;
	const count = Math.ceil((width + height) / STRIPE_PITCH) + 1;

	return (
		<View
			className="absolute inset-0 overflow-hidden"
			pointerEvents="none"
			aria-hidden
		>
			{Array.from({ length: count }, (_, i) => {
				const x = first + i * STRIPE_PITCH;
				return (
					<View
						className="absolute bg-primary"
						key={x}
						style={{
							width: STRIPE_WIDTH,
							height: barLength,
							left: x - STRIPE_WIDTH / 2,
							top: (height - barLength) / 2,
							transform: [{ rotate: "45deg" }],
						}}
					/>
				);
			})}
		</View>
	);
});
