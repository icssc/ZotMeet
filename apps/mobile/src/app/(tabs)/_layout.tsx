import { Tabs } from "expo-router";
import { CalendarDays, CalendarRange, User, Users } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { navColors } from "@/lib/theme";

/**
 * Loosely mirrors the web bottom nav (`src/components/nav/mui-bottom-nav.tsx`).
 * The web app also has a Rooms tab (/studyrooms); it is deliberately left out
 * of this first pass.
 */
export default function TabsLayout() {
	const { colorScheme } = useColorScheme();
	const colors = navColors[colorScheme === "dark" ? "dark" : "light"];

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
						<CalendarDays color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="groups"
				options={{
					title: "Groups",
					tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="availability"
				options={{
					title: "Availability",
					tabBarIcon: ({ color, size }) => (
						<CalendarRange color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
				}}
			/>
		</Tabs>
	);
}
