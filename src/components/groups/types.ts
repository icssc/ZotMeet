import type { GroupRole } from "@/db/schema";

export type GroupMember = {
	userId: string;
	memberId: string;
	email: string;
	displayName: string;
	profilePicture: string | null;
	role: GroupRole;
};
