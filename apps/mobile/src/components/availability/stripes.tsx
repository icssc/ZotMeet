import { useColorScheme } from "nativewind";
import { useId } from "react";
import { StyleSheet, View } from "react-native";
import { Circle, Defs, Pattern, Rect, Svg } from "react-native-svg";
import { colorsFor } from "@/lib/theme";

/**
 * The diagonal hatch that marks an "if needed" response.
 *
 * The web app draws it with the `stripes-primary` background image in the root
 * `tailwind.config.ts` — `repeating-linear-gradient(45deg, … 0 3px, transparent
 * 3px 6px)`. React Native has no gradient backgrounds, which is why
 * `tailwind.config.js` here notes the stripes were left out; this is the
 * native equivalent, same 3px band on a 6px period at 45°.
 */
const STRIPE_WIDTH = 3;
const STRIPE_PERIOD = 6;

function useStripeColors() {
	const { colorScheme } = useColorScheme();
	return colorsFor(colorScheme);
}

/** The `<Defs>` block both the fill and the swatch need. */
function StripePattern({ id, color }: { id: string; color: string }) {
	return (
		<Defs>
			<Pattern
				height={STRIPE_PERIOD}
				id={id}
				patternTransform="rotate(45)"
				patternUnits="userSpaceOnUse"
				width={STRIPE_PERIOD}
			>
				<Rect
					fill={color}
					height={STRIPE_PERIOD}
					width={STRIPE_WIDTH}
					x={0}
					y={0}
				/>
			</Pattern>
		</Defs>
	);
}

/**
 * Fills the parent with the hatch. Absolutely positioned, so it sits under
 * whatever the parent renders and is clipped by its rounded corners.
 *
 * The pattern id is per-instance: `react-native-svg` renders each `<Svg>` as
 * its own document, but a shared literal id has historically leaked between
 * them on Android, and a hook is cheaper than debugging that.
 */
export function HatchFill() {
	const id = useId();
	const colors = useStripeColors();

	return (
		<Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
			<StripePattern color={colors.primaryOutline} id={id} />
			<Rect fill={`url(#${id})`} height="100%" width="100%" x={0} y={0} />
		</Svg>
	);
}

/**
 * The round swatch in the floating bar's paint-mode options — "Available
 * Legend" and friends in Figma (667:37674). They are circles rather than
 * icons: a solid fill, the same hatch, or nothing, each ringed in MUI's paper
 * outline.
 */
export function StatusSwatch({
	status,
	size = 18,
}: {
	status: "available" | "if-needed" | "unavailable";
	size?: number;
}) {
	const id = useId();
	const colors = useStripeColors();
	const radius = size / 2;
	// Figma's ring is 0.761px; inset by half of it so it is not clipped.
	const strokeWidth = 0.76;

	return (
		<View style={{ width: size, height: size }}>
			<Svg height={size} width={size}>
				<StripePattern color={colors.primaryOutline} id={id} />
				{status !== "unavailable" ? (
					<Circle
						cx={radius}
						cy={radius}
						fill={status === "available" ? colors.primary : `url(#${id})`}
						r={radius}
					/>
				) : null}
				<Circle
					cx={radius}
					cy={radius}
					fill="none"
					r={radius - strokeWidth / 2}
					stroke={colors.paperOutline}
					strokeWidth={strokeWidth}
				/>
			</Svg>
		</View>
	);
}
