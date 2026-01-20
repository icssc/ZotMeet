import { create } from "zustand";

interface ScheduleSelectionState {
	scheduledTimes: Set<string>; // already saved times from DB
	pendingTimes: Set<string>; // times being scheduled in current session
	addPendingTime: (timestamp: string) => void;
	addPendingTimeRange: (timestamps: string[]) => void;
	commitPendingTimes: () => void;
	togglePendingTime: (timestamp: string) => void;
	clearPendingTimes: () => void;
	isScheduled: (timestamp: string) => boolean;
	hydrateScheduledTimes: (timestamps: string[]) => void;
}

export const useScheduleSelectionStore = create<ScheduleSelectionState>(
	(set, get) => ({
		scheduledTimes: new Set<string>(),
		pendingTimes: new Set<string>(),

		// Add a single pending time
		addPendingTime: (timestamp: string) => {
			set((state) => {
				const newPending = new Set(state.pendingTimes);
				newPending.add(timestamp);
				return { pendingTimes: newPending };
			});
		},

		// Add multiple pending times
		addPendingTimeRange: (timestamps: string[]) => {
			set((state) => {
				const newPending = new Set(state.pendingTimes);

				timestamps.forEach((ts) => {
					newPending.add(ts);
				});

				return { pendingTimes: newPending };
			});
		},

		// Commit pending times to scheduledTimes (after saving to DB)
		commitPendingTimes: () => {
			set((state) => ({
				scheduledTimes: new Set([
					...state.scheduledTimes,
					...state.pendingTimes,
				]),
				pendingTimes: new Set(),
			}));
		},

		// Toggle a pending time (add/remove)
		togglePendingTime: (timestamp: string) => {
			set((state) => {
				const newPending = new Set(state.pendingTimes);
				if (newPending.has(timestamp)) {
					newPending.delete(timestamp);
				} else {
					newPending.add(timestamp);
				}
				return { pendingTimes: newPending };
			});
		},

		// Clear only pending times (for Cancel)
		clearPendingTimes: () => set({ pendingTimes: new Set() }),

		// Check if a time is scheduled (saved or pending)
		isScheduled: (timestamp: string) => {
			const state = get();
			return (
				state.scheduledTimes.has(timestamp) || state.pendingTimes.has(timestamp)
			);
		},

		hydrateScheduledTimes: (timestamps: string[]) => {
			set({
				scheduledTimes: new Set(timestamps),
				pendingTimes: new Set(), // clear pending on load
			});
		},
	}),
);
