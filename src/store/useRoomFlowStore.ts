import { create } from "zustand";

/** 0 = pick a time, 1 = pick a room, 2 = book. */
export type RoomFlowStep = 0 | 1 | 2;

export interface RoomFlowFilters {
	minSeats: number | null;
	location: string | null;
	minMinutes: number | null;
}

const NO_FILTERS: RoomFlowFilters = {
	minSeats: null,
	location: null,
	minMinutes: null,
};

interface RoomFlowStore {
	step: RoomFlowStep;
	/** `BestTime.id`. */
	selectedTimeId: string | null;
	hoveredTimeId: string | null;
	/** `Room.key`. */
	selectedRoomKey: string | null;
	hoveredRoomKey: string | null;
	/** Epoch ms of the chosen start slot; null picks the first. */
	selectedSlotStart: number | null;
	filters: RoomFlowFilters;
	/** The empty state's "Include partly free rooms". */
	includePartial: boolean;
	/** The empty state's "Show more times": best times one below the peak. */
	showMoreTimes: boolean;

	setStep: (step: RoomFlowStep) => void;
	selectTime: (id: string) => void;
	setHoveredTimeId: (id: string | null) => void;
	selectRoom: (key: string) => void;
	setHoveredRoomKey: (key: string | null) => void;
	setSelectedSlotStart: (start: number | null) => void;
	setFilters: (filters: Partial<RoomFlowFilters>) => void;
	setIncludePartial: (on: boolean) => void;
	setShowMoreTimes: (on: boolean) => void;
	reset: () => void;
}

const initialState = {
	step: 0 as RoomFlowStep,
	selectedTimeId: null,
	hoveredTimeId: null,
	selectedRoomKey: null,
	hoveredRoomKey: null,
	selectedSlotStart: null,
	filters: NO_FILTERS,
	includePartial: false,
	showMoreTimes: false,
};

export const useRoomFlowStore = create<RoomFlowStore>((set) => ({
	...initialState,

	setStep: (step) => set({ step }),
	// A different time invalidates the room and slot picked for the old one.
	selectTime: (id) =>
		set((state) =>
			state.selectedTimeId === id
				? state
				: {
						selectedTimeId: id,
						selectedRoomKey: null,
						selectedSlotStart: null,
						filters: NO_FILTERS,
					},
		),
	setHoveredTimeId: (hoveredTimeId) => set({ hoveredTimeId }),
	selectRoom: (key) =>
		set((state) =>
			state.selectedRoomKey === key
				? state
				: { selectedRoomKey: key, selectedSlotStart: null },
		),
	setHoveredRoomKey: (hoveredRoomKey) => set({ hoveredRoomKey }),
	setSelectedSlotStart: (selectedSlotStart) => set({ selectedSlotStart }),
	setFilters: (filters) =>
		set((state) => ({ filters: { ...state.filters, ...filters } })),
	setIncludePartial: (includePartial) => set({ includePartial }),
	setShowMoreTimes: (showMoreTimes) => set({ showMoreTimes }),
	reset: () => set(initialState),
}));
