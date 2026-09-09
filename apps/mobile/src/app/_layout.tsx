import {
	Figtree_300Light,
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

// Holds splash screen until Figtree is ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const { colorScheme } = useColorScheme();

	const [fontsLoaded, fontError] = useFonts({
		Figtree_300Light,
		Figtree_400Regular,
		Figtree_500Medium,
		Figtree_600SemiBold,
		Figtree_700Bold,
	});

	useEffect(() => {
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
				<PortalHost />
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
