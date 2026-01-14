import { create } from "zustand";

interface AvailabilityViewStore {
	availabilityView: "group" | "personal";
	setAvailabilityView: (view: "group" | "personal") => void;
	hasAvailability: boolean;
	setHasAvailability: (hasAvailability: boolean) => void;
	overlayGoogleCalendar: boolean;
	setOverlayGoogleCalendar: (hasCalendar: boolean) => void;
}

export const useAvailabilityViewStore = create<AvailabilityViewStore>(
	(set) => ({
		availabilityView: "group",
		setAvailabilityView: (view) => {
			set({ availabilityView: view });
		},
		hasAvailability: false,
		setHasAvailability: (hasAvailability) => {
			set({ hasAvailability });
		},
		overlayGoogleCalendar: false,
		setOverlayGoogleCalendar: (hasCalendar) => {
			set({ overlayGoogleCalendar: hasCalendar });
		},
	}),
);
