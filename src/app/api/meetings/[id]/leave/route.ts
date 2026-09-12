import type {
	ApiErrorResponse,
	MeetingMemberActionResponse,
} from "@zotmeet/shared";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getMemberIdFromBearer } from "@/lib/auth/bearer";
import { leaveMeetingForMember } from "@/server/data/meeting/member-actions";

/**
 * `POST /api/meetings/[id]/leave` — the Expo app's counterpart to the
 * `leaveMeeting` server action ("Leave Meeting" on a card the member does
 * not host). Same `leaveMeetingForMember`; see the archive route for the
 * response convention.
 */
export async function POST(
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
			{ error: "Meeting not found" },
			{ status: 404 },
		);
	}

	const result = await leaveMeetingForMember(id, memberId);
	return NextResponse.json<MeetingMemberActionResponse>(result);
}
