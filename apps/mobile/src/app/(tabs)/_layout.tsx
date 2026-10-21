import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import { Icon } from "@/lib/icons";
import { colorsFor } from "@/lib/theme";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Mirrors the web bottom nav (`src/components/nav/mui-bottom-nav.tsx`), which
 * swaps its last item between Profile and Sign In on the session. Here the
 * third slot swaps too: Availability is a signed-in feature, so a visitor
 * sees the web's Rooms tab in its place.
 *
 * Expo Router wants every route declared regardless, so the slot that is not
 * in play is hidden with `href: null` rather than left out — the route still
 * resolves if something links to it.
 */
export default function TabsLayout() {
	const { colorScheme } = useColorScheme();
	const colors = colorsFor(colorScheme);
	const signedIn = useAuthStore((state) => state.user !== null);

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: colors.mutedForeground,
				tabBarStyle: {
					backgroundColor: colors.background,
					borderTopColor: colors.border,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Meetings",
					tabBarIcon: ({ color, size }) => (
						<Icon name="calendar-month" color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="groups"
				options={{
					title: "Groups",
					tabBarIcon: ({ color, size }) => (
						<Icon name="groups" color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="rooms"
				options={{
					href: signedIn ? null : undefined,
					title: "Rooms",
					tabBarIcon: ({ color, size }) => (
						<Icon name="apartment" color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="availability"
				options={{
					href: signedIn ? undefined : null,
					title: "Availability",
					tabBarIcon: ({ color, size }) => (
						<Icon name="date-range" color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={
					signedIn
						? {
								title: "Profile",
								tabBarIcon: ({ color, size }) => (
									<Icon name="person" color={color} size={size} />
								),
							}
						: {
								title: "Sign In",
								tabBarIcon: ({ color, size }) => (
									<Icon name="login" color={color} size={size} />
								),
							}
				}
			/>
		</Tabs>
	);
}
