import { Stack } from "expo-router";

/**
 * A nested Stack inside the Groups tab, so pushing a group detail screen keeps
 * the tab bar visible. This is the layout-nesting half of the routing demo.
 */
export default function GroupsLayout() {
	return <Stack screenOptions={{ headerShown: false }} />;
}
