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
