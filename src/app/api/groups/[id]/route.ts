import { getGroupDetailForMember } from "@data/groups/queries";
import type {
	ApiErrorResponse,
	GroupDetailResponse,
	GroupMeetingItem,
} from "@zotmeet/shared";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getMemberIdFromBearer } from "@/lib/auth/bearer";

/** `GET /api/groups/:id` — the Expo app's counterpart to `app/groups/[id]/page.tsx`. */
export async function GET(
	request: NextRequest,
	context: { params: Promise<{ id: string }> },
) {
	const memberId = await getMemberIdFromBearer(request);
	if (!memberId) {
		return NextResponse.json<ApiErrorResponse>(
			{ error: "Unauthorized" },
			{ status: 401 },
		);
	}

	const { id } = await context.params;
	if (!z.string().uuid().safeParse(id).success) {
		return NextResponse.json<ApiErrorResponse>(
			{ error: "Group not found" },
			{ status: 404 },
		);
	}

	const detail = await getGroupDetailForMember(id, memberId);
	if (detail.status === "not-found") {
		return NextResponse.json<ApiErrorResponse>(
			{ error: "Group not found" },
			{ status: 404 },
		);
	}
	if (detail.status === "forbidden") {
		return NextResponse.json<ApiErrorResponse>(
			{ error: "You are not a member of this group" },
			{ status: 403 },
		);
	}

	return NextResponse.json<GroupDetailResponse>({
		group: {
			id: detail.group.id,
			name: detail.group.name,
			description: detail.group.description,
			icon: detail.group.icon,
		},
		memberId,
		memberCount: detail.memberCount,
		isAdmin: detail.isAdmin,
		isCreator: detail.isCreator,
		meetings: detail.meetings.map(
			(meeting) =>
				({
					id: meeting.id,
					title: meeting.title,
					hostId: meeting.hostId,
					hostName: meeting.hostName,
					meetingType: meeting.meetingType,
					dates: meeting.dates ?? [],
					scheduledDate: meeting.scheduledDate?.toISOString() ?? null,
					totalMembers: meeting.totalMembers,
					respondedCount: meeting.respondedCount,
					userHasResponded: meeting.userHasResponded,
				}) satisfies GroupMeetingItem,
		),
	});
}
