import { Dashboard } from "@/components/dashboard/dashboard";
import { Landing } from "@/components/landing/landing";
import { getCurrentSession } from "@/lib/auth";
import { getGroupNamesByIds } from "@/server/data/groups/queries";
import { getMeetingsOverview } from "@/server/data/meeting/queries";

export default async function Page() {
	const { user } = await getCurrentSession();
	if (!user) return <Landing />;

	const { meetings, meetingCounts, scheduledMeetingMap } =
		await getMeetingsOverview(user.memberId);
	const groupNames = await getGroupNamesByIds([
		...new Set(meetings.flatMap((m) => (m.group_id ? [m.group_id] : []))),
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
