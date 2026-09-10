import type { LucideProps } from "lucide-react-native";
import * as lucide from "lucide-react-native";
import { cssInterop } from "nativewind";
import type { ComponentType } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { cn } from "@/lib/utils";

/**
 * Every lucide icon, themed. Reach them through the namespace — `<Icon.Bell />`,
 * `<Icon.Search className="text-primary" />` — and autocomplete lists the whole
 * set with nothing to register first.
 *
 * Two things happen to an icon on the way out, both of them fixes for the fact
 * that RN has no colour inheritance:
 *
 *  - lucide paints its stroke from the `color` *prop* and ignores the colour in
 *    `style`, so a `text-…` class would silently do nothing. `cssInterop` maps
 *    the class's resolved colour (and opacity) onto that prop.
 *  - left alone, `<Icon.Bell />` renders lucide's `currentColor`, which RN SVG
 *    resolves to black — invisible in dark mode. So an icon that is given
 *    neither a colour nor a class defaults to `text-foreground`, the way a MUI
 *    icon inherits the surrounding text colour. Anything explicit still wins:
 *    `cn` drops the default for a `text-…` class, and a `color` prop (what the
 *    tab bar hands its icons) suppresses it.
 */

/** Icon-only view of the module; the entry point also exports helpers. */
type LucideIcons = typeof import("lucide-react-native/icons");

type IconProps = LucideProps & {
	className?: string;
	style?: StyleProp<TextStyle>;
};

const cache = new Map<string, ComponentType<IconProps>>();

function themed(name: string): ComponentType<IconProps> | undefined {
	const cached = cache.get(name);
	if (cached) return cached;

	const base = (lucide as Record<string, unknown>)[name];
	const isComponent =
		typeof base === "function" ||
		(typeof base === "object" && base !== null && "$$typeof" in base);
	if (!isComponent) return undefined;

	// `cssInterop` types `target` against the component's own props; lucide's
	// icons take `style` through `SvgProps`, which the `LucideIcon` alias hides.
	const Base = base as ComponentType<IconProps>;
	cssInterop(
		Base as ComponentType<{
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

	function Themed({ className, ...props }: IconProps) {
		return (
			<Base
				className={cn(
					props.color === undefined && "text-foreground",
					className,
				)}
				{...props}
			/>
		);
	}
	Themed.displayName = name;

	cache.set(name, Themed);
	return Themed;
}

export const Icon = new Proxy({} as LucideIcons, {
	get: (_target, property) =>
		typeof property === "string" ? themed(property) : undefined,
});
