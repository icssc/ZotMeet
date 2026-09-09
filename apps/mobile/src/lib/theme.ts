/**
 * Some React Native props take a raw colour value rather than a className —
 * navigator tints, `placeholderTextColor`, `selectionColor`, the native date
 * picker's `textColor`. Those tokens are mirrored here as literals.
 *
 * Values match `src/global.css`; if a token changes there, change it here too.
 */
const hsl = (value: string) => `hsl(${value.split(" ").join(", ")})`;

export const themeColors = {
	light: {
		primary: hsl("344.4 84.5% 67.1%"),
		background: hsl("0 0% 100%"),
		foreground: hsl("222.2 84% 4.9%"),
		mutedForeground: hsl("215.4 16.3% 46.9%"),
		border: hsl("214.3 31.8% 91.4%"),
		textDisabled: hsl("0 0% 62%"),
		destructive: hsl("0 84.2% 60.2%"),
	},
	dark: {
		primary: hsl("344.4 84.5% 67.1%"),
		background: hsl("222.2 84% 4.9%"),
		foreground: hsl("210 40% 98%"),
		mutedForeground: hsl("215 20.2% 65.1%"),
		border: hsl("217.2 32.6% 17.5%"),
		textDisabled: hsl("0 0% 42%"),
		destructive: hsl("0 62.8% 30.6%"),
	},
} as const;

export type ThemeColors = (typeof themeColors)["light"];

/** Resolves the palette for the active scheme. */
export function colorsFor(scheme: string | null | undefined): ThemeColors {
	return scheme === "dark" ? themeColors.dark : themeColors.light;
}
