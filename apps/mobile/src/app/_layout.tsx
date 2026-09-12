import {
	Figtree_300Light,
	Figtree_400Regular,
	Figtree_400Regular_Italic,
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
import { materialIconsFont } from "@/lib/icons";
import { useAuthStore } from "@/store/useAuthStore";
import "../global.css";

// Holds the splash screen until Figtree and the icon font are ready and the
// stored session has been checked, so the tab bar never flashes "Sign In" at
// someone who is signed in.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const { colorScheme } = useColorScheme();
	const authStatus = useAuthStore((state) => state.status);
	const hydrateAuth = useAuthStore((state) => state.hydrate);

	const [fontsLoaded, fontError] = useFonts({
		Figtree_300Light,
		Figtree_400Regular,
		Figtree_400Regular_Italic,
		Figtree_500Medium,
		Figtree_600SemiBold,
		Figtree_700Bold,
		...materialIconsFont,
	});

	useEffect(() => {
		hydrateAuth();
	}, [hydrateAuth]);

	const ready = (fontsLoaded || fontError) && authStatus !== "loading";

	useEffect(() => {
		if (ready) {
			SplashScreen.hideAsync();
		}
	}, [ready]);

	if (!ready) {
		return null;
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="(tabs)" />
					{/* Pushed over the tabs once a meeting exists, hiding the tab bar. */}
					<Stack.Screen name="availability/[slug]" />
					{/*
					 * Create Meeting sits outside the tabs so it can be presented,
					 * not navigated to: it slides up over whatever screen opened it
					 * and is dismissed by dragging the card back down.
					 *
					 * Not `formSheet`, which would give us iOS's own grabber: its
					 * content sizing is unreliable here — the sheet lays out at zero
					 * height and renders blank — so the card presentation stays and
					 * `<SheetGrabber>` draws the handle on both platforms.
					 */}
					<Stack.Screen
						name="create-meeting"
						options={{
							presentation: "modal",
							animation: "slide_from_bottom",
						}}
					/>
				</Stack>
				<PortalHost />
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
