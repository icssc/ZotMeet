import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateMeetingForm } from "@/components/meetings/create-meeting-form";

/**
 * Route: `/` (the Meetings tab).
 *
 * Renders "[Meetings] Create Meeting (Specific Dates)" from the ZotMeet Hi-Fi
 * Wireframes. The form brings its own heading, so this screen only supplies
 * safe-area padding and scrolling — no `<Screen>` title block.
 */
export default function MeetingsScreen() {
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
