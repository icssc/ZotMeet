import "server-only";

import { and, desc, eq, ilike, inArray, ne } from "drizzle-orm";
import { db } from "@/db";
import { groups, members, notifications, users } from "@/db/schema";
import { sendEmail } from "@/lib/email/send-email";

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

export async function searchUsersByEmail(
	query: string,
	excludeUserId: string,
	limit = 5,
) {
	if (!query || query.length < 2) return [];

	return await db
		.select({
			id: users.id,
			email: users.email,
			profilePicture: members.profilePicture,
		})
		.from(users)
		.innerJoin(members, eq(users.memberId, members.id))
		.where(and(ilike(users.email, `%${query}%`), ne(users.id, excludeUserId)))
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

	const notificationsCreated = await db
		.insert(notifications)
		.values(
			recipientRows.map(({ memberId }) => ({
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
			recipientRows.map((recipient) =>
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

export async function getUserThemeModeFromDB(userId: string) {
	const user = await db.query.users.findFirst({
		where: eq(users.id, userId),
		columns: {
			themeMode: true,
		},
	});

	return user?.themeMode ?? "light";
}
