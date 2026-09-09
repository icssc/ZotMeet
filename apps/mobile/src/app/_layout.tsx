import {
	Figtree_400Regular,
	Figtree_500Medium,
	Figtree_600SemiBold,
	Figtree_700Bold,
	useFonts,
} from "@expo-google-fonts/figtree";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

// Hold the splash screen until Figtree is ready, so no frame renders in the
// system font and then reflows.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const { colorScheme } = useColorScheme();

	// The same four weights the web app loads in `src/fonts.ts`.
	const [fontsLoaded, fontError] = useFonts({
		Figtree_400Regular,
		Figtree_500Medium,
		Figtree_600SemiBold,
		Figtree_700Bold,
	});

	useEffect(() => {
		// Reveal on error too — a missing font should not leave a blank app.
		if (fontsLoaded || fontError) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	if (!fontsLoaded && !fontError) {
		return null;
	}

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
