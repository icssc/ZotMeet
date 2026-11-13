/** Tailwind colour scale entry: a string or a nested object of them. */
export type ColorScale = string | { [key: string]: string };

/** Colours both apps expose as classes (`bg-primary`, `text-muted-foreground`, …). */
export declare const colors: Record<string, ColorScale>;
/** Pre-composited MUI inks; Expo config only. */
export declare const nativeInkColors: Record<string, string>;
/** `--radius`-based scale used by both apps. */
export declare const borderRadius: Record<string, string>;
