import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

/**
 * Native counterpart to the web app's `FilterChip`: a flat toggle showing a
 * label and a count, filled with the MUI secondary navy when active and the
 * `action.hover` wash when not. The web sizes it up at `sm`; this is the
 * `xs` size, which is the only one a phone shows.
 */
export function FilterChip({
	label,
	count,
	active,
	onPress,
}: {
	label: string;
	count: number;
	active: boolean;
	onPress: () => void;
}) {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityState={{ selected: active }}
			className={cn(
				"rounded-control px-2 py-1.5 active:opacity-80",
				active ? "bg-secondary-main" : "bg-action-hover",
			)}
			onPress={onPress}
		>
			<Text
				className={cn(
					"font-figtree-semibold text-xs",
					active ? "text-secondary-main-foreground" : "text-foreground",
				)}
			>
				{label} {count}
			</Text>
		</Pressable>
	);
}
