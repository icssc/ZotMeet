import * as DialogPrimitive from "@rn-primitives/dialog";
import { useEffect } from "react";
import { useWindowDimensions, View } from "react-native";
import {
	Gesture,
	GestureDetector,
	ScrollView,
} from "react-native-gesture-handler";
import {
	FadeIn,
	FadeOut,
	runOnJS,
	SlideInDown,
	SlideOutDown,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { SheetGrabber } from "@/components/ui/sheet-grabber";
import { Animated } from "@/lib/animated";
import { cn } from "@/lib/utils";

const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 800;

type DrawerProps = {
	open: boolean;
	onClose: () => void;
	className?: string;
	children: React.ReactNode;
};

export function Drawer({ open, onClose, className, children }: DrawerProps) {
	const translateY = useSharedValue(0);
	const { height } = useWindowDimensions();

	// Start each opening from rest, since the value is left wherever a swipe ended.
	useEffect(() => {
		if (open) translateY.value = 0;
	}, [open, translateY]);

	const pan = Gesture.Pan()
		.onUpdate((e) => {
			translateY.value = Math.max(0, e.translationY);
		})
		.onEnd((e) => {
			if (e.translationY > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY) {
				runOnJS(onClose)();
			} else {
				translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
			}
		});

	const sheetStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));

	return (
		<DialogPrimitive.Root
			open={open}
			onOpenChange={(next) => {
				if (!next) onClose();
			}}
		>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay className="absolute inset-0 z-50 justify-end">
					<Animated.View
						className="absolute inset-0 bg-black/60"
						entering={FadeIn.duration(200)}
						exiting={FadeOut.duration(150)}
						pointerEvents="none"
					/>
					<DialogPrimitive.Content asChild>
						<Animated.View
							className="w-full"
							entering={SlideInDown.duration(250)}
							exiting={SlideOutDown.duration(200)}
						>
							<Animated.View
								className={cn(
									"w-full rounded-t-xl border border-border bg-background px-4",
									className,
								)}
								style={sheetStyle}
							>
								<GestureDetector gesture={pan}>
									<View className="items-center pt-3 pb-2">
										<SheetGrabber />
									</View>
								</GestureDetector>

								<ScrollView
									bounces={false}
									contentContainerStyle={{ paddingBottom: 32, flexGrow: 1 }}
									keyboardShouldPersistTaps="handled"
									showsVerticalScrollIndicator={false}
									style={{ maxHeight: height * 0.8 }}
								>
									{children}
								</ScrollView>
							</Animated.View>
						</Animated.View>
					</DialogPrimitive.Content>
				</DialogPrimitive.Overlay>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}
