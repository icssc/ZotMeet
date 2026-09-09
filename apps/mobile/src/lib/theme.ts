/**
 * A few navigator options (tab bar tints, header colours) take raw colour
 * values rather than className strings, so those specific tokens are mirrored
 * here as literals. Values match `src/global.css` — if a token changes there,
 * change it here too.
 */
const hsl = (value: string) => `hsl(${value.split(" ").join(", ")})`;

export const navColors = {
	light: {
		primary: hsl("344.4 84.5% 67.1%"),
		background: hsl("0 0% 100%"),
		mutedForeground: hsl("215.4 16.3% 46.9%"),
		border: hsl("214.3 31.8% 91.4%"),
	},
	dark: {
		primary: hsl("344.4 84.5% 67.1%"),
		background: hsl("222.2 84% 4.9%"),
		mutedForeground: hsl("215 20.2% 65.1%"),
		border: hsl("217.2 32.6% 17.5%"),
	},
} as const;
