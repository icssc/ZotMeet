import { notFound, redirect } from "next/navigation";
import { Meetings } from "@/components/summary/meetings";
import { getCurrentSession } from "@/lib/auth";
import {
	getMeetings,
	getResponderCountsByMeetingIds,
	getScheduledMeetingsByMeetingIds,
} from "@/server/data/meeting/queries";

const formatScheduledTime = (time: string): string => {
	const [hourStr = "0", minStr = "0"] = time.split(":");
	const hour = Number(hourStr);
	const min = Number(minStr);
	const ampm = hour >= 12 ? "PM" : "AM";
	const h = hour % 12 || 12;
	return min === 0
		? `${h}${ampm}`
		: `${h}:${String(min).padStart(2, "0")}${ampm}`;
};

const buildScheduledLabel = (
	scheduledDate: Date,
	fromTime: string,
	toTime: string,
): string => {
	const month = scheduledDate.getUTCMonth() + 1;
	const day = scheduledDate.getUTCDate();
	return `Scheduled: ${month}/${day}, ${formatScheduledTime(fromTime)}-${formatScheduledTime(toTime)}`;
};

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
		getResponderCountsByMeetingIds(meetingIds),
		getScheduledMeetingsByMeetingIds(
			meetings.filter((m) => m.scheduled).map((m) => m.id),
		),
	]);

	const scheduledLabels: Record<string, string> = {};
	for (const [id, sm] of Object.entries(scheduledMeetingMap)) {
		scheduledLabels[id] = buildScheduledLabel(
			sm.scheduledDate,
			sm.scheduledFromTime,
			sm.scheduledToTime,
		);
	}

	return (
		<div className="px-4 py-8 sm:px-8">
			<Meetings
				meetings={meetings}
				userId={memberId}
				meetingCounts={meetingCounts}
				scheduledLabels={scheduledLabels}
			/>
		</div>
	);
}
