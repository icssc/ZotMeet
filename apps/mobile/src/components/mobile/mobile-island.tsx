import { Platform, type ViewProps } from "react-native";
import { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Animated } from "@/lib/animated";
import { cn } from "@/lib/utils";

/** How long the island takes to resize, and its contents to cross-fade. */
const ISLAND_TRANSITION_MS = 220;

const islandLayout = LinearTransition.duration(ISLAND_TRANSITION_MS);

/**
 * Reanimated animates an exiting element on the web by cloning its DOM node,
 * and positions the clone off the pill — so the outgoing set simply vanishes
 * there. Native keeps the view in place and fades it.
 */
const contentExiting =
	Platform.OS === "web"
		? undefined
		: FadeOut.duration(ISLAND_TRANSITION_MS / 2);

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
 *
 * The pill animates its own size when its contents change, so swapping one
 * action set for another (group actions ↔ paint modes) glides rather than
 * snaps. Wrap each set in `MobileIslandContent` with a distinct `key` to get
 * the matching cross-fade.
 */
export function MobileIsland({ className, style, ...props }: ViewProps) {
	const insets = useSafeAreaInsets();

	return (
		<Animated.View
			className={cn(
				"absolute flex-row items-center gap-2 self-center rounded-xl bg-paper p-2",
				className,
			)}
			layout={islandLayout}
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

/**
 * One set of island actions. Give each set its own `key` where they are
 * swapped, so the outgoing set fades out while the incoming one fades in
 * and the island resizes underneath them.
 */
export function MobileIslandContent({ className, ...props }: ViewProps) {
	return (
		<Animated.View
			className={cn("flex-row items-center gap-2", className)}
			entering={FadeIn.duration(ISLAND_TRANSITION_MS)}
			exiting={contentExiting}
			layout={islandLayout}
			{...props}
		/>
	);
}
