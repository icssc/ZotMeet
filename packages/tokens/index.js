/**
 * The one place a colour is written down.
 *
 * Both apps run Tailwind (NativeWind *is* Tailwind), so both `tailwind.config`
 * files import this module and emit these values as CSS variables at build
 * time — see `cssVarBlocks`. The two consumers that need a real colour rather
 * than a class, MUI's palette in `src/theme.ts` and React Native's raw-colour
 * props in `apps/mobile/src/lib/theme.ts`, import it too, through `hsl()`.
 *
 * Nothing is generated and there is no script to run: change a value here and
 * every consumer picks it up on the next build, because they all read this
 * file. Values are stored the way Tailwind wants them — bare HSL channels,
 * no `hsl()` wrapper — so a token can be composed as `hsl(var(--primary))`.
 */

/** Tokens shared with the web app. Keep the key order grouped by role. */
const light = {
	background: "0 0% 100%",
	foreground: "222.2 84% 4.9%",
	card: "0 0% 100%",
	"card-foreground": "222.2 84% 4.9%",
	popover: "0 0% 100%",
	"popover-foreground": "222.2 84% 4.9%",
	primary: "344.4 84.5% 67.1%",
	"primary-foreground": "0 0% 100%",
	paper: "0 0% 100%",
	"paper-foreground": "222.2 84% 4.9%",
	secondary: "210 40% 96.1%",
	"secondary-foreground": "222.2 47.4% 11.2%",
	muted: "210 40% 96.1%",
	"muted-foreground": "215.4 16.3% 46.9%",
	accent: "210 40% 96.1%",
	"accent-foreground": "222.2 47.4% 11.2%",
	destructive: "0 84.2% 60.2%",
	"destructive-foreground": "210 40% 98%",
	border: "214.3 31.8% 91.4%",
	input: "214.3 31.8% 91.4%",
	ring: "344.4 84.5% 67.1%",
	"chart-1": "12 76% 61%",
	"chart-2": "173 58% 39%",
	"chart-3": "197 37% 24%",
	"chart-4": "43 74% 66%",
	"chart-5": "27 87% 67%",
	"sidebar-background": "0 0% 98%",
	"sidebar-foreground": "240 5.3% 26.1%",
	"sidebar-primary": "240 5.9% 10%",
	"sidebar-primary-foreground": "0 0% 98%",
	"sidebar-accent": "240 4.8% 95.9%",
	"sidebar-accent-foreground": "240 5.9% 10%",
	"sidebar-border": "220 13% 91%",
	"sidebar-ring": "217.2 91.2% 59.8%",

	/*
	 * MUI surface tokens, used by the Figma hi-fi wireframes. The web app gets
	 * these from `src/theme.ts` as translucent inks (rgba(0,0,0,0.38) and
	 * friends); React Native has no cascade to blend against, so they are stored
	 * pre-composited on the mode's own background, like every token here.
	 */
	"text-disabled": "0 0% 62%" /* rgba(0,0,0,0.38) on white */,
	"action-active": "0 0% 46%" /* rgba(0,0,0,0.54) on white */,
	"input-outlined-border": "0 0% 77%" /* rgba(0,0,0,0.23) on white */,
	"input-standard-border": "0 0% 58%" /* rgba(0,0,0,0.42) on white */,
	"elevation-3d": "0 0% 75%" /* rgba(0,0,0,0.25) on white */,
	"primary-tint": "340 100% 97%" /* rgba(255,135,166,0.1) on white */,
	"primary-ledge": "344.6 55.3% 57.1%" /* rgba(0,0,0,0.15) over primary */,
};

const dark = {
	background: "222.2 84% 4.9%",
	foreground: "210 40% 98%",
	card: "222.2 84% 4.9%",
	"card-foreground": "210 40% 98%",
	popover: "222.2 84% 4.9%",
	"popover-foreground": "210 40% 98%",
	primary: "344.4 84.5% 67.1%",
	"primary-foreground": "0 0% 100%",
	paper: "0 1% 16%",
	"paper-foreground": "210 40% 98%",
	secondary: "217.2 32.6% 17.5%",
	"secondary-foreground": "210 40% 98%",
	muted: "217.2 32.6% 17.5%",
	"muted-foreground": "215 20.2% 65.1%",
	accent: "217.2 32.6% 17.5%",
	"accent-foreground": "210 40% 98%",
	destructive: "0 62.8% 30.6%",
	"destructive-foreground": "210 40% 98%",
	border: "217.2 32.6% 17.5%",
	input: "217.2 32.6% 17.5%",
	ring: "344.4 84.5% 67.1%",
	"chart-1": "220 70% 50%",
	"chart-2": "160 60% 45%",
	"chart-3": "30 80% 55%",
	"chart-4": "280 65% 60%",
	"chart-5": "340 75% 55%",
	"sidebar-background": "240 5.9% 10%",
	"sidebar-foreground": "240 4.8% 95.9%",
	"sidebar-primary": "224.3 76.3% 48%",
	"sidebar-primary-foreground": "0 0% 100%",
	"sidebar-accent": "240 3.7% 15.9%",
	"sidebar-accent-foreground": "240 4.8% 95.9%",
	"sidebar-border": "240 3.7% 15.9%",
	"sidebar-ring": "217.2 91.2% 59.8%",

	"text-disabled": "0 0% 42%",
	"action-active": "0 0% 62%",
	"input-outlined-border": "0 0% 30%",
	"input-standard-border": "0 0% 38%",
	"elevation-3d": "0 0% 0%",
	"primary-tint": "344 30% 18%",
	"primary-ledge": "344.6 55.3% 57.1%",
};

/** `{ primary: "344.4 …" }` → `{ "--primary": "344.4 …" }`. */
const toCssVars = (tokens) =>
	Object.fromEntries(
		Object.entries(tokens).map(([name, value]) => [`--${name}`, value]),
	);

/**
 * The `:root` / dark blocks for a Tailwind `addBase` call. The dark selector
 * differs by platform — `.dark` on the web, `.dark:root` under NativeWind — so
 * the caller passes its own.
 */
const cssVarBlocks = (darkSelector) => ({
	":root": toCssVars(light),
	[darkSelector]: toCssVars(dark),
});

/**
 * A token as a colour string, for the consumers that cannot use a class:
 * MUI's palette and React Native props like `placeholderTextColor`.
 * `hsl("primary")` → `"hsl(344.4, 84.5%, 67.1%)"`.
 */
const hsl = (name, mode = "light") => {
	const value = (mode === "dark" ? dark : light)[name];
	if (!value) {
		throw new Error(`Unknown colour token: ${name}`);
	}
	return `hsl(${value.split(" ").join(", ")})`;
};

module.exports = { light, dark, cssVarBlocks, hsl };
