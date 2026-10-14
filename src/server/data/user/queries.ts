import "server-only";

import { and, desc, eq, inArray, ne, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
	groups,
	members,
	notificationPreferences,
	notifications,
	users,
} from "@/db/schema";
import { sendEmail } from "@/lib/email/send-email";
import {
	getNotificationPrefKey,
	type NotificationPrefs,
	toNotificationPrefs,
} from "@/lib/notification/types";
import { toIlikeContainsPattern } from "@/lib/sql/like-pattern";

export async function getUserIdExists(id: string) {
	const user = await db.query.users.findFirst({
		where: eq(users.id, id),
	});

	return user !== undefined;
}

export async function getUserEmailExists(email: string) {
	const user = await db.query.users.findFirst({
		where: eq(users.email, email),
	});

	return user !== undefined;
}

export async function getUserById(id: string) {
	const user = await db.query.users.findFirst({
		where: eq(users.id, id),
		columns: {
			id: true,
			memberId: true,
			email: true,
		},
	});

	return user ?? null;
}

const userSearchSelect = {
	id: users.id,
	email: users.email,
	username: members.username,
	displayName: members.displayName,
	profilePicture: members.profilePicture,
} as const;

/** Single query across email, username, and display name. */
export async function searchUsersByQuery(
	query: string,
	excludeUserId: string,
	limit = 15,
) {
	const pattern = toIlikeContainsPattern(query);
	if (!pattern) return [];

	return await db
		.select(userSearchSelect)
		.from(users)
		.innerJoin(members, eq(users.memberId, members.id))
		.where(
			and(
				ne(users.id, excludeUserId),
				or(
					sql`${users.email} ILIKE ${pattern} ESCAPE '\\'`,
					sql`${members.username} ILIKE ${pattern} ESCAPE '\\'`,
					sql`${members.displayName} ILIKE ${pattern} ESCAPE '\\'`,
				),
			),
		)
		.limit(limit);
}

export async function searchUsersByUsername(
	query: string,
	excludeUserId: string,
	limit = 5,
) {
	const pattern = toIlikeContainsPattern(query);
	if (!pattern) return [];

	return await db
		.select({
			id: users.id,
			email: users.email,
			username: members.username,
			displayName: members.displayName,
			profilePicture: members.profilePicture,
		})
		.from(users)
		.innerJoin(members, eq(users.memberId, members.id))
		.where(
			and(
				sql`${members.username} ILIKE ${pattern} ESCAPE '\\'`,
				ne(users.id, excludeUserId),
			),
		)
		.limit(limit);
}

export async function searchUsersByDisplayName(
	query: string,
	excludeUserId: string,
	limit = 5,
) {
	const pattern = toIlikeContainsPattern(query);
	if (!pattern) return [];

	return await db
		.select({
			id: users.id,
			email: users.email,
			username: members.username,
			displayName: members.displayName,
			profilePicture: members.profilePicture,
		})
		.from(users)
		.innerJoin(members, eq(users.memberId, members.id))
		.where(
			and(
				sql`${members.displayName} ILIKE ${pattern} ESCAPE '\\'`,
				ne(users.id, excludeUserId),
			),
		)
		.limit(limit);
}
export async function searchUsersByEmail(
	query: string,
	excludeUserId: string,
	limit = 5,
) {
	const pattern = toIlikeContainsPattern(query);
	if (!pattern) return [];

	return await db
		.select({
			id: users.id,
			email: users.email,
			username: members.username,
			displayName: members.displayName,
			profilePicture: members.profilePicture,
		})
		.from(users)
		.innerJoin(members, eq(users.memberId, members.id))
		.where(
			and(
				sql`${users.email} ILIKE ${pattern} ESCAPE '\\'`,
				ne(users.id, excludeUserId),
			),
		)
		.limit(limit);
}

