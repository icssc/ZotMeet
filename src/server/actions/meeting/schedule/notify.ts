"use server";

import { getCurrentSession } from "@/lib/auth";
import { createBrandedTransactionalEmail } from "@/lib/email/templates";
import { NOTIFICATION_TYPES } from "@/lib/notification/types";
import {
	getExistingMeeting,
	getMeetingResponderUserIds,
} from "@/server/data/meeting/queries";
import { createNewNotification } from "@/server/data/user/queries";

export async function notifyMeetingScheduled(
	meetingId: string,
): Promise<{ success: boolean }> {
	const { user } = await getCurrentSession();
	if (!user) return { success: false };

	let meeting: Awaited<ReturnType<typeof getExistingMeeting>>;
	try {
		meeting = await getExistingMeeting(meetingId);
	} catch {
		return { success: false };
	}

	if (meeting.hostId !== user.memberId) return { success: false };

	const responderUserIds = await getMeetingResponderUserIds(
		meetingId,
		meeting.hostId,
	);

	if (responderUserIds.length === 0) return { success: true };

	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
	const origin = baseUrl.replace(/\/$/, "");
	const meetingUrl = `${origin}/availability/${meetingId}`;
	const hostName = user.displayName?.trim() || "The meeting host";

	await createNewNotification(
		responderUserIds,
		meeting.title,
		`"${meeting.title}" has been scheduled. Click to view the details.`,
		NOTIFICATION_TYPES.MEETING_SCHEDULED,
		meetingUrl,
		null,
		user.id,
		{
			email: createBrandedTransactionalEmail({
				subject: `"${meeting.title}" has been scheduled on ZotMeet`,
				headline: `${hostName} has scheduled "${meeting.title}".`,
				bodyLines: [
					`Great news! ${hostName} has finalized the time for "${meeting.title}".`,
					`Open ZotMeet to view the scheduled time and add it to your calendar.`,
				],
				ctaLabel: "View Meeting",
				ctaUrl: meetingUrl,
				footerLearnMoreUrl: `${origin}/`,
				footerTopic: "meetings",
			}),
		},
	);

	return { success: true };
}
