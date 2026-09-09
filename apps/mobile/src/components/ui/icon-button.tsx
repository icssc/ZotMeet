import { cva, type VariantProps } from "class-variance-authority";
import { cloneElement, isValidElement } from "react";
import { Pressable, type PressableProps } from "react-native";
import { cn } from "@/lib/utils";

/**
 * Native counterpart to MUI's `<IconButton>` (see the web app's theme in
 * `src/theme.ts`). A circular, transparent hit target around a single icon.
 *
 * The props are MUI's — `size` ("small" | "medium" | "large"), `color` (a
 * palette name, or "default" for `action.active`) and `edge` — so a spec or a
 * web snippet transfers verbatim. MUI's `IconButton` has no `variant`; the
 * fill and the border are what `<Button>`'s variants are for.
 */
const iconButtonVariants = cva(
	"items-center justify-center overflow-hidden rounded-full active:opacity-60",
	{
		variants: {
			/** MUI's padding per size: 5px, 8px, 12px. */
			size: {
				small: "p-[5px]",
				medium: "p-2",
				large: "p-3",
			},
			/**
			 * Pulls the button back over the container's padding so the *icon*, not
			 * the hit target, lines up with the edge — MUI's -12px (-3px at small).
			 */
			edge: {
				start: "",
				end: "",
				none: "",
			},
		},
		compoundVariants: [
			{ edge: "start", size: "small", className: "-ml-[3px]" },
			{ edge: "start", size: "medium", className: "-ml-3" },
			{ edge: "start", size: "large", className: "-ml-3" },
			{ edge: "end", size: "small", className: "-mr-[3px]" },
			{ edge: "end", size: "medium", className: "-mr-3" },
			{ edge: "end", size: "large", className: "-mr-3" },
		],
		defaultVariants: { size: "medium", edge: "none" },
	},
);

/**
 * MUI sizes the glyph off the root's `font-size` (18 / 24 / 28px) and colours
 * it by inheritance. RN has neither, so the icon child is handed the matching
 * props instead — anything it sets itself wins.
 */
const iconSizes = { small: 18, medium: 24, large: 28 } as const;

const iconColorClassNames = {
	default: "text-action-active",
	primary: "text-primary",
	secondary: "text-secondary",
	error: "text-destructive",
	/** MUI's `inherit`: leave the glyph whatever colour it already is. */
	inherit: "",
} as const;

type IconButtonProps = PressableProps &
	VariantProps<typeof iconButtonVariants> & {
		color?: keyof typeof iconColorClassNames;
		children: React.ReactNode;
	};

export function IconButton({
	className,
	size = "medium",
	edge = "none",
	color = "default",
	disabled,
	children,
	...props
}: IconButtonProps) {
	const icon = isValidElement<{ size?: number; className?: string }>(children)
		? cloneElement(children, {
				size: children.props.size ?? iconSizes[size ?? "medium"],
				className: cn(
					disabled ? "text-text-disabled" : iconColorClassNames[color],
					// The child's own colour wins, the way an explicit `color` on a
					// MUI icon overrides what it would have inherited.
					children.props.className,
				),
			})
		: children;

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityState={{ disabled: !!disabled }}
			className={cn(
				iconButtonVariants({ size, edge }),
				disabled && "opacity-50",
				className,
			)}
			disabled={disabled}
			{...props}
		>
			{icon}
		</Pressable>
	);
}

export { iconButtonVariants };
