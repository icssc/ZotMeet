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
 */
export function StripeBackdrop({ width, height }: StripeBackdropProps) {
	if (width <= 0 || height <= 0) return null;

	// A 45° bar at horizontal offset x covers the diagonal x - height … x, so
	// bars run from -height to width to reach both bottom-left and top-right.
	const barLength = Math.ceil((width + height) * Math.SQRT2);
	const count = Math.ceil((width + height) / STRIPE_PITCH);

	return (
		<View
			className="absolute inset-0 overflow-hidden"
			pointerEvents="none"
			aria-hidden
		>
			{Array.from({ length: count }, (_, i) => {
				const x = i * STRIPE_PITCH - height;
				return (
					<View
						className="absolute bg-primary"
						key={x}
						style={{
							width: STRIPE_WIDTH,
							height: barLength,
							left: x,
							top: -(barLength - height) / 2,
							transform: [{ rotate: "45deg" }],
						}}
					/>
				);
			})}
		</View>
	);
}
