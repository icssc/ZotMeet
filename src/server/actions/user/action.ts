"use server";

import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/lib/auth";
import {
	createNewNotification,
	deleteNotificationByID,
	getUserThemeModeFromDB,
	markNotificationAsRead,
	searchUsersByEmail,
	updateUserThemeMode,
} from "@/server/data/user/queries";
export async function searchUsers(query: string) {
	const { user } = await getCurrentSession();
	if (!user) return [];

	return searchUsersByEmail(query, user.id);
}

export async function readNotification(notificationId: string) {
	const { user } = await getCurrentSession();
	if (!user) return;
	await markNotificationAsRead(notificationId);
	revalidatePath("/", "layout");
}

export async function deleteNotification(notificationId: string) {
	const { user } = await getCurrentSession();
	if (!user) return;
	await deleteNotificationByID(notificationId);
	revalidatePath("/", "layout");
}

export async function saveThemePreference(
	themeMode: "light" | "dark" | "system",
) {
	const { user } = await getCurrentSession();
	if (!user) return;
	await updateUserThemeMode(user.id, themeMode);
	revalidatePath("/", "layout");
}

export async function getUserThemeMode() {
	const { user } = await getCurrentSession();
	if (!user) return "light";
	return await getUserThemeModeFromDB(user.id);
}

export async function sendNotificationsToUsers(
	userIds: string[],
	title: string = "New Notification",
	message: string = "You have a new notification",
	type: string = "info",
	link: string,
) {
	return await createNewNotification(userIds, title, message, type, link);
}
