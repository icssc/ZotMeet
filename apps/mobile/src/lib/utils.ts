import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Same helper (and same name) as the web app's `src/lib/utils.ts`. */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
