import { useMemo } from "react";
import type {
	GoogleCalendarEvent,
	GoogleCalendarInfo,
} from "@/lib/types/availability";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

// Derives the set of Google Calendars currently surfaceable in the overlay  picker
export function useCalendarOverlays(events: GoogleCalendarEvent[]) {
	const hiddenCalendarIds = useAvailabilityStore((s) => s.hiddenCalendarIds);

	const calendars = useMemo<GoogleCalendarInfo[]>(() => {
		const calendarsById = new Map<string, GoogleCalendarInfo>();
		for (const event of events) {
			if (event.calendarId && !calendarsById.has(event.calendarId)) {
				calendarsById.set(event.calendarId, {
					id: event.calendarId,
					name: event.calendarName,
					color: event.calendarColor,
				});
			}
		}
		return Array.from(calendarsById.values());
	}, [events]);

	const visibleEvents = useMemo(
		() =>
			hiddenCalendarIds.size === 0
				? events
				: events.filter(
						(e) => !e.calendarId || !hiddenCalendarIds.has(e.calendarId),
					),
		[events, hiddenCalendarIds],
	);

	return { calendars, visibleEvents };
}
