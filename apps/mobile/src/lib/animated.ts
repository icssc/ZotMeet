import { cssInterop } from "nativewind";
import { Platform } from "react-native";
import Animated from "react-native-reanimated";

/**
 * Reanimated's `Animated`, with `Animated.View` made `className`-aware on
 * the web. Natively NativeWind resolves `className` on any element at the
 * JSX runtime, but on the web it only does so for components registered
 * with `cssInterop` — the same reason `lib/icons.tsx` registers
 * `MaterialIcons`. Import `Animated` from here rather than from
 * `react-native-reanimated` whenever a class is put on an `Animated.View`,
 * or the Expo web preview drops the styles.
 *
 * Only `Animated.View` is registered, as it is the only member given a
 * class so far. Before putting a class on `Animated.Text`, `.ScrollView`,
 * `.Image` or `.FlatList`, register it here the same way — the web drops
 * the class silently otherwise.
 *
 * Web only: registering natively as well wraps the component a second time,
 * and a `style` array holding a `useAnimatedStyle` result then loses its
 * plain entries (the curtain header lost its safe-area padding).
 */
if (Platform.OS === "web") {
	cssInterop(Animated.View, { className: "style" });
}

export { Animated };
