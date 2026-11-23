import { listGroupsForMember } from "@data/groups/queries";
import type {
	ApiErrorResponse,
	GroupListItem,
	GroupsListResponse,
} from "@zotmeet/shared";
import { type NextRequest, NextResponse } from "next/server";
import { getMemberIdFromBearer } from "@/lib/auth/bearer";

/** `GET /api/groups` — the Expo app's counterpart to `app/groups/page.tsx`. */
export async function GET(request: NextRequest) {
	const memberId = await getMemberIdFromBearer(request);
	if (!memberId) {
		return NextResponse.json<ApiErrorResponse>(
			{ error: "Unauthorized" },
			{ status: 401 },
		);
	}

	const groups = await listGroupsForMember(memberId);

	return NextResponse.json<GroupsListResponse>({
		groups: groups.map(
			(group) =>
				({
					id: group.id,
					name: group.name,
					icon: group.icon,
					memberCount: group.memberCount,
					members: group.members.map((member) => ({
						userId: member.userId,
						displayName: member.displayName,
						profilePicture: member.profilePicture,
					})),
					isCreator: group.isCreator,
					needsAvailability: group.needsAvailability,
					pendingMeetingName: group.pendingMeetingName,
					upcomingMeetingName: group.upcomingMeetingName,
				}) satisfies GroupListItem,
		),
	});
}
