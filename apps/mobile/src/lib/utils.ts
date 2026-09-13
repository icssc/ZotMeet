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
			/*
			 * Every key of `fontSize` in `tailwind.config.js`. A size missing here is
			 * not inert — tailwind-merge falls back to reading `text-*` as a colour,
			 * so `<Typography variant="h1" color="primary">` would drop `text-h1` and
			 * silently render at body size. Add to both lists together.
			 */
			"font-size": [
				{
					text: [
						"h1",
						"h2",
						"h3",
						"h4",
						"h5",
						"h6",
						"subtitle1",
						"subtitle2",
						"body1",
						"body2",
						"caption",
						"overline",
						"helper",
						"field",
						"button-sm",
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
