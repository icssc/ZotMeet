import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

/**
 * The bar that floats over the bottom of the availability screens
 * ("floating control bar", Figma 211:12553 and 716:11447).
 *
 * The same component carries both states the wireframes annotate as switching
 * out: browsing offers attendees / add availability / schedule, and painting
 * swaps in the three response swatches. Only the elevation differs — see
 * `elevation` below.
 */
export type FloatingBarOption = {
	key: string;
	label: string;
	icon: ReactNode;
	/** Draws the pink outline that marks the active option. */
	selected?: boolean;
	onPress?: () => void;
};

/** Figma sizes the option 60.87 x 51.478; those are a 0.761 scale of 80 x 68. */
const OPTION_WIDTH = 61;
const OPTION_HEIGHT = 51;

function Option({ option }: { option: FloatingBarOption }) {
	return (
		<Pressable
			accessibilityLabel={option.label}
			accessibilityRole="button"
			accessibilityState={{ selected: !!option.selected }}
			className={cn(
				"items-center justify-center gap-1 rounded-control active:opacity-60",
				// The design fills the active option at 3% primary. `primary-tint`
				// is the project's pink-wash token at 10% — a shade stronger, but
				// both read as barely-there against white, and this keeps the
				// colour in the token set.
				option.selected && "border border-primary-outline bg-primary-tint",
			)}
			onPress={option.onPress}
			style={{ width: OPTION_WIDTH, height: OPTION_HEIGHT }}
		>
			{option.icon}
			<Text className="w-full text-center font-figtree text-[10px] text-foreground leading-3 tracking-[0.3px]">
				{option.label}
			</Text>
		</Pressable>
	);
}

/** MUI's vertical divider between the first option and the rest. */
function VerticalDivider() {
	return <View className="h-[30px] w-px bg-paper-outline" />;
}

export function FloatingActionBar({
	options,
	dividerAfter,
	elevation = "raised",
}: {
	options: FloatingBarOption[];
	/** Index to place the divider after. Both wireframes use the first option. */
	dividerAfter?: number;
	/**
	 * `raised` is the app's hard 3D ledge, the treatment the painting bar uses;
	 * `elevated` is M3's soft elevation-2, which the browsing bar uses instead.
	 */
	elevation?: "raised" | "elevated";
}) {
	const row = (
		<View className="flex-row items-center gap-2">
			{options.map((option, index) => (
				<View className="flex-row items-center gap-2" key={option.key}>
					<Option option={option} />
					{dividerAfter === index ? <VerticalDivider /> : null}
				</View>
			))}
		</View>
	);

	if (elevation === "elevated") {
		return (
			<View
				className="rounded-xl bg-paper p-2"
				style={{
					// M3 Elevation Light/2. RN takes one shadow, so this is the
					// larger of the design's two, plus the Android elevation.
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.15,
					shadowRadius: 6,
					elevation: 3,
				}}
			>
				{row}
			</View>
		);
	}

	// The ledge is a real view rather than a shadow, the same technique (and
	// the same 4px depth) as `@/components/ui/raised` — React Native cannot
	// draw the web's blur-less `0 4px 0` drop shadow.
	return (
		<View className="rounded-[8px] bg-elevation-3d pb-1">
			<View className="rounded-[8px] border border-paper-outline bg-paper p-2">
				{row}
			</View>
		</View>
	);
}
