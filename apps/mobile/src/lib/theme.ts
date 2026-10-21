import { hsl } from "@zotmeet/tokens";

/**
 * Some React Native props take a raw colour value rather than a className —
 * navigator tints, `placeholderTextColor`, `selectionColor`, the native date
 * picker's `textColor`. Those tokens are resolved here from the same
 * `packages/tokens` file the Tailwind configs read, so a literal can no longer
 * drift from the class of the same name.
 */
export const themeColors = {
	light: {
		primary: hsl("primary"),
		background: hsl("background"),
		foreground: hsl("foreground"),
		mutedForeground: hsl("muted-foreground"),
		border: hsl("border"),
		textDisabled: hsl("text-disabled"),
		destructive: hsl("destructive"),
	},
	dark: {
		primary: hsl("primary", "dark"),
		background: hsl("background", "dark"),
		foreground: hsl("foreground", "dark"),
		mutedForeground: hsl("muted-foreground", "dark"),
		border: hsl("border", "dark"),
		textDisabled: hsl("text-disabled", "dark"),
		destructive: hsl("destructive", "dark"),
	},
} as const;

export type ThemeColors = (typeof themeColors)["light"];

/** Resolves the palette for the active scheme. */
export function colorsFor(scheme: string | null | undefined): ThemeColors {
	return scheme === "dark" ? themeColors.dark : themeColors.light;
}
