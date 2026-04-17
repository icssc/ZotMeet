// appended when redirecting to a meeting immediately after creation.
export const OPEN_INVITE_AFTER_CREATE_PARAM = "openInvite";
export const OPEN_INVITE_AFTER_CREATE_VALUE = "1";

export function availabilityPathWithOpenInvite(meetingId: string) {
	const q = new URLSearchParams({
		[OPEN_INVITE_AFTER_CREATE_PARAM]: OPEN_INVITE_AFTER_CREATE_VALUE,
	});
	return `/availability/${meetingId}?${q.toString()}`;
}
