import { useState } from "react";
import { Pressable, type PressableProps, View } from "react-native";
import { cn } from "@/lib/utils";

/**
 * The "3D" depth treatment shared by buttons and selectable cards.
 *
 * The web app draws it with a hard, blur-less drop shadow
 * (`0 4px 0 0 …` in `src/theme.ts`) and slides the element down on press.
 * React Native has no multi-shadow support, so the ledge is a real view: an
 * outer "well" painted in the ledge colour with `depth` px of bottom padding,
 * and the content sitting on top of it. Pressing translates the content down
 * by `depth`, covering the ledge — the same sink that `translateY(4px)` gives
 * on the web, and with a constant outer height so nothing below it reflows.
 */
export type RaisedProps = Omit<PressableProps, "children"> & {
	/** Height of the ledge, in px. Matches the web's 4px shadow offset. */
	depth?: number;
	/** Colour of the ledge, e.g. `bg-primary` under a primary button. */
	ledgeClassName?: string;
	/** Radius shared by the well and the face, so corners stay flush. */
	radiusClassName?: string;
	/**
	 * Classes for the well — the element that occupies the layout slot. Margins,
	 * width and flex belong here; on the face they would push the face around
	 * *inside* the well and expose the ledge on the wrong side.
	 */
	containerClassName?: string;
	/** Classes for the face: padding, fill, and the content's own layout. */
	className?: string;
	children?: React.ReactNode;
};

export function Raised({
	depth = 4,
	ledgeClassName,
	radiusClassName = "rounded-md",
	containerClassName,
	className,
	children,
	disabled,
	onPressIn,
	onPressOut,
	style,
	...props
}: RaisedProps) {
	const [pressed, setPressed] = useState(false);
	const sunk = pressed && !disabled;

	return (
		<View
			className={cn(
				radiusClassName,
				"bg-elevation-3d",
				ledgeClassName,
				containerClassName,
			)}
			style={{ paddingBottom: depth }}
		>
			<Pressable
				accessibilityState={{ disabled: !!disabled }}
				className={cn(radiusClassName, className)}
				disabled={disabled}
				onPressIn={(event) => {
					setPressed(true);
					onPressIn?.(event);
				}}
				onPressOut={(event) => {
					setPressed(false);
					onPressOut?.(event);
				}}
				// The caller's style composes with the sink rather than replacing it:
				// `props` is spread last, so a plain `style` prop here would silently
				// drop the transform and the button would stop animating on press.
				// `Pressable` also accepts `style` as a function of its press state,
				// so that form is resolved before it is merged.
				style={(state) => [
					{ transform: [{ translateY: sunk ? depth : 0 }] },
					typeof style === "function" ? style(state) : style,
				]}
				{...props}
			>
				{children}
			</Pressable>
		</View>
	);
}
