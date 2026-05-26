import { notFound, redirect } from "next/navigation";
import { Meetings } from "@/components/summary/meetings";
import { getCurrentSession } from "@/lib/auth";
import {
	buildScheduledLabel,
	getUpcomingMeetingIds,
} from "@/lib/meetings/utils";
import {
	getMeetings,
	getResponderCountsByMeetingIds,
	getScheduledMeetingsByMeetingIds,
} from "@/server/data/meeting/queries";
import { getNotificationsByMemberId } from "@/server/data/user/queries";

export default async function Page() {
	const session = await getCurrentSession();
	if (!session?.user) {
		redirect("/auth/login");
	}

	const memberId = session.user.memberId;
	if (!memberId) {
		notFound();
	}

	const [meetings, notifications] = await Promise.all([
		getMeetings(memberId),
		getNotificationsByMemberId(memberId),
	]);
	const meetingIds = meetings.map((m) => m.id);
	const [meetingCounts, scheduledMeetingMap] = await Promise.all([
		getResponderCountsByMeetingIds(meetingIds),
		getScheduledMeetingsByMeetingIds(
			meetings.filter((m) => m.scheduled).map((m) => m.id),
		),
	]);

	const scheduledLabels: Record<string, string> = {};
	const scheduledDates: Record<string, number> = {};
	for (const [id, sm] of Object.entries(scheduledMeetingMap)) {
		scheduledLabels[id] = buildScheduledLabel(
			sm.scheduledDate,
			sm.scheduledFromTime,
			sm.scheduledToTime,
		);
		scheduledDates[id] = sm.scheduledDate.getTime();
	}

	const upcomingMeetingIds = getUpcomingMeetingIds(scheduledMeetingMap);

	return (
		<div className="px-4 py-8 sm:px-8">
			<Meetings
				meetings={meetings}
				memberId={memberId}
				meetingCounts={meetingCounts}
				scheduledLabels={scheduledLabels}
				scheduledDates={scheduledDates}
				upcomingMeetingIds={upcomingMeetingIds}
				notifications={notifications}
			/>
		</div>
	);
}
