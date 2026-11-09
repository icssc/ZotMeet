import { z } from "zod";
import type { MeetingType } from "../meetings/schema";

export const GROUP_NAME_MAX = 100;
export const GROUP_DESCRIPTION_MAX = 500;

export const createGroupSchema = z.object({
	name: z
		.string()
		.min(1, {
			message: "Group name is required",
		})
		.max(GROUP_NAME_MAX, {
			message: "Group name must be less than 100 characters",
		}),
	description: z
		.string()
		.max(GROUP_DESCRIPTION_MAX, {
			message: "Description must be less than 500 characters",
		})
		.optional(),
	memberIds: z.array(z.string()).optional(),
	icon: z.string().optional(),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;

export type CreateGroupResponse =
	| { success: true; message: string; groupId: string }
	| { success: false; message: string };

export type GroupListMember = {
	userId: string;
	displayName: string;
	profilePicture: string | null;
};

export type GroupListItem = {
	id: string;
	name: string;
	icon: string | null;
	memberCount: number;
	members: GroupListMember[];
	isCreator: boolean;
	needsAvailability: boolean;
	pendingMeetingName: string | null;
	upcomingMeetingName: string | null;
};

export type GroupsListResponse = {
	groups: GroupListItem[];
};

export type GroupMeetingItem = {
	id: string;
	title: string;
	hostId: string;
	hostName: string;
	meetingType: MeetingType;
	dates: string[];
	scheduledDate: string | null;
	totalMembers: number;
	respondedCount: number;
	userHasResponded: boolean;
};

export type GroupDetailResponse = {
	group: {
		id: string;
		name: string;
		description: string | null;
		icon: string | null;
	};
	memberId: string;
	memberCount: number;
	isAdmin: boolean;
	isCreator: boolean;
	meetings: GroupMeetingItem[];
};
