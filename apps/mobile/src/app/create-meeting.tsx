import { Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateMeetingForm } from "@/components/meetings/create-meeting";

/**
 * Route: `/create-meeting`. Presented as a modal from the root stack, so it
 * slides up over whatever opened it — see `app/_layout.tsx`.
 *
 * Renders "[Meetings] Create Meeting (Specific Dates)" from the ZotMeet Hi-Fi
 * Wireframes. The form brings its own heading, so this screen only supplies
 * safe-area padding and scrolling.
 */
export default function CreateMeetingScreen() {
	const insets = useSafeAreaInsets();

	// iOS insets the modal card below the status bar already, so adding the top
	// inset there just opens a gap above the heading. Android's modal covers the
	// full screen and still needs it.
	const paddingTop = Platform.OS === "ios" ? 0 : insets.top;

	return (
		<View className="flex-1 bg-paper" style={{ paddingTop }}>
			<ScrollView
				className="flex-1"
				contentContainerClassName="grow"
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
			>
				<CreateMeetingForm />
			</ScrollView>
		</View>
	);
}
