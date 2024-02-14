import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to generate dynamic class names for components.
 * Combines class names provided as arguments using clsx utility
 * Merges any Tailwind CSS class names using twMerge utility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
