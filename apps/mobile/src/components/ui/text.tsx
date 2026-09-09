import { Text as RNText, type TextProps } from "react-native";
import { cn } from "@/lib/utils";

/**
 * Base text. Defaults to Figtree Regular so every string in the app picks up
 * the web app's family; pass `font-figtree-medium` / `-semibold` / `-bold` to
 * change weight. React Native will not synthesise a weight out of a single
 * registered family, so the plain `font-medium` / `font-bold` utilities do
 * nothing here — the family utility is the weight.
 */
export function Text({ className, ...props }: TextProps) {
	return (
		<RNText
			className={cn("font-figtree text-foreground", className)}
			{...props}
		/>
	);
}
