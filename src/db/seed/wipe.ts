import { inArray, like } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { groups, members, notifications, users } from "../schema";
import { seedUserIdLike } from "./build";

export type Tx = Parameters<Parameters<NodePgDatabase["transaction"]>[0]>[0];

export async function wipeSeedData(tx: Tx): Promise<void> {
	const seedIds = seedUserIdLike();
	const seedUsers = await tx
		.select({ memberId: users.memberId })
		.from(users)
		.where(like(users.id, seedIds));

	await tx.delete(notifications).where(like(notifications.createdBy, seedIds));
	await tx.delete(groups).where(like(groups.createdBy, seedIds));

	if (seedUsers.length > 0) {
		await tx.delete(members).where(
			inArray(
				members.id,
				seedUsers.map((u) => u.memberId),
			),
		);
	}
}
