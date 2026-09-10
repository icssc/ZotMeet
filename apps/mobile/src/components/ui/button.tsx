import { cva, type VariantProps } from "class-variance-authority";
import { Pressable, type PressableProps } from "react-native";
import { Raised } from "@/components/ui/raised";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

/**
 * Native counterpart to MUI's `<Button>`, styled by the web app's theme
 * (`src/theme.ts`). The prop vocabulary is MUI's, so a Figma spec or a snippet
 * from the web app transfers verbatim: `variant` is "contained" | "outlined" |
 * "text", `color` is a palette name, and `size` is "small" | "medium" |
 * "large" plus the theme's custom "square".
 *
 * `contained` and `outlined` both carry the theme's 4px ledge; `text` is flat.
 */
const buttonVariants = cva(
	// MUI's global 4px radius, and `textTransform: none` from the theme root.
	"flex-row items-center justify-center gap-2 rounded-control",
	{
		variants: {
			variant: {
				contained: "",
				outlined: "border bg-paper",
				text: "bg-transparent",
			},
			color: {
				primary: "",
				secondary: "",
				error: "",
				inherit: "",
			},
			size: {
				/* MUI's per-size padding; the height comes from the line box. */
				small: "px-[10px] py-1",
				medium: "px-4 py-1.5",
				large: "px-[22px] py-2",
				/* `theme.spacing(5)` square, from the theme's custom size. */
				square: "size-10 p-0",
			},
		},
		compoundVariants: [
			{ variant: "contained", color: "primary", className: "bg-primary" },
			{ variant: "contained", color: "secondary", className: "bg-secondary" },
			{ variant: "contained", color: "error", className: "bg-destructive" },
			{ variant: "contained", color: "inherit", className: "bg-muted" },
			// Outlined keeps the paper fill and takes its border from the palette,
			// except `secondary`, which the theme fills solid.
			{
				variant: "outlined",
				color: "primary",
				className: "border-input-outlined",
			},
			{
				variant: "outlined",
				color: "inherit",
				className: "border-input-outlined",
			},
			{
				variant: "outlined",
				color: "secondary",
				className: "border-secondary bg-secondary",
			},
			{ variant: "outlined", color: "error", className: "border-destructive" },
		],
		defaultVariants: { variant: "text", color: "primary", size: "medium" },
	},
);

/** `typography.button`: Figtree 600, sized off the MUI button type ramp. */
const buttonTextVariants = cva("font-figtree-semibold", {
	variants: {
		variant: { contained: "", outlined: "", text: "" },
		color: { primary: "", secondary: "", error: "", inherit: "" },
		size: {
			small: "text-button-sm",
			medium: "text-button-md",
			large: "text-button-lg",
			square: "text-button-md",
		},
	},
	compoundVariants: [
		{
			variant: "contained",
			color: "primary",
			className: "text-primary-foreground",
		},
		{
			variant: "contained",
			color: "secondary",
			className: "text-secondary-foreground",
		},
		{
			variant: "contained",
			color: "error",
			className: "text-destructive-foreground",
		},
		{ variant: "contained", color: "inherit", className: "text-foreground" },
		// The theme forces outlined labels to `text.primary`, whatever the colour,
		// apart from the two variants that carry their own fill or accent.
		{ variant: "outlined", color: "primary", className: "text-foreground" },
		{ variant: "outlined", color: "inherit", className: "text-foreground" },
		{
			variant: "outlined",
			color: "secondary",
			className: "text-secondary-foreground",
		},
		{ variant: "outlined", color: "error", className: "text-destructive" },
		{ variant: "text", color: "primary", className: "text-primary" },
		{ variant: "text", color: "secondary", className: "text-secondary" },
		{ variant: "text", color: "error", className: "text-destructive" },
		{ variant: "text", color: "inherit", className: "text-foreground" },
	],
	defaultVariants: { variant: "text", color: "primary", size: "medium" },
});

/** Ledge colour per colour, for the raised (contained / outlined) treatment. */
const ledgeClassNames: Record<string, string> = {
	primary: "bg-primary-ledge",
	secondary: "bg-elevation-3d",
	error: "bg-elevation-3d",
	inherit: "bg-elevation-3d",
};

type ButtonProps = PressableProps &
	VariantProps<typeof buttonVariants> & {
		/**
		 * Shorthand for the usual text child — RN needs every string wrapped in a
		 * `<Text>`, so this saves the wrapper. Pass `children` instead for an
		 * icon-only (`size="square"`) button.
		 */
		label?: string;
		children?: React.ReactNode;
	};

export function Button({
	className,
	variant = "text",
	color = "primary",
	size = "medium",
	label,
	children,
	disabled,
	...props
}: ButtonProps) {
	// RN throws on a bare string child, so a primitive `children` takes the same
	// `<Text>` path as `label` rather than reaching `Pressable` unwrapped.
	const text =
		label ??
		(typeof children === "string" || typeof children === "number"
			? children
			: null);

	const content =
		text === null ? (
			children
		) : (
			<Text className={buttonTextVariants({ variant, color, size })}>
				{text}
			</Text>
		);

	const face = buttonVariants({ variant, color, size });

	// Only `contained` and `outlined` get a ledge in the web theme; `text` sits
	// flat on the page and just dims on press.
	if (!variant || variant === "text") {
		return (
			<Pressable
				accessibilityRole="button"
				className={cn(
					face,
					"active:opacity-80",
					disabled && "opacity-50",
					className,
				)}
				disabled={disabled}
				{...props}
			>
				{content}
			</Pressable>
		);
	}

	return (
		<Raised
			accessibilityRole="button"
			className={face}
			// `className` styles the button as a whole, so it goes on the well, not
			// the face: a margin on the face would sit *inside* the ledge and show
			// up as a band of ledge colour on the wrong side of the button.
			containerClassName={cn(disabled && "opacity-50", className)}
			disabled={disabled}
			ledgeClassName={
				variant === "contained"
					? ledgeClassNames[color ?? "primary"]
					: "bg-elevation-3d"
			}
			radiusClassName="rounded-control"
			{...props}
		>
			{content}
		</Raised>
	);
}

export { buttonTextVariants, buttonVariants };
