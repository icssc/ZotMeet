import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateMeetingForm } from "@/components/meetings/create-meeting";

/**
 * Route: `/create-meeting`.
 *
 * Renders "[Meetings] Create Meeting (Specific Dates)" from the ZotMeet Hi-Fi
 * Wireframes. The form brings its own heading, so this screen only supplies
 * safe-area padding and scrolling.
 */
export default function CreateMeetingScreen() {
	const insets = useSafeAreaInsets();

	return (
		<View className="flex-1 bg-paper" style={{ paddingTop: insets.top }}>
			<ScrollView
				contentContainerClassName="grow"
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
			>
				<CreateMeetingForm />
			</ScrollView>
		</View>
	);
}
