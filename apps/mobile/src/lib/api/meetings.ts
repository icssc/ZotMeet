import {
	type CreateMeetingInput,
	type CreateMeetingResponse,
	createMeetingSchema,
	type MeetingMemberActionResponse,
	type MeetingResponse,
	type MeetingsListResponse,
} from "@zotmeet/shared";
import { apiFetch } from "@/lib/api/client";

/**
 * The mobile counterpart to the web app's `@actions/meeting/*` and
 * `@data/meeting/queries`, over HTTP. Each function maps to one route handler
 * under the web app's `src/app/api/meetings/`.
 */

/** `GET /api/meetings`: the member's meetings, as `/summary` lists them. */
export function getMeetings(): Promise<MeetingsListResponse> {
	return apiFetch<MeetingsListResponse>("/api/meetings");
}

/** `POST /api/meetings`. Validates locally first so bad input fails fast. */
export async function createMeeting(
	input: CreateMeetingInput,
): Promise<CreateMeetingResponse> {
	const parsed = createMeetingSchema.parse(input);
	return apiFetch<CreateMeetingResponse>("/api/meetings", {
		method: "POST",
		body: JSON.stringify(parsed),
	});
}

/** `GET /api/meetings/:id`. A missing meeting surfaces as `ApiError` 404. */
export function getMeeting(id: string): Promise<MeetingResponse> {
	return apiFetch<MeetingResponse>(`/api/meetings/${encodeURIComponent(id)}`);
}

/** `POST /api/meetings/:id/archive` — the web's `archiveMeeting` action. */
export function archiveMeeting(
	id: string,
): Promise<MeetingMemberActionResponse> {
	return apiFetch<MeetingMemberActionResponse>(
		`/api/meetings/${encodeURIComponent(id)}/archive`,
		{ method: "POST" },
	);
}

/** `POST /api/meetings/:id/leave` — the web's `leaveMeeting` action. */
export function leaveMeeting(id: string): Promise<MeetingMemberActionResponse> {
	return apiFetch<MeetingMemberActionResponse>(
		`/api/meetings/${encodeURIComponent(id)}/leave`,
		{ method: "POST" },
	);
}
