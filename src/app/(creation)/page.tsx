import { Creation } from "@/components/creation/creation";
import { getCurrentSession } from "@/lib/auth";
import {
	getMeetings,
	getResponderCountsByMeetingIds,
} from "@/server/data/meeting/queries";

export default async function Page() {
	const { user } = await getCurrentSession();
	const memberId = user?.memberId;
	const meetings = memberId ? await getMeetings(memberId) : [];
	const meetingIds = meetings.map((meeting) => meeting.id);
	const meetingCountsByMeetingId =
		await getResponderCountsByMeetingIds(meetingIds);

	return (
		<Creation
			user={user}
			meetings={meetings}
			meetingCounts={meetingCountsByMeetingId}
		/>
	);
}
