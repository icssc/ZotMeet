export type TokenName = keyof typeof import("./index.js").light;
export type Mode = "light" | "dark";

export declare const light: Record<string, string>;
export declare const dark: Record<string, string>;

/** Hex colours for store listings, manifests and splash screens. */
export declare const brand: {
	readonly accent: string;
	readonly background: string;
	readonly darkBackground: string;
};

/** CSS-variable blocks for a Tailwind `addBase` call. */
export declare function cssVarBlocks(
	darkSelector: string,
): Record<string, Record<string, string>>;

/** `hsl("primary")` → `"hsl(344.4, 84.5%, 67.1%)"`. */
export declare function hsl(name: string, mode?: Mode): string;
