import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { ActivityIndicator, View } from "react-native";
import { GroupMemberList } from "@/components/groups/group-member-list";
import { Button } from "@/components/ui/button";
import { Screen } from "@/components/ui/screen";
import { Typography } from "@/components/ui/typography";
import { useGroup } from "@/hooks/use-group";
import { colorsFor } from "@/lib/theme";

/** Route: `/groups/[id]` — counterpart to the web app's `app/groups/[id]/page.tsx`. */
export default function GroupDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const { colorScheme } = useColorScheme();
	const state = useGroup(id);

	if (state.status === "ready") {
		return (
			<GroupMemberList
				detail={state}
				onRefresh={state.refresh}
				refreshing={state.refreshing}
			/>
		);
	}

	return (
		<Screen title="Group">
			<View className="flex-1 items-center justify-center gap-3 pb-16">
				{state.status === "loading" ? (
					<ActivityIndicator
						accessibilityLabel="Loading group"
						color={colorsFor(colorScheme).primary}
						size="large"
					/>
				) : (
					<>
						<Typography
							variant="h6"
							color="textSecondary"
							align="center"
							className="max-w-xs font-figtree-italic"
						>
							{state.status === "unauthorized"
								? "Sign in to see this group."
								: state.error}
						</Typography>
						{state.status === "unauthorized" ? (
							<Button
								variant="contained"
								label="Sign In"
								onPress={() => router.push("/profile")}
							/>
						) : state.status === "not-found" ? (
							<Button
								variant="outlined"
								label="Back to Groups"
								onPress={() => router.replace("/groups")}
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
