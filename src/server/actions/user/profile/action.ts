"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { members } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";

export async function updateUserProfile(data: {
	displayName: string;
	username: string;
	year: string;
	school: string;
}) {
	const { user } = await getCurrentSession();
	if (!user) return { success: false, message: "Not authenticated" };

	const trimmedUsername = data.username.trim();

	if (trimmedUsername) {
		const existing = await db.query.members.findFirst({
			where: (m, { and, eq, ne }) =>
				and(eq(m.username, trimmedUsername), ne(m.id, user.memberId)),
			columns: { id: true },
		});
		if (existing) {
			return { success: false, message: "Username is already taken" };
		}
	}

	await db
		.update(members)
		.set({
			displayName: data.displayName.trim() || user.displayName,
			username: trimmedUsername || null,
			year: data.year.trim() || null,
			school: data.school.trim() || null,
		})
		.where(eq(members.id, user.memberId));

	revalidatePath("/profile");
	return { success: true, message: "Profile updated" };
}

export async function updateProfilePicture(base64: string) {
	const { user } = await getCurrentSession();
	if (!user) return { success: false, message: "Not authenticated" };

	await db
		.update(members)
		.set({ profilePicture: base64 })
		.where(eq(members.id, user.memberId));

	revalidatePath("/", "layout");
	return { success: true };
}

export async function removeProfilePicture() {
	const { user } = await getCurrentSession();
	if (!user) return { success: false, message: "Not authenticated" };

	await db
		.update(members)
		.set({ profilePicture: null })
		.where(eq(members.id, user.memberId));

	revalidatePath("/", "layout");
	return { success: true };
}
