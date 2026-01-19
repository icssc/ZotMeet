import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { groupInvites, type SelectGroupInvite } from "@/db/schema";

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
