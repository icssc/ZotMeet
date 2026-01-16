"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { groups, meetings } from "@/db/schema";
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

		const groupMeetings = await getMeetingsByGroupId(groupId, true);
		const meetingCount = groupMeetings.length;

		// Soft delete: archive the group and its meetings
		await db.update(groups).set({ archived: true }).where(eq(groups.id, groupId));

		if (meetingCount > 0) {
			await db
				.update(meetings)
				.set({ archived: true })
				.where(eq(meetings.group_id, groupId));
		}

		revalidatePath("/summary");
		revalidatePath("/groups");

		const message =
			meetingCount > 0
				? `Group archived successfully. ${meetingCount} meeting${meetingCount === 1 ? " has" : "s have"} been archived.`
				: "Group archived successfully.";

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
