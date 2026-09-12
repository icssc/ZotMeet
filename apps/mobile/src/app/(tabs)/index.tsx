import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { ActivityIndicator, Image, View } from "react-native";
import { Meetings } from "@/components/summary/meetings";
import { Button } from "@/components/ui/button";
import { Screen } from "@/components/ui/screen";
import { Typography } from "@/components/ui/typography";
import { useMeetings } from "@/hooks/use-meetings";
import { colorsFor } from "@/lib/theme";

/**
 * Route: `/` — the Meetings tab, the counterpart to the web app's
 * `app/summary/page.tsx`. The web page loads the member's meetings on the
 * server and redirects a visitor to `/auth/login`; here `useMeetings` fetches
 * them over the API, and a visitor is pointed at the Sign In tab instead —
 * this tab is the app's home, so it stays put rather than navigating away.
 */
export default function MeetingsScreen() {
	const router = useRouter();
	const { colorScheme } = useColorScheme();
	const state = useMeetings();

	if (state.status === "ready") {
		return (
			<Meetings
				meetings={state.meetings}
				memberId={state.memberId}
				onChanged={state.reload}
				onRefresh={state.refresh}
				refreshing={state.refreshing}
			/>
		);
	}

	return (
		<Screen title="Meetings">
			<View className="flex-1 items-center justify-center gap-3 pb-16">
				{state.status === "loading" ? (
					<ActivityIndicator
						accessibilityLabel="Loading meetings"
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
								? "Sign in to see your meetings."
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
