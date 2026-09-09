import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
	const { colorScheme } = useColorScheme();

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="(tabs)" />
				</Stack>
				{/* rn-primitives renders overlays (Dialog, Select, …) through this host. */}
				<PortalHost />
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
