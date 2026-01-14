import { create } from "zustand";

interface ScheduleSelectionState {
	scheduledTimes: Set<string>; // Set of ISO timestamp strings
	addScheduledTime: (timestamp: string) => void;
	removeScheduledTime: (timestamp: string) => void;
	toggleScheduledTime: (timestamp: string) => void;
	addScheduledTimeRange: (timestamps: string[]) => void;
	clearScheduledTimes: () => void;
	isScheduled: (timestamp: string) => boolean;
}

export const useScheduleSelectionStore = create<ScheduleSelectionState>(
	(set, get) => ({
		scheduledTimes: new Set<string>(),
		addScheduledTime: (timestamp) =>
			set((state) => ({
				scheduledTimes: new Set(state.scheduledTimes).add(timestamp),
			})),
		removeScheduledTime: (timestamp) =>
			set((state) => {
				const newSet = new Set(state.scheduledTimes);
				newSet.delete(timestamp);
				return { scheduledTimes: newSet };
			}),
		toggleScheduledTime: (timestamp) => {
			const state = get();
			if (state.scheduledTimes.has(timestamp)) {
				state.removeScheduledTime(timestamp);
			} else {
				state.addScheduledTime(timestamp);
			}
		},
		addScheduledTimeRange: (timestamps) =>
			set((state) => {
				const newSet = new Set(state.scheduledTimes);
				timestamps.forEach((ts) => {
					newSet.add(ts);
				});
				return { scheduledTimes: newSet };
			}),
		clearScheduledTimes: () => set({ scheduledTimes: new Set<string>() }),
		isScheduled: (timestamp) => {
			const state = get();
			return state.scheduledTimes.has(timestamp);
		},
	}),
);
