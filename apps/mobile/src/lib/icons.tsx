import {
	MaterialIcons,
	type MaterialIconsIconName,
} from "@react-native-vector-icons/material-icons";
import { cssInterop } from "nativewind";
import type { ComponentProps } from "react";
import { Platform } from "react-native";
import { cn } from "@/lib/utils";

/**
 * The Material Icons font, themed. `<Icon name="more-vert" />` is the same
 * glyph the web app draws with `@mui/icons-material/MoreVert` — names are
 * MUI's, kebab-cased — so a Figma spec or a web component ports 1:1 and
 * `name` autocompletes the whole set.
 *
 * The glyph is a `<Text>`, so it takes colour from `style` like any other
 * text. `cssInterop` routes `className` there, and an icon given neither a
 * class nor a `color` prop falls back to `text-foreground` (MUI's colour
 * inheritance, by hand) so it survives dark mode. Anything explicit wins:
 * `cn` drops the default for a `text-…` class, and a `color` prop (what the
 * tab bar hands its icons) suppresses it.
 */

export type IconName = MaterialIconsIconName;

type IconProps = ComponentProps<typeof MaterialIcons> & { className?: string };

cssInterop(MaterialIcons, { className: "style" });

export function Icon({ className, ...props }: IconProps) {
	return (
		<MaterialIcons
			className={cn(props.color === undefined && "text-foreground", className)}
			{...props}
		/>
	);
}

/**
 * Font registration for the root layout's `useFonts`, so the glyphs are in
 * memory before the splash screen lifts and no icon renders blank on first
 * paint. The package would otherwise lazy-load the file on an icon's first
 * render — fine, but a visible flash on cold start.
 *
 * The key must match the family the package looks the font up under, which
 * differs by platform: Android goes by the file's basename, everywhere else
 * by the PostScript name.
 */
export const materialIconsFont = {
	[Platform.select({
		android: "MaterialIcons",
		default: "MaterialIcons-Regular",
	})]: require("@react-native-vector-icons/material-icons/fonts/MaterialIcons.ttf"),
};
