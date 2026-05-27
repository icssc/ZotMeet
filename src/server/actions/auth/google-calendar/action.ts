"use server";

import { getCurrentSession } from "@/lib/auth";

/** True when signed in but this session has no Google Calendar grant yet. */
export async function needsGoogleCalendarConnect(): Promise<boolean> {
	const { session } = await getCurrentSession();
	if (session === null) {
		return false;
	}
	return session.googleRefreshToken === null;
}
