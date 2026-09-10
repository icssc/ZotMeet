import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AvailabilityActions } from "@/components/availability/availability-actions";
import { GroupAvailability } from "@/components/availability/group-availability";
import { AvailabilityHeader } from "@/components/availability/header/availability-header";
import type { AvailabilityDateHeader } from "@/components/availability/table/availability-table-header";
import { MobileIsland } from "@/components/mobile/mobile-island";

/**
 * Everything the screen shows. The web `Availability` takes the `SelectMeeting`
 * row and derives these itself; this is shaped so that, once the mobile app
 * has a backend, the same derivation can fill it in.
 */
export type MeetingSummary = {
	slug: string;
	title: string;
	/** "2/16-2/20" */
	dateRange: string;
	/** "9 AM - 5 PM" */
	timeRange: string;
	location: string;
	/** The dates currently on screen in the availability table. */
	currentPageAvailability: AvailabilityDateHeader[];
	startHour: number;
	endHour: number;
	attendees: { responded: number; total: number };
};

/**
 * Native counterpart to the web app's
 * `components/availability/availability.tsx` — "[Meetings] New Meeting" in the
 * ZotMeet Hi-Fi Wireframes, the screen a meeting lands on once created. Same
 * composition as the web's mobile layout: `AvailabilityHeader`, the outlined
 * Paper holding the table, and `AvailabilityActions` in the `MobileIsland`.
 *
 * Front end only: the actions and the copy / overflow buttons do nothing yet.
 */
export function Availability({ meetingData }: { meetingData: MeetingSummary }) {
	const insets = useSafeAreaInsets();

	return (
		<View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
			<ScrollView
				className="flex-1"
				// Room for the island to sit over empty space rather than the last
				// hour of the table.
				contentContainerClassName="px-3 pt-3 pb-[100px]"
				showsVerticalScrollIndicator={false}
			>
				<AvailabilityHeader
					dateRange={meetingData.dateRange}
					location={meetingData.location}
					timeRange={meetingData.timeRange}
					title={meetingData.title}
				/>

				{/* MUI `<Paper variant="outlined">`, the "calendar with controls" frame. */}
				<View className="w-full rounded-lg border border-border bg-paper px-3 pt-3 pb-5">
					<GroupAvailability
						currentPageAvailability={meetingData.currentPageAvailability}
						endHour={meetingData.endHour}
						startHour={meetingData.startHour}
					/>
				</View>
			</ScrollView>

			<MobileIsland>
				<AvailabilityActions attendees={meetingData.attendees} />
			</MobileIsland>
		</View>
	);
}
