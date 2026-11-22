import type { ReactElement } from "react";
import { Pressable, type PressableProps } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

/**
 * Native counterpart to MUI's `<Chip>` (web: `group-responses.tsx` responder
 * chips). Same `label` / `color` / `variant` prop names, so web snippets port
 * 1:1. Only what the Figma needs so far: no `icon` or `onDelete` yet.
 *
 * - `color` picks the ink: `primary` (pink) or `default` (grey).
 * - `variant="filled"` adds the tinted wash the Figma uses for "selected".
 * - `avatar` takes an element (usually `<Avatar>`), drawn before the label;
 *   the left padding tightens around it like MUI's.
 */
export interface ChipProps extends Omit<PressableProps, "children"> {
	label: string;
	color?: "default" | "primary";
	variant?: "outlined" | "filled";
	avatar?: ReactElement;
	className?: string;
}

const CHIP_CLASS = {
	primary: {
		outlined: "border-primary",
		filled: "border-primary bg-primary-tint",
	},
	default: {
		outlined: "border-input-outlined",
		filled: "border-input-outlined bg-muted",
	},
} as const;

export function Chip({
	label,
	color = "default",
	variant = "outlined",
	avatar,
	className,
	disabled,
	onPress,
	...props
}: ChipProps) {
	return (
		<Pressable
			accessibilityRole={onPress ? "button" : undefined}
			accessibilityState={{
				disabled: !!disabled,
				selected: variant === "filled",
			}}
			className={cn(
				"flex-row items-center gap-2 self-start rounded-full border pr-3",
				// MUI keeps the chip 32px tall: a 24px avatar plus 4px all round.
				avatar ? "py-1 pl-1" : "py-1.5 pl-3",
				onPress && "active:opacity-70",
				CHIP_CLASS[color][variant],
				disabled && "opacity-50",
				className,
			)}
			disabled={disabled}
			onPress={onPress}
			{...props}
		>
			{avatar}
			<Text className="text-body2 text-foreground" numberOfLines={1}>
				{label}
			</Text>
		</Pressable>
	);
}
