import { Dashboard } from "@/components/dashboard/dashboard";
import { Landing } from "@/components/landing/landing";
import { getCurrentSession } from "@/lib/auth";
import { getGroupNamesByIds } from "@/server/data/groups/queries";
import {
	getMeetings,
	getResponderCountsByMeetingIds,
	getScheduledMeetingsByMeetingIds,
} from "@/server/data/meeting/queries";

export default async function Page() {
	const { user } = await getCurrentSession();
	if (!user) return <Landing />;

	const meetings = await getMeetings(user.memberId);
	const groupIds = [
		...new Set(meetings.flatMap((m) => (m.group_id ? [m.group_id] : []))),
	];
	const [meetingCounts, scheduledMeetingMap, groupNames] = await Promise.all([
		getResponderCountsByMeetingIds(meetings.map((m) => m.id)),
		getScheduledMeetingsByMeetingIds(
			meetings.filter((m) => m.scheduled).map((m) => m.id),
		),
		getGroupNamesByIds(groupIds),
	]);

	return (
		<Dashboard
			user={user}
			meetings={meetings}
			meetingCounts={meetingCounts}
			scheduledMeetingMap={scheduledMeetingMap}
			groupNames={groupNames}
		/>
	);
}
