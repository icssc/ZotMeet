import { cva, type VariantProps } from "class-variance-authority";
import type { TextProps } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

/**
 * Native counterpart to MUI's `<Typography>`, carrying the type ramp from the
 * web app's theme (`src/theme.ts`) — same variant names, same sizes, weights,
 * line heights and letter spacing, so a web snippet transfers verbatim.
 *
 * MUI's `component` prop has no counterpart here: it picks the HTML element
 * (`h1`, `p`, …), and React Native has only `<Text>`. Everything else — the
 * variant ramp, `color`, `align`, `gutterBottom`, `noWrap`, `paragraph` — is
 * the same API. Reach for `<Text>` directly only when you want the base
 * primitive with no type style attached.
 */
const typographyVariants = cva("", {
	variants: {
		/* Weights: MUI's 300/400/500/600 per variant, as family utilities. */
		variant: {
			h1: "font-figtree-light text-h1",
			h2: "font-figtree-light text-h2",
			h3: "font-figtree text-h3",
			h4: "font-figtree text-h4",
			h5: "font-figtree-medium text-h5",
			h6: "font-figtree-semibold text-h6",
			subtitle1: "font-figtree-medium text-subtitle1",
			subtitle2: "font-figtree-medium text-subtitle2",
			body1: "font-figtree text-body1",
			body2: "font-figtree text-body2",
			caption: "font-figtree-medium text-caption",
			/* MUI leaves `overline` uppercase; the theme only resizes it. */
			overline: "font-figtree-medium text-overline uppercase",
			/* `typography.button`, with the theme's `textTransform: none`. */
			button: "font-figtree-semibold text-button-md",
			/** Takes the surrounding size and weight, like MUI's `inherit`. */
			inherit: "",
		},
		align: {
			inherit: "",
			left: "text-left",
			center: "text-center",
			right: "text-right",
			justify: "text-justify",
		},
	},
	defaultVariants: { variant: "body1", align: "inherit" },
});

/**
 * MUI's palette paths, plus the legacy `textSecondary` spellings the web app
 * still uses in places, so both forms paste across unchanged.
 */
const colorClassNames = {
	"text.primary": "text-foreground",
	textPrimary: "text-foreground",
	"text.secondary": "text-muted-foreground",
	textSecondary: "text-muted-foreground",
	"text.disabled": "text-text-disabled",
	textDisabled: "text-text-disabled",
	primary: "text-primary",
	"primary.main": "text-primary",
	secondary: "text-secondary",
	"secondary.main": "text-secondary",
	error: "text-destructive",
	"error.main": "text-destructive",
	/** Keeps whatever colour is already in play — MUI's default. */
	inherit: "",
} as const;

type TypographyProps = TextProps &
	VariantProps<typeof typographyVariants> & {
		color?: keyof typeof colorClassNames;
		/** MUI's 0.35em bottom margin. RN has no `em`, so it is 6px at body size. */
		gutterBottom?: boolean;
		/** Truncates to a single line with an ellipsis. */
		noWrap?: boolean;
		/** MUI's paragraph spacing: 16px below. */
		paragraph?: boolean;
	};

export function Typography({
	className,
	variant,
	align,
	color,
	gutterBottom = false,
	noWrap = false,
	paragraph = false,
	numberOfLines,
	...props
}: TypographyProps) {
	return (
		<Text
			// `inherit` means "take the surrounding text's value", so the base
			// `Text` must not stamp its own default over it.
			inheritFont={variant === "inherit"}
			inheritColor={color === "inherit"}
			className={cn(
				typographyVariants({ variant, align }),
				color && colorClassNames[color],
				gutterBottom && "mb-1.5",
				paragraph && "mb-4",
				className,
			)}
			ellipsizeMode={noWrap ? "tail" : undefined}
			numberOfLines={noWrap ? 1 : numberOfLines}
			{...props}
		/>
	);
}

export { typographyVariants };
