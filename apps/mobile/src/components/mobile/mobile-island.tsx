import { View, type ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";

/**
 * Native counterpart to the web app's `components/mobile/mobile-island.tsx`:
 * the raised pill ("floating control bar" in the wireframes) that hovers over
 * the bottom of a screen and holds a row of actions.
 *
 * It positions itself over the safe area, so drop it as the last child of a
 * screen and pad the scrolling content underneath by roughly its height.
 *
 * The web island is MUI `Paper elevation={3}`; the wireframe specifies M3's
 * "Elevation Light / 2", two stacked drop shadows, which `boxShadow` takes
 * verbatim.
 */
export function MobileIsland({ className, style, ...props }: ViewProps) {
	const insets = useSafeAreaInsets();

	return (
		<View
			className={cn(
				"absolute flex-row items-center gap-2 self-center rounded-xl bg-paper p-2",
				className,
			)}
			style={[
				{
					bottom: insets.bottom + 24,
					boxShadow:
						"0 1px 2px rgba(0, 0, 0, 0.3), 0 2px 6px 2px rgba(0, 0, 0, 0.15)",
				},
				style,
			]}
			{...props}
		/>
	);
}
