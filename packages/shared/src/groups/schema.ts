import type { MeetingType } from "../meetings/schema";

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
