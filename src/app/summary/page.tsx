import { notFound, redirect } from "next/navigation";
import { Meetings } from "@/components/summary/meetings";
import { getCurrentSession } from "@/lib/auth";
import { buildScheduledLabel } from "@/lib/meetings/utils";
import {
	getAvailabilityMemberCountsByMeetingIds,
	getMeetings,
	getScheduledMeetingsByMeetingIds,
} from "@/server/data/meeting/queries";

export default async function Page() {
	const session = await getCurrentSession();
	if (!session?.user) {
		redirect("/auth/login/google");
	}

	const memberId = session.user.memberId;
	if (!memberId) {
		notFound();
	}

	const meetings = await getMeetings(memberId);
	const meetingIds = meetings.map((m) => m.id);
	const [meetingCounts, scheduledMeetingMap] = await Promise.all([
		getAvailabilityMemberCountsByMeetingIds(meetingIds),
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

	const startOfToday = new Date();
	startOfToday.setUTCHours(0, 0, 0, 0);
	const threeDaysLater = new Date(
		startOfToday.getTime() + 3 * 24 * 60 * 60 * 1000,
	);
	const upcomingMeetingIds = Object.entries(scheduledMeetingMap)
		.filter(
			([, sm]) =>
				sm.scheduledDate >= startOfToday && sm.scheduledDate <= threeDaysLater,
		)
		.map(([id]) => id);

	return (
		<div className="px-4 py-8 sm:px-8">
			<Meetings
				meetings={meetings}
				userId={memberId}
				meetingCounts={meetingCounts}
				scheduledLabels={scheduledLabels}
				scheduledDates={scheduledDates}
				upcomingMeetingIds={upcomingMeetingIds}
			/>
		</div>
	);
}
