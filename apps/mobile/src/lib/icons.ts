import type { LucideIcon } from "lucide-react-native";
import * as lucide from "lucide-react-native";
import { cssInterop } from "nativewind";
import type { ComponentType } from "react";
import type { StyleProp, TextStyle } from "react-native";

/**
 * lucide icons paint their stroke from the `color` *prop* and ignore the colour
 * in `style`, so a `text-…` class on an icon silently does nothing. This maps
 * the class's resolved colour (and opacity) onto that prop.
 *
 * Import icons from here rather than from `lucide-react-native` and
 * `className` behaves the way it reads, light/dark tokens included.
 */
function withClassName<T extends LucideIcon>(icon: T): T {
	// `cssInterop` types `target` against the component's own props; lucide's
	// icons take `style` through `SvgProps`, which the `LucideIcon` alias hides.
	cssInterop(
		icon as ComponentType<{
			style?: StyleProp<TextStyle>;
			color?: string;
			opacity?: number;
		}>,
		{
			className: {
				target: "style",
				nativeStyleToProp: { color: true, opacity: true },
			},
		},
	);
	return icon;
}

export const CalendarDays = withClassName(lucide.CalendarDays);
export const CalendarRange = withClassName(lucide.CalendarRange);
export const Check = withClassName(lucide.Check);
export const ChevronDown = withClassName(lucide.ChevronDown);
export const ChevronLeft = withClassName(lucide.ChevronLeft);
export const ChevronRight = withClassName(lucide.ChevronRight);
export const Clock = withClassName(lucide.Clock);
export const Plus = withClassName(lucide.Plus);
export const User = withClassName(lucide.User);
export const Users = withClassName(lucide.Users);
export const X = withClassName(lucide.X);
