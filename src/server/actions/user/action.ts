"use server";

import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/lib/auth";
import {
	deleteNotificationByID,
	markNotificationAsRead,
	searchUsersByEmail,
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
	if (!user) return [];
	await deleteNotificationByID(notificationId);
	revalidatePath("/", "layout");
}
