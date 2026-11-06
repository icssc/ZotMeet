import { Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateGroupDialog } from "@/components/groups/create-group-dialog";

/** Route: `/create-group`, presented as a modal from the root stack like `/create-meeting`. */
export default function CreateGroupScreen() {
	const insets = useSafeAreaInsets();
	const paddingTop = Platform.OS === "ios" ? 0 : insets.top;

	return (
		<View className="flex-1 bg-paper" style={{ paddingTop }}>
			<ScrollView
				className="flex-1"
				contentContainerClassName="grow"
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
			>
				<CreateGroupDialog />
			</ScrollView>
		</View>
	);
}
