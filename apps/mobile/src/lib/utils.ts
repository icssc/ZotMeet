import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Same helper (and same name) as the web app's `src/lib/utils.ts`, taught
 * about the tokens added in `tailwind.config.js`. Without this, tailwind-merge
 * does not recognise `text-body2` or `rounded-control` as font-size / radius
 * utilities, so it would let them coexist with `text-sm` or `rounded-md`
 * instead of overriding them — and the loser is decided by stylesheet order.
 */
const twMerge = extendTailwindMerge({
	extend: {
		classGroups: {
			"font-size": [
				{
					text: [
						"h5",
						"subtitle1",
						"body1",
						"body2",
						"caption",
						"helper",
						"input",
						"button-md",
						"button-lg",
					],
				},
			],
			rounded: [{ rounded: ["control"] }],
		},
	},
});

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
