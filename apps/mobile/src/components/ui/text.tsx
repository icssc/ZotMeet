import { Text as RNText, type TextProps } from "react-native";
import { cn } from "@/lib/utils";

/**
 * Base text. Defaults to Figtree Regular so every string in the app picks up
 * the web app's family; pass `font-figtree-medium` / `-semibold` / `-bold` to
 * change weight. React Native will not synthesise a weight out of a single
 * registered family, so the plain `font-medium` / `font-bold` utilities do
 * nothing here — the family utility is the weight.
 */
export function Text({
	className,
	inheritFont = false,
	inheritColor = false,
	...props
}: TextProps & {
	/**
	 * Skip the default family so the surrounding `<Text>`'s weight shows
	 * through. RN text nests and inherits, but only where nothing overrides it —
	 * setting `font-figtree` here is what would otherwise flatten an inherited
	 * weight back to Regular.
	 */
	inheritFont?: boolean;
	/** Same, for colour: skip `text-foreground` and take the parent's. */
	inheritColor?: boolean;
}) {
	return (
		<RNText
			className={cn(
				!inheritFont && "font-figtree",
				!inheritColor && "text-foreground",
				className,
			)}
			{...props}
		/>
	);
}
