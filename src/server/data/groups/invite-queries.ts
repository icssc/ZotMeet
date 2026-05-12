import "server-only";

import { and, eq, gt, isNull, or } from "drizzle-orm";
import { db } from "@/db";
import { groupInvites, groups, type SelectGroupInvite } from "@/db/schema";

export async function getExistingInvite(
	token: string,
): Promise<SelectGroupInvite> {
	const [invite] = await db
		.select()
		.from(groupInvites)
		.where(eq(groupInvites.inviteToken, token))
		.limit(1);

	if (!invite) {
		throw new Error("Invite not found");
	}

	return invite;
}

/** Reuses a non-expired invite for the group when present; otherwise inserts a new row. */
export async function getOrCreateActiveGroupInviteToken(
	groupId: string,
	inviterId: string,
	expiresAt: Date | null = null,
): Promise<string> {
	return db.transaction(async (tx) => {
		await tx
			.select({ id: groups.id })
			.from(groups)
			.where(eq(groups.id, groupId))
			.for("update")
			.limit(1);

		const [existingInvite] = await tx
			.select({ inviteToken: groupInvites.inviteToken })
			.from(groupInvites)
			.where(
				and(
					eq(groupInvites.groupId, groupId),
					or(
						isNull(groupInvites.expiresAt),
						gt(groupInvites.expiresAt, new Date()),
					),
				),
			)
			.limit(1);

		if (existingInvite) {
			return existingInvite.inviteToken;
		}

		const inviteToken = crypto.randomUUID();
		await tx.insert(groupInvites).values({
			groupId,
			inviteToken,
			inviterId,
			inviteeEmail: "",
			sentAt: new Date(),
			expiresAt,
		});

		return inviteToken;
	});
}
