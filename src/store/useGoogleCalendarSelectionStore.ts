import { create } from "zustand";

interface CalendarSelection {
	calendarId: string;
	calendarName: string;
	calendarColor: string;
	enabled: boolean;
	archived: boolean;
}

interface GoogleCalendarSelectionState {
	calendars: CalendarSelection[];
	isDialogOpen: boolean;

	setCalendars: (calendars: CalendarSelection[]) => void;
	toggleCalendar: (calendarId: string) => void;
	setDialogOpen: (open: boolean) => void;
}

export const useGoogleCalendarSelectionStore =
	create<GoogleCalendarSelectionState>((set) => ({
		calendars: [],
		isDialogOpen: false,

		setCalendars: (calendars) => set({ calendars }),

		toggleCalendar: (calendarId) =>
			set((state) => ({
				calendars: state.calendars.map((cal) =>
					cal.calendarId === calendarId
						? { ...cal, enabled: !cal.enabled }
						: cal,
				),
			})),

		setDialogOpen: (isDialogOpen) => set({ isDialogOpen }),
	}));
