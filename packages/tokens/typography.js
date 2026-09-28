const typeRamp = {
	/* MUI's h1 and h2 are weight 300; everything else uses 400-600. */
	h1: { size: 96, weight: 300, lineHeight: 1.167, letterSpacing: -1.5 },
	h2: { size: 60, weight: 300, lineHeight: 1.2, letterSpacing: -0.5 },
	h3: { size: 48, weight: 400, lineHeight: 1.167, letterSpacing: 0 },
	h4: { size: 34, weight: 400, lineHeight: 1.235, letterSpacing: 0.25 },
	h5: { size: 24, weight: 500, lineHeight: 1.334, letterSpacing: 0 },
	h6: { size: 20, weight: 600, lineHeight: 1.6, letterSpacing: 0.15 },
	titleLarge: { size: 22, weight: 400, lineHeight: 1.273, letterSpacing: 0 },
	subtitle1: { size: 16, weight: 500, lineHeight: 1.2, letterSpacing: 0.15 },
	subtitle2: { size: 14, weight: 500, lineHeight: 1.2, letterSpacing: 0.1 },
	body1: { size: 16, weight: 400, lineHeight: 1.2, letterSpacing: 0.15 },
	body2: { size: 14, weight: 400, lineHeight: 1.2, letterSpacing: 0.17 },
	caption: { size: 12, weight: 500, lineHeight: 1, letterSpacing: 0.4 },
	overline: { size: 12, weight: 500, lineHeight: 1, letterSpacing: 1 },
};

const px = (n) => `${n}px`;

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
