import { useRouter } from "expo-router";
import { Bell } from "lucide-react-native";
import { Image, View } from "react-native";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Screen } from "@/components/ui/screen";
import { Plus } from "@/lib/icons";

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
					<Bell />
				</IconButton>

				<IconButton
					variant="contained"
					size={"medium"}
					onPress={() => router.push("/create-meeting")}
					accessibilityLabel="Create meeting"
				>
					<Plus size={20} />
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
					<CardDescription className="text-center">
						Create a meeting to collect availability and coordinate a time.
					</CardDescription>
				</View>
			</View>
		</Screen>
	);
}
