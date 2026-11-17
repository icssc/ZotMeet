import "server-only";

import type { SelectMeeting } from "@/db/schema";
import { createBrandedTransactionalEmail } from "@/lib/email/templates";
import { NOTIFICATION_TYPES } from "@/lib/notification/types";
import { getMeetingParticipantUserIds } from "@/server/data/meeting/queries";
import { createNewNotification } from "@/server/data/user/queries";

/**
 * Notifies every meeting participant (except the host) that the meeting has
 * been scheduled. Caller must enforce auth (host only).
 */
export async function sendMeetingScheduledNotification({
	meeting,
	host,
}: {
	meeting: SelectMeeting;
	host: { id: string; displayName: string | null };
}) {
	const participantUserIds = await getMeetingParticipantUserIds(
		meeting.id,
		meeting.hostId,
	);
	if (participantUserIds.length === 0) return;

	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
	const origin = baseUrl.replace(/\/$/, "");
	const meetingUrl = `${origin}/availability/${meeting.id}`;
	const hostName = host.displayName?.trim() || "The meeting host";

	await createNewNotification(
		participantUserIds,
		meeting.title,
		`"${meeting.title}" has been scheduled. Click to view the details.`,
		NOTIFICATION_TYPES.MEETING_SCHEDULED,
		meetingUrl,
		null,
		host.id,
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
}
