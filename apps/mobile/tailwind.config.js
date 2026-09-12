/**
 * Mirrors the web app's `tailwind.config.ts` at the repo root so the same
 * utility names (bg-primary, text-muted-foreground, border-border, …) work in
 * React Native. Values come from `src/app/globals.css`, surfaced here as CSS
 * variables that NativeWind resolves at runtime for light/dark.
 *
 * The web's `backgroundImage` stripes are omitted; everything colour-,
 * radius- and type-related is 1:1.
 */

const { cssVarBlocks } = require("@zotmeet/tokens");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				paper: {
					DEFAULT: "hsl(var(--paper))",
					foreground: "hsl(var(--paper-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					1: "hsl(var(--chart-1))",
					2: "hsl(var(--chart-2))",
					3: "hsl(var(--chart-3))",
					4: "hsl(var(--chart-4))",
					5: "hsl(var(--chart-5))",
				},
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
				"text-disabled": "hsl(var(--text-disabled))",
				"action-active": "hsl(var(--action-active))",
				"input-outlined": "hsl(var(--input-outlined-border))",
				"input-standard": "hsl(var(--input-standard-border))",
				"elevation-3d": "hsl(var(--elevation-3d))",
				"primary-tint": "hsl(var(--primary-tint))",
				"primary-ledge": "hsl(var(--primary-ledge))",
				"action-hover": "hsl(var(--action-hover))",
				"secondary-main": {
					DEFAULT: "hsl(var(--secondary-main))",
					foreground: "hsl(var(--secondary-main-foreground))",
				},
				info: {
					DEFAULT: "hsl(var(--info))",
					foreground: "hsl(var(--info-foreground))",
				},
				warning: {
					DEFAULT: "hsl(var(--warning))",
					foreground: "hsl(var(--warning-foreground))",
				},
				gray: {
					light: "#F3F4F6" /* maps to gray-100 */,
					base: "#D1D5DB" /* gray-300 */,
					medium: "#9CA3AF" /* gray-400 */,
					dark: "#1F2937" /* gray-800 */,
				},
				slate: {
					base: "#CBD5E1" /* slate-300 */,
					medium: "#94A3B8" /* slate-400 */,
				},
			},
			/*
			 * MUI type ramp from the web app's `src/theme.ts`, named after the
			 * Figma text styles so a spec that says "typography/body2" maps to
			 * `text-body2`. Unitless MUI line heights are resolved to px here
			 * because React Native requires an absolute lineHeight.
			 */
			/*
			 * Mirrored in the `font-size` class group in `src/lib/utils.ts` —
			 * tailwind-merge cannot see this config, and a key it does not know
			 * is treated as a text *colour*. Add to both lists together.
			 */
			fontSize: {
				h1: ["96px", { lineHeight: "112px", letterSpacing: "-1.5px" }],
				h2: ["60px", { lineHeight: "72px", letterSpacing: "-0.5px" }],
				h3: ["48px", { lineHeight: "56px", letterSpacing: "0px" }],
				h4: ["34px", { lineHeight: "42px", letterSpacing: "0.25px" }],
				h5: ["24px", { lineHeight: "32px", letterSpacing: "0px" }],
				h6: ["20px", { lineHeight: "32px", letterSpacing: "0.15px" }],
				subtitle1: ["16px", { lineHeight: "19px", letterSpacing: "0.15px" }],
				subtitle2: ["14px", { lineHeight: "17px", letterSpacing: "0.1px" }],
				body1: ["16px", { lineHeight: "19px", letterSpacing: "0.15px" }],
				body2: ["14px", { lineHeight: "17px", letterSpacing: "0.17px" }],
				caption: ["12px", { lineHeight: "12px", letterSpacing: "0.4px" }],
				overline: ["12px", { lineHeight: "12px", letterSpacing: "1px" }],
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
				/* MUI's global 4px radius, used by fields, cards and buttons. */
				control: "4px",
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
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
