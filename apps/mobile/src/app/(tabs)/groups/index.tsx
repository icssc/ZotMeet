import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { ActivityIndicator, Image, View } from "react-native";
import { GroupsPage } from "@/components/groups/groups-page";
import { Button } from "@/components/ui/button";
import { Screen } from "@/components/ui/screen";
import { Typography } from "@/components/ui/typography";
import { useGroups } from "@/hooks/use-groups";
import { colorsFor } from "@/lib/theme";

/** Route: `/groups` — counterpart to the web app's `app/groups/page.tsx`. */
export default function GroupsScreen() {
	const router = useRouter();
	const { colorScheme } = useColorScheme();
	const state = useGroups();

	if (state.status === "ready") {
		return (
			<GroupsPage
				groups={state.groups}
				onRefresh={state.refresh}
				refreshing={state.refreshing}
			/>
		);
	}

	return (
		<Screen title="Groups">
			<View className="flex-1 items-center justify-center gap-3 pb-16">
				{state.status === "loading" ? (
					<ActivityIndicator
						accessibilityLabel="Loading groups"
						color={colorsFor(colorScheme).primary}
						size="large"
					/>
				) : (
					<>
						<Image
							source={require("@/assets/images/mascot.png")}
							accessibilityLabel="mascot"
							style={{ width: 111, height: 111 }}
							resizeMode="contain"
						/>
						<Typography
							variant="h6"
							color="textSecondary"
							align="center"
							className="max-w-xs pt-2 font-figtree-italic"
						>
							{state.status === "unauthorized"
								? "Sign in to see your groups."
								: state.error}
						</Typography>
						{state.status === "unauthorized" ? (
							<Button
								variant="contained"
								label="Sign In"
								onPress={() => router.push("/profile")}
							/>
						) : (
							<Button
								variant="outlined"
								label="Try Again"
								onPress={state.reload}
							/>
						)}
					</>
				)}
			</View>
		</Screen>
	);
}
