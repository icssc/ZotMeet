/**
 * Mirrors the web app's `tailwind.config.ts` at the repo root so the same
 * utility names (bg-primary, text-muted-foreground, border-border, …) work in
 * React Native. Colours and the type ramp come from `packages/tokens`, the
 * same modules the web config and MUI theme read; NativeWind resolves the CSS
 * variables at runtime for light/dark.
 *
 * The web's `backgroundImage` stripes are omitted; everything colour-,
 * radius- and type-related is 1:1.
 */

const { cssVarBlocks } = require("@zotmeet/tokens");
const {
	borderRadius,
	colors,
	nativeInkColors,
} = require("@zotmeet/tokens/tailwind");
const { tailwindFontSize } = require("@zotmeet/tokens/typography");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			// The same `hsl(var(--x))` wiring the web config uses, plus the
			// pre-composited inks only React Native needs. Source:
			// `packages/tokens/tailwind.js`.
			colors: { ...colors, ...nativeInkColors },
			/*
			 * Named after the Figma text styles so a spec that says
			 * "typography/body2" maps to `text-body2`.
			 *
			 * Mirrored in the `font-size` class group in `src/lib/utils.ts` —
			 * tailwind-merge cannot see this config, and a key it does not know
			 * is treated as a text *colour*. Add to both lists together.
			 */
			fontSize: {
				// h1 … overline, from `packages/tokens/typography.js` — the same ramp
				// the web's MUI theme renders, in px here because React Native needs
				// an absolute line height.
				...tailwindFontSize(),
				helper: ["12px", { lineHeight: "20px", letterSpacing: "0.4px" }],
				/*
				 * Named `field`, not `input`: `input` is already a colour token
				 * (mirroring the web's `--input` border), and Tailwind emits both
				 * scales under the same `text-input` class — the colour plugin runs
				 * last, so `text-input` would silently paint text the border grey.
				 */
				field: ["16px", { letterSpacing: "0.15px" }],
				"button-sm": ["13px", { lineHeight: "22px", letterSpacing: "0.46px" }],
				"button-md": ["14px", { lineHeight: "24px", letterSpacing: "0.4px" }],
				"button-lg": ["16px", { lineHeight: "26px", letterSpacing: "0.46px" }],
			},
			/*
			 * Figtree, the same family the web app loads in `src/fonts.ts`.
			 *
			 * The web resolves weights through one `var(--font-figtree)` family
			 * because browsers pick a weight out of a family. React Native does
			 * not — each weight is registered as its own family — so `font-medium`
			 * and friends cannot work on their own here. Use the explicit family
			 * utilities below wherever the web would reach for a weight class.
			 */
			fontFamily: {
				/* MUI's h1 and h2 are weight 300; everything else uses 400-600. */
				"figtree-light": ["Figtree_300Light"],
				figtree: ["Figtree_400Regular"],
				/*
				 * RN will not slant a font for you: `italic` on its own leaves a
				 * custom family upright, so the italic face is its own family here,
				 * exactly like the weights above.
				 */
				"figtree-italic": ["Figtree_400Regular_Italic"],
				"figtree-medium": ["Figtree_500Medium"],
				"figtree-semibold": ["Figtree_600SemiBold"],
				"figtree-bold": ["Figtree_700Bold"],
				default: ["Figtree_400Regular"],
			},
			borderRadius: {
				...borderRadius,
				/* MUI's global 4px radius, used by fields, cards and buttons. */
				control: "4px",
			},
		},
	},
	plugins: [
		// Same tokens as the web app, emitted as CSS variables for NativeWind to
		// resolve at runtime. NativeWind's class-based dark mode keys off
		// `.dark:root` rather than the web's `.dark`. Source: `packages/tokens`.
		plugin(({ addBase }) => addBase(cssVarBlocks(".dark:root"))),
	],
};
