import { archiveMeetingForMember } from "@actions/meeting/archive/action";
import type {
	ApiErrorResponse,
	MeetingMemberActionResponse,
} from "@zotmeet/shared";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getMemberIdFromBearer } from "@/lib/auth/bearer";

/**
 * `POST /api/meetings/[id]/archive` — the Expo app's counterpart to the
 * `archiveMeeting` server action ("Delete Meeting" on a card the member
 * hosts). Same `archiveMeetingForMember`; the member comes from the bearer
 * token, and the action's `{ success, error }` is the response body — a
 * refused action is a `200` with `success: false`, as the server action is,
 * so the client shows the same message either way.
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

	const result = await archiveMeetingForMember(id, memberId);
	return NextResponse.json<MeetingMemberActionResponse>(result);
}
