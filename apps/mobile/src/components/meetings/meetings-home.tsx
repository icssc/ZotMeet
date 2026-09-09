import { useRouter } from "expo-router";
import { Bell, BellIcon } from "lucide-react-native";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Screen } from "@/components/ui/screen";
import { Plus } from "@/lib/icons";

export function MeetingsHome() {
	const router = useRouter();

	return (
		<Screen title="Meetings">
			<View>
				<View className="ml-auto">
					<View className="flex-row gap-4">
						<IconButton
							variant="outlined"
							size={"medium"}
							//  onPress={}
							accessibilityLabel="Create meeting"
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
				</View>

				<CardTitle>No meetings yet</CardTitle>
				<CardDescription>
					Create a meeting to collect availability and coordinate a time.
				</CardDescription>
			</View>
		</Screen>
	);
}
