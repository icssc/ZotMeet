import {
	type CreateMeetingInput,
	type CreateMeetingResponse,
	createMeetingSchema,
	type MeetingResponse,
} from "@zotmeet/shared";
import { apiFetch } from "@/lib/api/client";

/**
 * The mobile counterpart to the web app's `@actions/meeting/create` and
 * `@data/meeting/queries`, over HTTP. Each function maps to one route handler
 * under the web app's `src/app/api/meetings/`.
 */

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
