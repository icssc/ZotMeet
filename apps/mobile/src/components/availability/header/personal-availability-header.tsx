import { useEffect } from "react";
import { View } from "react-native";
import {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/text";
import { Animated } from "@/lib/animated";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface PersonalAvailabilityHeaderProps {
	onCancel: () => void;
	onSave: () => void;
	/**
	 * While a save is in flight. Disables both buttons: a cancel that lands
	 * mid-request would revert the grid the server is about to confirm.
	 */
	saving?: boolean;
	/** Replaces the hint line while a save has failed. */
	error?: string | null;
}

/**
 * Native counterpart to the web's `MobileAvailabilityHeader` / Figma
 * "Add Availability Edit Mode": a top curtain with Close, title + subtitle,
 * and a contained check to save. Slides down on mount per the wireframe note.
 */
export function PersonalAvailabilityHeader({
	onCancel,
	onSave,
	saving = false,
	error = null,
}: PersonalAvailabilityHeaderProps) {
	const insets = useSafeAreaInsets();
	const translateY = useSharedValue(-24);
	const opacity = useSharedValue(0);

	useEffect(() => {
		translateY.value = withTiming(0, { duration: 280 });
		opacity.value = withTiming(1, { duration: 280 });
	}, [opacity, translateY]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
		opacity: opacity.value,
	}));

	return (
		<Animated.View
			className="absolute top-0 right-0 left-0 z-20 border-border border-b bg-paper px-3 pb-5"
			style={[{ paddingTop: insets.top + 12 }, animatedStyle]}
		>
			<View className="w-full flex-row items-center gap-3">
				<IconButton
					accessibilityLabel="Cancel"
					color="inherit"
					disabled={saving}
					onPress={onCancel}
					size="medium"
					variant="outlined"
				>
					<Icon name="close" />
				</IconButton>

				<View className="min-w-0 flex-1 justify-center">
					<Text className="text-body1 leading-[1.2] tracking-[0.15px]">
						Add Availability
					</Text>
					<Text
						className={cn(
							"font-figtree-medium text-caption tracking-[0.4px]",
							error ? "text-destructive" : "text-muted-foreground",
						)}
					>
						{error ?? "Drag to add availability."}
					</Text>
				</View>

				<IconButton
					accessibilityLabel="Save"
					color="primary"
					disabled={saving}
					onPress={onSave}
					size="medium"
					variant="contained"
				>
					<Icon name="check" />
				</IconButton>
			</View>
		</Animated.View>
	);
}