export async function getNotificationsByMemberId(memberId: string) {
	const notification = await db
		.select({
			id: notifications.id,
			createdAt: notifications.createdAt,
			memberId: notifications.memberId,
			createdBy: members.displayName,
			title: notifications.title,
			type: notifications.type,
			readAt: notifications.readAt,
			message: notifications.message,
			redirect: notifications.redirect,
			groupIcon: groups.icon,
			createdByAvatar: members.profilePicture,
		})
		.from(notifications)
		.leftJoin(groups, eq(notifications.groupId, groups.id))
		.leftJoin(users, eq(notifications.createdBy, users.id))
		.leftJoin(members, eq(users.memberId, members.id))
		.where(eq(notifications.memberId, memberId))
		.orderBy(desc(notifications.createdAt));

	return notification;
}

type NotificationEmail = {
	subject: string;
	text: string;
	html: string;
};

type CreateNotificationOptions = {
	email?: NotificationEmail;
};

export async function createNewNotification(
	userIds: string[],
	title: string = "New Notification",
	message: string = "You have a new notification",
	type: string = "info",
	link: string,
	groupId?: string | null,
	createdBy?: string | null,
	options?: CreateNotificationOptions,
) {
	if (userIds.length === 0) return;

	const recipientRows = await db
		.select({
			memberId: users.memberId,
			email: users.email,
		})
		.from(users)
		.where(inArray(users.id, userIds));

	const prefKey = getNotificationPrefKey(type);
	let allowedRecipients = recipientRows;

	if (prefKey) {
		const memberIds = recipientRows.map((r) => r.memberId);
		const prefs = await db
			.select({
				memberId: notificationPreferences.memberId,
				meetingInvites: notificationPreferences.meetingInvites,
				groupInvites: notificationPreferences.groupInvites,
				nudges: notificationPreferences.nudges,
				meetingScheduled: notificationPreferences.meetingScheduled,
			})
			.from(notificationPreferences)
			.where(inArray(notificationPreferences.memberId, memberIds));

		const disabledMemberIds = new Set(
			prefs.filter((p) => p[prefKey] === false).map((p) => p.memberId),
		);

		allowedRecipients = recipientRows.filter(
			(r) => !disabledMemberIds.has(r.memberId),
		);
	}

	if (allowedRecipients.length === 0) return;

	const notificationsCreated = await db
		.insert(notifications)
		.values(
			allowedRecipients.map(({ memberId }) => ({
				memberId,
				title,
				message,
				type,
				redirect: link,
				groupId: groupId ?? null,
				createdBy: createdBy ?? null,
			})),
		)
		.returning();

	if (options?.email) {
		const payload = options.email;
		const results = await Promise.allSettled(
			allowedRecipients.map((recipient) =>
				sendEmail({
					to: recipient.email,
					...payload,
				}),
			),
		);

		for (const result of results) {
			if (result.status === "rejected") {
				console.error("Failed to send notification email: ", result.reason);
			}
		}
	}

	return notificationsCreated;
}

export async function markNotificationAsRead(notificationId: string) {
	const updatedNotification = await db
		.update(notifications)
		.set({
			readAt: new Date(),
		})
		.where(eq(notifications.id, notificationId))
		.returning();

	return updatedNotification;
}

export async function deleteNotificationByID(notificationId: string) {
	await db.delete(notifications).where(eq(notifications.id, notificationId));
}

export async function updateUserThemeMode(
	userId: string,
	themeMode: "light" | "dark" | "system",
) {
	return await db
		.update(users)
		.set({ themeMode })
		.where(eq(users.id, userId))
		.returning();
}

export async function getNotificationPreferences(memberId: string) {
	const prefs = await db.query.notificationPreferences.findFirst({
		where: eq(notificationPreferences.memberId, memberId),
	});

	return toNotificationPrefs(prefs ?? undefined);
}

export async function updateNotificationPreferences(
	memberId: string,
	prefs: NotificationPrefs,
) {
	return await db
		.insert(notificationPreferences)
		.values({ memberId, ...prefs })
		.onConflictDoUpdate({
			target: notificationPreferences.memberId,
			set: prefs,
		})
		.returning();
}

export async function getUserThemeModeFromDB(userId: string) {
	const user = await db.query.users.findFirst({
		where: eq(users.id, userId),
		columns: {
			themeMode: true,
		},
	});

	return user?.themeMode ?? "light";
}
