import "server-only";

import { and, eq, ilike, ne } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

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
