import { createMeetingFromData } from "@actions/meeting/create/action";
import {
	getMeetings,
	getResponderCountsByMeetingIds,
	getScheduledMeetingsByMeetingIds,
} from "@data/meeting/queries";
import {
	type ApiErrorResponse,
	type CreateMeetingResponse,
	createMeetingSchema,
	type MeetingListItem,
	type MeetingsListResponse,
} from "@zotmeet/shared";
import { type NextRequest, NextResponse } from "next/server";
import { getMemberIdFromBearer } from "@/lib/auth/bearer";

/**
 * `GET /api/meetings` — the Expo app's counterpart to `app/summary/page.tsx`:
 * the meetings the member hosts or has joined, through the same three queries
 * the page runs (`getMeetings`, responder counts, first scheduled block),
 * flattened into one row per meeting. The page derives its labels and the
 * "upcoming" set from these on the server; the app derives them from the
 * same shared helpers on the device, in the device's own "today".
 */
export async function GET(request: NextRequest) {
	const memberId = await getMemberIdFromBearer(request);
	if (!memberId) {
		return NextResponse.json<ApiErrorResponse>(
			{ error: "Unauthorized" },
			{ status: 401 },
		);
	}

	const meetings = await getMeetings(memberId);
	const meetingIds = meetings.map((m) => m.id);
	const [responderCounts, scheduledMeetingMap] = await Promise.all([
		getResponderCountsByMeetingIds(meetingIds),
		getScheduledMeetingsByMeetingIds(
			meetings.filter((m) => m.scheduled).map((m) => m.id),
		),
	]);

	const body: MeetingsListResponse = {
		memberId,
		meetings: meetings.map((meeting) => {
			const scheduled = scheduledMeetingMap[meeting.id];
			// `satisfies` pins each row to the shared contract, like the GET
			// by-id route: a column change fails here at typecheck.
			return {
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
				hostDisplayName: meeting.hostDisplayName,
				needsAvailability: meeting.needsAvailability,
				allAvailabilityFilled: meeting.allAvailabilityFilled,
				responderCount: responderCounts[meeting.id] ?? 0,
				scheduledAt: scheduled
					? {
							date: scheduled.scheduledDate.toISOString(),
							fromTime: scheduled.scheduledFromTime,
							toTime: scheduled.scheduledToTime,
						}
					: null,
			} satisfies MeetingListItem;
		}),
	};

	return NextResponse.json<MeetingsListResponse>(body);
}

/**
 * `POST /api/meetings` — the Expo app's counterpart to the `createMeeting`
 * server action. Same insert (`createMeetingFromData`), same redirect target
 * on the client (`/availability/<id>`); only the transport differs: JSON in,
 * `201 { id }` out, and the host comes from the bearer token rather than the
 * session cookie. See `src/lib/auth/bearer.ts` for what that token may be.
 */
export async function POST(request: NextRequest) {
	const memberId = await getMemberIdFromBearer(request);
	if (!memberId) {
		return NextResponse.json<ApiErrorResponse>(
			{ error: "Unauthorized" },
			{ status: 401 },
		);
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json<ApiErrorResponse>(
			{ error: "Invalid JSON" },
			{ status: 400 },
		);
	}

	const parsed = createMeetingSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json<ApiErrorResponse>(
			{ error: "Invalid request", issues: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	const { title, fromTime, toTime, timezone, dates, meetingType, description } =
		parsed.data;

	const result = await createMeetingFromData(
		{
			title,
			fromTime,
			toTime,
			timezone,
			dates,
			meetingType,
			description: description ?? "",
			group_id: null,
		},
		memberId,
	);

	if ("error" in result) {
		return NextResponse.json<ApiErrorResponse>(
			{ error: result.error },
			{ status: 400 },
		);
	}

	return NextResponse.json<CreateMeetingResponse>(
		{ id: result.id },
		{ status: 201 },
	);
}
