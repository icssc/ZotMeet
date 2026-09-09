import { Pressable, type PressableProps } from "react-native";
import { cn } from "@/lib/utils";

/**
 * Native counterpart to MUI's `<IconButton>` (see the web app's MUI theme).
 * A circular, transparent hit target that just centres whatever icon it wraps.
 */
type IconButtonProps = PressableProps & {
	/** Padding around the icon; MUI uses 8px in app bars, 5px in the picker. */
	size?: "default" | "sm";
	children: React.ReactNode;
};

export function IconButton({
	className,
	size = "default",
	children,
	...props
}: IconButtonProps) {
	return (
		<Pressable
			accessibilityRole="button"
			className={cn(
				"items-center justify-center overflow-hidden rounded-full active:opacity-60",
				size === "default" ? "p-2" : "p-[5px]",
				className,
			)}
			{...props}
		>
			{children}
		</Pressable>
	);
}
