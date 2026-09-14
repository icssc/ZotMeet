import {
	type ApiErrorResponse,
	type SaveAvailabilityResponse,
	saveAvailabilitySchema,
} from "@zotmeet/shared";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getMemberIdFromBearer } from "@/lib/auth/bearer";
import { savePersonalAvailabilityForMember } from "@/server/data/availability/save";

/**
 * `PUT /api/meetings/[id]/availability` — the Expo app's counterpart to the
 * `savePersonalAvailability` server action: replaces the caller's response
 * to the meeting. Same `savePersonalAvailabilityForMember`; see the archive
 * route for the response convention.
 */
export async function PUT(
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

	try {
		const parsed = saveAvailabilitySchema.safeParse(
			await request.json().catch(() => null),
		);
		if (!parsed.success) {
			return NextResponse.json<ApiErrorResponse>(
				{ error: "Invalid availability", issues: parsed.error.flatten() },
				{ status: 400 },
			);
		}

		await savePersonalAvailabilityForMember({
			meetingId: id,
			memberId,
			...parsed.data,
		});
	} catch (error) {
		console.error("Error saving personal availability:", error);
		const detail =
			process.env.NODE_ENV !== "production" && error instanceof Error
				? ` (${error.message})`
				: "";
		return NextResponse.json<ApiErrorResponse>(
			{ error: `Failed to save${detail}` },
			{ status: 500 },
		);
	}

	return NextResponse.json<SaveAvailabilityResponse>({ success: true });
}
