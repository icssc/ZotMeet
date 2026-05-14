"use server";

import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/lib/auth";
import {
	deleteNotificationByID,
	getUserThemeModeFromDB,
	markNotificationAsRead,
	searchUsersByEmail,
	updateNotificationPreferences,
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

export async function saveNotificationPreferences(prefs: {
	meetingInvites: boolean;
	groupInvites: boolean;
	nudges: boolean;
}) {
	const { user } = await getCurrentSession();
	if (!user?.memberId) return { success: false };
	await updateNotificationPreferences(user.memberId, prefs);
	revalidatePath("/profile");
	return { success: true };
}

export async function getUserThemeMode() {
	const { user } = await getCurrentSession();
	if (!user) return "light";
	return await getUserThemeModeFromDB(user.id);
}
