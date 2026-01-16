"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { groups } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import {
	getExistingGroup,
	getMeetingsByGroupId,
	isGroupCreator,
} from "@/server/data/groups/queries";

export type DeleteGroupState = {
	success: boolean;
	message: string;
};

export async function deleteGroup(groupId: string): Promise<DeleteGroupState> {
	const { user } = await getCurrentSession();

	if (!user) {
		return {
			success: false,
			message: "You must be logged in to delete a group.",
		};
	}

	try {
		await getExistingGroup(groupId);
	} catch {
		return {
			success: false,
			message: "Group not found.",
		};
	}

	try {
		const isCreator = await isGroupCreator({ userId: user.id, groupId });

		if (!isCreator) {
			return {
				success: false,
				message: "You do not have permission to delete this group.",
			};
		}

		const meetings = await getMeetingsByGroupId(groupId, true);
		const meetingCount = meetings.length;

		await db.delete(groups).where(eq(groups.id, groupId));

		revalidatePath("/summary");
		revalidatePath("/groups");

		const message =
			meetingCount > 0
				? `Group deleted successfully. ${meetingCount} meeting${meetingCount === 1 ? " has" : "s have"} been deleted.`
				: "Group deleted successfully.";

		return {
			success: true,
			message,
		};
	} catch (error) {
		console.error("Failed to delete group:", error);
		return {
			success: false,
			message: "Failed to delete group. Please try again.",
		};
	}
}
