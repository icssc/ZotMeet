import { View } from "react-native";

/**
 * The pill at the top of a sheet that signals "drag me down to close".
 *
 * iOS draws its own on a `formSheet` screen, but that presentation lays its
 * content out at zero height here, so Create Meeting is a `modal` and this
 * stands in for the system grabber — same metrics Apple uses, 36×5 centred,
 * on both platforms.
 */
export function SheetGrabber() {
	return (
		<View
			accessibilityElementsHidden
			className="w-full items-center pt-1.5 pb-1"
			importantForAccessibility="no-hide-descendants"
		>
			<View className="h-[5px] w-9 rounded-full bg-action-active opacity-40" />
		</View>
	);
}
