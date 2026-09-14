import { cssInterop } from "nativewind";
import { Platform } from "react-native";
import Animated from "react-native-reanimated";

/**
 * Reanimated's components, made `className`-aware everywhere. Natively
 * NativeWind resolves `className` on any element at the JSX runtime, but on
 * the web it only does so for components registered with `cssInterop` — the
 * same reason `lib/icons.tsx` registers `MaterialIcons`. Import `Animated`
 * from here rather than from `react-native-reanimated` whenever a class is
 * put on an `Animated.*` element, or the Expo web preview drops the styles.
 *
 * Web only: registering natively as well wraps the component a second time,
 * and a `style` array holding a `useAnimatedStyle` result then loses its
 * plain entries (the curtain header lost its safe-area padding).
 */
if (Platform.OS === "web") {
	cssInterop(Animated.View, { className: "style" });
}

export { Animated };
