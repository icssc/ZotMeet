import "server-only";

import { db } from "@/db";
import type { SelectGroupInvite } from "@/db/schema";

export async function getExistingInvite(
	token: string,
): Promise<SelectGroupInvite> {
	const invite = await db.query.groupInvites.findFirst({
		where: (groupInvites, { eq }) => eq(groupInvites.inviteToken, token),
	});

	if (!invite) {
		throw new Error("Invite not found");
	}

	return invite;
}
