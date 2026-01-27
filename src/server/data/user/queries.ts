import "server-only";

import { db } from "@/db";
import { users } from "@/db/schema";

export async function getUserIdExists(id: string) {
	const user = await db.query.users.findFirst({
		where: { id },
	});

	return user !== undefined;
}

export async function getUserEmailExists(email: string) {
	const user = await db.query.users.findFirst({
		where: { email },
	});

	return user !== undefined;
}

export async function getUserById(id: string) {
	const user = await db.query.users.findFirst({
		where: { id },
		columns: {
			id: true,
			memberId: true,
			email: true,
		},
	});

	return user ?? null;
}
