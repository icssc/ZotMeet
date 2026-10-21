/**
 * The type ramp — MUI's variants as the Figma text styles name them. Written
 * once, in px and unitless line heights (MUI's own units), and rendered two
 * ways below: `muiTypography()` for the web theme (`rem` sizes, unitless
 * line heights, exactly what `src/theme.ts` used to hard-code) and
 * `tailwindFontSize()` for the Expo app's NativeWind config (px sizes, px
 * line heights — React Native has no unitless line height).
 *
 * The two used to be maintained by hand on each side and only agreed by
 * inspection. Change a value here and both apps move together; the derived
 * numbers round to what each config had before, so wiring this up repainted
 * nothing.
 */

/** `size` and `letterSpacing` in px; `lineHeight` unitless (a ratio). */
const typeRamp = {
	/* MUI's h1 and h2 are weight 300; everything else uses 400-600. */
	h1: { size: 96, weight: 300, lineHeight: 1.167, letterSpacing: -1.5 },
	h2: { size: 60, weight: 300, lineHeight: 1.2, letterSpacing: -0.5 },
	h3: { size: 48, weight: 400, lineHeight: 1.167, letterSpacing: 0 },
	h4: { size: 34, weight: 400, lineHeight: 1.235, letterSpacing: 0.25 },
	h5: { size: 24, weight: 500, lineHeight: 1.334, letterSpacing: 0 },
	h6: { size: 20, weight: 600, lineHeight: 1.6, letterSpacing: 0.15 },
	subtitle1: { size: 16, weight: 500, lineHeight: 1.2, letterSpacing: 0.15 },
	subtitle2: { size: 14, weight: 500, lineHeight: 1.2, letterSpacing: 0.1 },
	body1: { size: 16, weight: 400, lineHeight: 1.2, letterSpacing: 0.15 },
	body2: { size: 14, weight: 400, lineHeight: 1.2, letterSpacing: 0.17 },
	caption: { size: 12, weight: 500, lineHeight: 1, letterSpacing: 0.4 },
	overline: { size: 12, weight: 500, lineHeight: 1, letterSpacing: 1 },
};

const px = (n) => `${n}px`;

/**
 * MUI `createTheme({ typography })` entries. Sizes are `rem` against MUI's
 * 16px html font size, which is what the theme always used.
 */
const muiTypography = () =>
	Object.fromEntries(
		Object.entries(typeRamp).map(([variant, t]) => [
			variant,
			{
				fontSize: `${t.size / 16}rem`,
				fontWeight: t.weight,
				lineHeight: t.lineHeight,
				letterSpacing: px(t.letterSpacing),
			},
		]),
	);

/**
 * Tailwind `theme.extend.fontSize` entries, one per variant, so a spec that
 * says "typography/body2" maps to `text-body2`. Line heights are resolved to
 * whole px because React Native requires an absolute value. Weight is not a
 * Tailwind font-size concern; the Expo app picks the weight's font *family*
 * per variant (see its `Typography` component).
 */
const tailwindFontSize = () =>
	Object.fromEntries(
		Object.entries(typeRamp).map(([variant, t]) => [
			variant,
			[
				px(t.size),
				{
					lineHeight: px(Math.round(t.size * t.lineHeight)),
					letterSpacing: px(t.letterSpacing),
				},
			],
		]),
	);

module.exports = { typeRamp, muiTypography, tailwindFontSize };
