/**
 * The `theme.extend` entries both Tailwind configs share — the `bg-primary`
 * → `hsl(var(--primary))` wiring for every token in `index.js`, plus the
 * radius scale. The web's `tailwind.config.ts` and the Expo app's
 * `tailwind.config.js` used to each carry a copy of this map; now they spread
 * these objects and add only what is theirs (the web's stripe gradient, the
 * app's NativeWind preset and per-weight font families).
 *
 * The variables themselves are emitted by `cssVarBlocks` in each config's
 * plugin, so a token added to `index.js` also needs a line here before a
 * class exists for it.
 */

/** Token pairs `x` / `x-foreground` → `{ DEFAULT, foreground }`. */
const pair = (name) => ({
	DEFAULT: `hsl(var(--${name}))`,
	foreground: `hsl(var(--${name}-foreground))`,
});

/** Colours both apps expose as classes. */
const colors = {
	background: "hsl(var(--background))",
	foreground: "hsl(var(--foreground))",
	card: pair("card"),
	popover: pair("popover"),
	primary: pair("primary"),
	paper: pair("paper"),
	secondary: pair("secondary"),
	// MUI's `palette.secondary`, which is a different colour from the shadcn
	// `secondary` surface above.
	"secondary-main": pair("secondary-main"),
	info: pair("info"),
	warning: pair("warning"),
	muted: pair("muted"),
	accent: pair("accent"),
	destructive: pair("destructive"),
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
};

/**
 * The pre-composited MUI inks — native-only, for the reason given next to
 * their definition in `index.js`. The Expo config spreads these after
 * `colors`; the web config must not.
 */
const nativeInkColors = {
	"text-disabled": "hsl(var(--text-disabled))",
	"action-active": "hsl(var(--action-active))",
	"input-outlined": "hsl(var(--input-outlined-border))",
	"input-standard": "hsl(var(--input-standard-border))",
	"elevation-3d": "hsl(var(--elevation-3d))",
	"primary-tint": "hsl(var(--primary-tint))",
	"primary-ledge": "hsl(var(--primary-ledge))",
	"action-hover": "hsl(var(--action-hover))",
};

/** `--radius` is set to `0.3rem` in each app's global stylesheet. */
const borderRadius = {
	lg: "var(--radius)",
	md: "calc(var(--radius) - 2px)",
	sm: "calc(var(--radius) - 4px)",
};

module.exports = { colors, nativeInkColors, borderRadius };
