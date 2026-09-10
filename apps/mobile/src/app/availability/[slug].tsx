import { useLocalSearchParams } from "expo-router";
import {
	Availability,
	type MeetingSummary,
} from "@/components/availability/availability";

/**
 * Placeholder content until the create-meeting form is wired to the backend.
 * The values are the ones in the "[Meetings] New Meeting" wireframe.
 */
const PLACEHOLDER_MEETING: Omit<MeetingSummary, "slug"> = {
	title: "UI/UX Social",
	dateRange: "2/16-2/20",
	timeRange: "9 AM - 5 PM",
	location: "NAME OF PLACE",
	currentPageAvailability: [
		{ weekday: "THUR", date: "1/1" },
		{ weekday: "FRI", date: "1/2" },
	],
	startHour: 9,
	endHour: 23,
	attendees: { responded: 20, total: 25 },
};

/**
 * Route: `/availability/[slug]`, the same path as the web app's
 * `app/availability/[slug]/page.tsx`. Pushed on the root stack (no tab bar)
 * once a meeting has been created — see `CreateMeetingForm`.
 *
 * The web page loads the meeting for `slug` and hands it to `<Availability>`.
 * There is no backend behind the mobile app yet, so every slug shows the
 * wireframe's placeholder meeting; the segment is read so the wiring is in
 * place for when there is.
 */
export default function AvailabilityScreen() {
	const { slug } = useLocalSearchParams<{ slug: string }>();

	return <Availability meetingData={{ ...PLACEHOLDER_MEETING, slug }} />;
}
