import { Dashboard } from "@/components/dashboard/dashboard";
import { Landing } from "@/components/landing/landing";
import { getCurrentSession } from "@/lib/auth";
import { getMeetingsOverview } from "@/server/data/meeting/queries";

export default async function Page() {
	const { user } = await getCurrentSession();
	if (!user) return <Landing />;

	const { meetings, meetingCounts, scheduledMeetingMap, groupNames } =
		await getMeetingsOverview(user.memberId);

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
