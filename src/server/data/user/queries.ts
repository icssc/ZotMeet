import "server-only";

import { and, eq, ilike, inArray, ne } from "drizzle-orm";
import { db } from "@/db";
import { notifications, users } from "@/db/schema";

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
		})
		.from(users)
		.where(and(ilike(users.email, `%${query}%`), ne(users.id, excludeUserId)))
		.limit(limit);
}

export async function getNotificationsByMemberId(memberId: string) {
	const notification = await db.query.notifications.findMany({
		where: eq(notifications.memberId, memberId),
		orderBy: (notification) => notification.createdAt,
	});

	return notification;
}

export async function createNewNotification(
	userIds: string[],
	title: string = "New Notification",
	message: string = "You have a new notification",
	type: string = "info",
	link: string,
) {
	if (userIds.length === 0) return;

	const memberRows = await db
		.select({ memberId: users.memberId })
		.from(users)
		.where(inArray(users.id, userIds));

	return db
		.insert(notifications)
		.values(
			memberRows.map(({ memberId }) => ({
				memberId,
				title,
				message,
				type,
				redirect: link,
			})),
		)
		.returning();
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
