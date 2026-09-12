import { createMeetingFromData } from "@actions/meeting/create/action";
import {
	type ApiErrorResponse,
	type CreateMeetingResponse,
	createMeetingSchema,
} from "@zotmeet/shared";
import { type NextRequest, NextResponse } from "next/server";
import { getMemberIdFromBearer } from "@/lib/auth/bearer";

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
