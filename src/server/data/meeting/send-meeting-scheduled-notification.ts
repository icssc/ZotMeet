import "server-only";

import type { SelectMeeting } from "@/db/schema";
import { createBrandedTransactionalEmail } from "@/lib/email/templates";
import { NOTIFICATION_TYPES } from "@/lib/notification/types";
import { buildGoogleCalendarLink } from "@/server/data/meeting/google-calendar-link";
import { getMeetingParticipantUserIds } from "@/server/data/meeting/queries";
import { createNewNotification } from "@/server/data/user/queries";

/**
 * Notifies every meeting participant (except the host) that the meeting has
 * been scheduled or rescheduled. The email carries the host's optional `message` and an
 * "Add to Google Calendar" button. Caller must enforce auth (host only).
 */
export async function sendMeetingScheduledNotification({
	meeting,
	host,
	message,
	kind = "scheduled",
}: {
	meeting: Pick<
		SelectMeeting,
		"id" | "title" | "description" | "location" | "timezone" | "hostId"
	>;
	host: { id: string; displayName: string | null };
	message?: string;
	/** "rescheduled" when an already-scheduled meeting's time changed. */
	kind?: "scheduled" | "rescheduled";
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
	const verb = kind === "rescheduled" ? "rescheduled" : "scheduled";
	const calendarUrl = await buildGoogleCalendarLink(meeting).catch((error) => {
		console.error("failed to generate calendar link", error);
		return null;
	});

	await createNewNotification(
		participantUserIds,
		meeting.title,
		`"${meeting.title}" has been ${verb}. Click to view the details.`,
		NOTIFICATION_TYPES.MEETING_SCHEDULED,
		meetingUrl,
		null,
		host.id,
		{
			email: createBrandedTransactionalEmail({
				subject: `"${meeting.title}" has been ${verb} on ZotMeet`,
				headline: `${hostName} has ${verb} "${meeting.title}".`,
				bodyLines: [
					kind === "rescheduled"
						? `Heads up! ${hostName} has moved "${meeting.title}" to a new time.`
						: `Great news! ${hostName} has finalized the time for "${meeting.title}".`,
					`Open ZotMeet to view the scheduled time and add it to your calendar.`,
				],
				note: message
					? { label: `Message from ${hostName}`, text: message }
					: undefined,
				ctaLabel: "View Meeting",
				ctaUrl: meetingUrl,
				secondaryCta: calendarUrl
					? { label: "Add to Google Calendar", url: calendarUrl }
					: undefined,
				footerLearnMoreUrl: `${origin}/`,
				footerTopic: "meetings",
			}),
		},
	);
}
