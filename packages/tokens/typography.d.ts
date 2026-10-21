export type TypeVariant =
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"
	| "subtitle1"
	| "subtitle2"
	| "body1"
	| "body2"
	| "caption"
	| "overline";

export interface TypeRampEntry {
	/** px */
	readonly size: number;
	readonly weight: 300 | 400 | 500 | 600 | 700;
	/** unitless ratio */
	readonly lineHeight: number;
	/** px */
	readonly letterSpacing: number;
}

export declare const typeRamp: Record<TypeVariant, TypeRampEntry>;

/** Structurally a `CSSProperties` subset, so it drops straight into MUI's `typography`. */
export type MuiTypographyEntry = {
	fontSize: string;
	fontWeight: number;
	lineHeight: number;
	letterSpacing: string;
};
/** `createTheme({ typography })` entries with `rem` sizes. */
export declare function muiTypography(): Record<
	TypeVariant,
	MuiTypographyEntry
>;

export type TailwindFontSizeEntry = [
	string,
	{ lineHeight: string; letterSpacing: string },
];
/** Tailwind `theme.extend.fontSize` entries with px sizes and line heights. */
export declare function tailwindFontSize(): Record<
	TypeVariant,
	TailwindFontSizeEntry
>;
