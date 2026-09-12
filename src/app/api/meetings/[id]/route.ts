import {
	getAllMemberAvailability,
	getExistingMeeting,
	getResponderCountsByMeetingIds,
} from "@data/meeting/queries";
import type { ApiErrorResponse, MeetingResponse } from "@zotmeet/shared";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * `GET /api/meetings/[id]` — the Expo app's counterpart to
 * `app/availability/[slug]/page.tsx`. Reads through the same queries and is
 * public for the same reason: anyone with the link can view a meeting. The
 * host's contact details that `getExistingMeeting` joins in stay server-side.
 */
export async function GET(
	_request: NextRequest,
	context: { params: Promise<{ id: string }> },
) {
	const { id } = await context.params;

	// Anything that is not a uuid cannot be a meeting, and would otherwise
	// surface as a Postgres cast error rather than a clean 404.
	if (!z.string().uuid().safeParse(id).success) {
		return notFound();
	}

	let meeting: Awaited<ReturnType<typeof getExistingMeeting>>;
	try {
		meeting = await getExistingMeeting(id);
	} catch {
		return notFound();
	}

	const [responderCounts, memberAvailability] = await Promise.all([
		getResponderCountsByMeetingIds([id]),
		getAllMemberAvailability({ meetingId: id }),
	]);

	// `satisfies` pins this to the shared contract: a `meetings` column change
	// fails here at typecheck instead of drifting from what mobile expects.
	const body = {
		id: meeting.id,
		title: meeting.title,
		description: meeting.description,
		location: meeting.location,
		fromTime: meeting.fromTime,
		toTime: meeting.toTime,
		timezone: meeting.timezone,
		dates: meeting.dates,
		meetingType: meeting.meetingType,
		hostId: meeting.hostId,
		group_id: meeting.group_id,
		scheduled: meeting.scheduled,
		membersCanInvite: meeting.membersCanInvite,
		createdAt: meeting.createdAt.toISOString(),
		attendees: {
			responded: responderCounts[id] ?? 0,
			total: memberAvailability.length,
		},
	} satisfies MeetingResponse;

	return NextResponse.json<MeetingResponse>(body);
}

function notFound() {
	return NextResponse.json<ApiErrorResponse>(
		{ error: "Meeting not found" },
		{ status: 404 },
	);
}
