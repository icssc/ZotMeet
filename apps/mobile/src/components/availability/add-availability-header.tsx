import { Check, X } from "lucide-react-native";
import { Pressable, View } from "react-native";
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/text";

/**
 * The header that replaces the meeting chrome while you are painting
 * availability ("Add Availability Edit Mode", Figma 680:31937).
 *
 * The node is annotated "Component comes down like a curtain or like a hood",
 * so it enters and leaves along the top edge rather than fading — the panel is
 * absolutely positioned by its parent and covers the header underneath.
 */
export function AddAvailabilityHeader({
	onCancel,
	onConfirm,
}: {
	onCancel?: () => void;
	onConfirm?: () => void;
}) {
	const insets = useSafeAreaInsets();

	return (
		<Animated.View
			className="border-paper-outline border-b bg-paper px-3 pb-5"
			entering={SlideInUp}
			exiting={SlideOutUp}
			style={{ paddingTop: insets.top + 12 }}
		>
			<View className="w-full flex-row items-center gap-3">
				<IconButton accessibilityLabel="Cancel" onPress={onCancel}>
					<X className="text-foreground" size={24} />
				</IconButton>

				<View className="min-w-0 flex-1">
					<Text className="text-body1 leading-[19px] tracking-[0.15px]">
						Add Availability
					</Text>
					<Text className="font-figtree-medium text-caption text-text-secondary tracking-[0.4px]">
						Drag to add availability.
					</Text>
				</View>

				<Pressable
					accessibilityLabel="Save availability"
					accessibilityRole="button"
					className="items-center justify-center overflow-hidden rounded-control bg-primary p-2 active:opacity-60"
					onPress={onConfirm}
				>
					<Check className="text-primary-foreground" size={24} />
				</Pressable>
			</View>
		</Animated.View>
	);
}
