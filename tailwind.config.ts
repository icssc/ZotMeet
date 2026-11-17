import { cssVarBlocks } from "@zotmeet/tokens";
import { borderRadius, colors } from "@zotmeet/tokens/tailwind";
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			// The `hsl(var(--x))` wiring for every colour token, shared with the
			// Expo config. Source: `packages/tokens/tailwind.js`.
			colors,
			backgroundImage: {
				"stripes-primary":
					"repeating-linear-gradient(45deg, hsl(var(--primary)) 0 3px, transparent 3px 6px)",
			},
			borderRadius,
			fontFamily: {
				figtree: ["var(--font-figtree)"],
				default: ["var(--font-figtree)"],
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		// Writes the colour tokens out as CSS variables, so `globals.css` no
		// longer hand-maintains a copy of them. Source: `packages/tokens`.
		plugin(({ addBase }) => addBase(cssVarBlocks(".dark"))),
	],
};
export default config;
