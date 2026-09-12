import { useRouter } from "expo-router";
import { Image, View } from "react-native";
import { IconButton } from "@/components/ui/icon-button";
import { Screen } from "@/components/ui/screen";
import { Icon } from "@/lib/icons";
import { Typography } from "../ui/typography";

export function MeetingsHome() {
	const router = useRouter();

	return (
		<Screen title="Meetings">
			<View className="ml-auto flex-row gap-4">
				<IconButton
					variant="outlined"
					size={"medium"}
					//  onPress={}
					accessibilityLabel="Notifications"
				>
					<Icon name="notifications-none" />
				</IconButton>

				<IconButton
					variant="contained"
					size={"medium"}
					onPress={() => router.push("/create-meeting")}
					accessibilityLabel="Create meeting"
				>
					<Icon name="add" size={20} />
				</IconButton>
			</View>

			<View className="flex-1 items-center justify-center gap-3 pb-16">
				<Image
					source={require("@/assets/images/mascot.png")}
					accessibilityLabel="mascot"
					style={{ width: 111, height: 111 }}
					resizeMode="contain"
				/>

				<View className="max-w-xs items-center">
					<Typography
						align="center"
						color="textSecondary"
						className="font-figtree-italic"
					>
						Create your first meeting to start {"\n"} collaborating with your
						team.{" "}
					</Typography>
				</View>
			</View>
		</Screen>
	);
}
