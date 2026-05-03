import "server-only";

import { and, desc, eq, ilike, inArray, ne, or } from "drizzle-orm";
import { db } from "@/db";
import { groups, members, notifications, users } from "@/db/schema";

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

function escapeLikeQuery(query: string): string {
	return query.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

export async function searchUsersByEmailOrUsername(
	query: string,
	excludeUserId: string,
	limit = 5,
) {
	if (!query || query.length < 2) return [];

	const escaped = escapeLikeQuery(query);

	return await db
		.select({
			id: users.id,
			email: users.email,
			username: members.username,
			profilePicture: members.profilePicture,
			displayName: members.displayName,
		})
		.from(users)
		.innerJoin(members, eq(users.memberId, members.id))
		.where(
			and(
				or(
					ilike(users.email, `%${escaped}%`),
					ilike(members.username, `%${escaped}%`),
				),
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

export async function createNewNotification(
	userIds: string[],
	title: string = "New Notification",
	message: string = "You have a new notification",
	type: string = "info",
	link: string,
	groupId?: string | null,
	createdBy?: string | null,
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
				groupId: groupId ?? null,
				createdBy: createdBy ?? null,
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
