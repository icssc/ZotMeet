"use server";

import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { availabilities, notifications, users } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { createInviteEmail } from "@/lib/email/templates";
import { getExistingMeeting } from "@/server/data/meeting/queries";
import { createNewNotification } from "@/server/data/user/queries";

const NUDGE_COOLDOWN_MS = 45 * 60 * 1000;
const buildMeetingAvailabilityPath = (meetingId: string) =>
	`/availability/${meetingId}`;

function nudgeRedirectFilter(meetingId: string) {
	const meetingPath = buildMeetingAvailabilityPath(meetingId);
	return sql`${notifications.redirect} LIKE ${`%${meetingPath}`}`;
}

export type NudgeState = {
	success: boolean;
	message: string;
	cooldownUntil?: string;
};

export async function nudgePendingMembers(
	meetingId: string,
): Promise<NudgeState> {
	const { user } = await getCurrentSession();
	if (!user) {
		return { success: false, message: "Not logged in." };
	}

	let meeting: Awaited<ReturnType<typeof getExistingMeeting>>;
	try {
		meeting = await getExistingMeeting(meetingId);
	} catch {
		return { success: false, message: "Meeting not found." };
	}

	if (meeting.hostId !== user.memberId) {
		return {
			success: false,
			message: "Only the meeting host can nudge members.",
		};
	}

	const meetingPath = buildMeetingAvailabilityPath(meetingId);

	const [lastNudge] = await db
		.select({ createdAt: notifications.createdAt })
		.from(notifications)
		.where(
			and(
				eq(notifications.type, "Nudge"),
				nudgeRedirectFilter(meetingId),
				eq(notifications.createdBy, user.id),
			),
		)
		.orderBy(sql`${notifications.createdAt} DESC`)
		.limit(1);

	if (lastNudge?.createdAt) {
		const elapsed = Date.now() - lastNudge.createdAt.getTime();
		if (elapsed < NUDGE_COOLDOWN_MS) {
			const cooldownUntil = new Date(
				lastNudge.createdAt.getTime() + NUDGE_COOLDOWN_MS,
			).toISOString();
			return {
				success: false,
				message: "Nudge is on cooldown.",
				cooldownUntil,
			};
		}
	}

	const pendingRows = await db
		.select({ memberId: availabilities.memberId })
		.from(availabilities)
		.where(
			and(
				eq(availabilities.meetingId, meetingId),
				sql`COALESCE(jsonb_array_length(${availabilities.meetingAvailabilities}), 0) = 0`,
				sql`COALESCE(jsonb_array_length(${availabilities.ifNeededAvailabilities}), 0) = 0`,
			),
		);

	if (pendingRows.length === 0) {
		return { success: false, message: "No pending responders to nudge." };
	}

	const pendingMemberIds = pendingRows.map((r) => r.memberId);

	const userRows = await db
		.select({ id: users.id, memberId: users.memberId })
		.from(users)
		.where(sql`${users.memberId} IN ${pendingMemberIds}`);

	const userIds = userRows.map((r) => r.id);
	if (userIds.length === 0) {
		return { success: false, message: "No registered users to nudge." };
	}

	try {
		await createNewNotification(
			userIds,
			meeting.title,
			`Reminder: Please add your availability for "${meeting.title}".`,
			"Nudge",
			meetingPath,
			null,
			user.id,
			{
				email: createInviteEmail({
					title: `Reminder: Add your availability for "${meeting.title}"`,
					message: `You haven't submitted your availability for "${meeting.title}" yet. Please add it so the group can find a time that works.`,
					url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${meetingPath}`,
				}),
			},
		);

		return { success: true, message: "Nudge sent!" };
	} catch (error) {
		console.error("Failed to send nudge:", error);
		return { success: false, message: "Failed to send nudge. Try again." };
	}
}

export async function getNudgeCooldown(
	meetingId: string,
): Promise<{ cooldownUntil: string | null }> {
	const { user } = await getCurrentSession();
	if (!user) return { cooldownUntil: null };

	const [lastNudge] = await db
		.select({ createdAt: notifications.createdAt })
		.from(notifications)
		.where(
			and(
				eq(notifications.type, "Nudge"),
				nudgeRedirectFilter(meetingId),
				eq(notifications.createdBy, user.id),
			),
		)
		.orderBy(sql`${notifications.createdAt} DESC`)
		.limit(1);

	if (lastNudge?.createdAt) {
		const elapsed = Date.now() - lastNudge.createdAt.getTime();
		if (elapsed < NUDGE_COOLDOWN_MS) {
			return {
				cooldownUntil: new Date(
					lastNudge.createdAt.getTime() + NUDGE_COOLDOWN_MS,
				).toISOString(),
			};
		}
	}

	return { cooldownUntil: null };
}
