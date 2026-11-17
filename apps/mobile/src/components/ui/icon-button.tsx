import { cva, type VariantProps } from "class-variance-authority";
import { cloneElement, isValidElement } from "react";
import { Pressable, type PressableProps } from "react-native";
import { Raised } from "@/components/ui/raised";
import { cn } from "@/lib/utils";

/**
 * Native counterpart to MUI's `<IconButton>` (see the web app's theme in
 * `src/theme.ts`). A square control around a single icon.
 *
 * The props follow the app's MUI-shaped vocabulary — `variant`, `size`,
 * `color`, and `edge` — so a spec or a web snippet transfers cleanly.
 */
const iconButtonVariants = cva(
	"items-center justify-center overflow-hidden rounded-control",
	{
		variants: {
			variant: {
				contained: "",
				outlined: "border bg-paper",
				text: "bg-transparent",
			},
			color: {
				default: "",
				primary: "",
				secondary: "",
				error: "",
				inherit: "",
			},
			/** Square hit targets: 18/24/28px icon plus MUI's 5/8/12px padding. */
			size: {
				small: "size-7",
				medium: "size-10",
				large: "size-[52px]",
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
			{ variant: "contained", color: "default", className: "bg-action-active" },
			{ variant: "contained", color: "primary", className: "bg-primary" },
			{ variant: "contained", color: "secondary", className: "bg-secondary" },
			{ variant: "contained", color: "error", className: "bg-destructive" },
			{ variant: "contained", color: "inherit", className: "bg-muted" },
			{
				variant: "outlined",
				color: "default",
				className: "border-input-outlined",
			},
			{
				variant: "outlined",
				color: "primary",
				className: "border-input-outlined",
			},
			{
				variant: "outlined",
				color: "secondary",
				className: "border-secondary",
			},
			{ variant: "outlined", color: "error", className: "border-destructive" },
			{
				variant: "outlined",
				color: "inherit",
				className: "border-input-outlined",
			},
			{ edge: "start", size: "small", className: "-ml-[3px]" },
			{ edge: "start", size: "medium", className: "-ml-3" },
			{ edge: "start", size: "large", className: "-ml-3" },
			{ edge: "end", size: "small", className: "-mr-[3px]" },
			{ edge: "end", size: "medium", className: "-mr-3" },
			{ edge: "end", size: "large", className: "-mr-3" },
		],
		defaultVariants: {
			variant: "text",
			color: "default",
			size: "medium",
			edge: "none",
		},
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

const containedIconColorClassNames = {
	default: "text-primary-foreground",
	primary: "text-primary-foreground",
	secondary: "text-secondary-foreground",
	error: "text-destructive-foreground",
	inherit: "text-foreground",
} as const;

/** Ledge colour per colour, matching `Button` for raised variants. */
const ledgeClassNames = {
	default: "bg-primary-ledge",
	primary: "bg-primary-ledge",
	secondary: "bg-elevation-3d",
	error: "bg-elevation-3d",
	inherit: "bg-elevation-3d",
} as const;

type IconButtonProps = PressableProps &
	VariantProps<typeof iconButtonVariants> & {
		children: React.ReactNode;
	};

export function IconButton({
	className,
	variant = "text",
	size = "medium",
	edge = "none",
	color = "default",
	disabled,
	children,
	...props
}: IconButtonProps) {
	const resolvedColor =
		variant === "contained" && color === "default" ? "primary" : color;
	const iconColor =
		variant === "contained"
			? containedIconColorClassNames[resolvedColor ?? "default"]
			: iconColorClassNames[resolvedColor ?? "default"];

	const icon = isValidElement<{ size?: number; className?: string }>(children)
		? cloneElement(children, {
				size: children.props.size ?? iconSizes[size ?? "medium"],
				className: cn(
					disabled ? "text-text-disabled" : iconColor,
					// The child's own colour wins, the way an explicit `color` on a
					// MUI icon overrides what it would have inherited.
					children.props.className,
				),
			})
		: children;

	const face = iconButtonVariants({
		variant,
		color: resolvedColor,
		size,
		edge,
	});

	if (!variant || variant === "text") {
		return (
			<Pressable
				accessibilityRole="button"
				accessibilityState={{ disabled: !!disabled }}
				className={cn(
					face,
					"active:opacity-60",
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

	return (
		<Raised
			accessibilityRole="button"
			className={face}
			containerClassName={cn("self-start", disabled && "opacity-50", className)}
			disabled={disabled}
			ledgeClassName={
				variant === "contained"
					? ledgeClassNames[resolvedColor ?? "primary"]
					: "bg-elevation-3d"
			}
			radiusClassName="rounded-control"
			{...props}
		>
			{icon}
		</Raised>
	);
}

export { iconButtonVariants };
