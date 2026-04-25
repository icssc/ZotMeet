"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { members } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";

const USERNAME_INVALID_CHARS = /[^a-z0-9._]/;

export async function updateUserProfile(data: {
	displayName: string;
	username: string;
	year: string;
	school: string;
}) {
	const { user } = await getCurrentSession();
	if (!user) return { success: false, message: "Not authenticated" };

	const trimmedUsername = data.username.trim().toLowerCase();

	if (trimmedUsername && USERNAME_INVALID_CHARS.test(trimmedUsername)) {
		return {
			success: false,
			message:
				"Username can only contain letters, numbers, periods, and underscores",
		};
	}

	if (trimmedUsername) {
		const existing = await db.query.members.findFirst({
			where: (m, { and, eq, ne }) =>
				and(eq(m.username, trimmedUsername), ne(m.id, user.memberId)),
			columns: { id: true },
		});
		if (existing) {
			return { success: false, message: "Username has already been taken" };
		}
	}

	try {
		await db
			.update(members)
			.set({
				displayName:
					data.displayName.trim() || user.googleName || user.displayName,
				username: trimmedUsername || user.username,
				year: data.year.trim() || null,
				school: data.school.trim() || null,
			})
			.where(eq(members.id, user.memberId));
	} catch (e) {
		if (e instanceof Error && "code" in e && e.code === "23505") {
			return { success: false, message: "Username has already been taken" };
		}
		throw e;
	}

	revalidatePath("/profile");
	return { success: true, message: "Profile updated" };
}

export async function checkUsernameAvailability(username: string) {
	const { user } = await getCurrentSession();
	if (!user) return { available: false };

	const trimmed = username.trim().toLowerCase();
	if (!trimmed || USERNAME_INVALID_CHARS.test(trimmed))
		return { available: false };

	const existing = await db.query.members.findFirst({
		where: (m, { and, eq, ne }) =>
			and(eq(m.username, trimmed), ne(m.id, user.memberId)),
		columns: { id: true },
	});

	return { available: !existing };
}
