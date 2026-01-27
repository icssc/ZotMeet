import { create } from "zustand";

interface ScheduleSelectionState {
	scheduledTimes: Set<string>; // already saved times from DB
	pendingAdds: Set<string>; // times being scheduled in current session
	pendingRemovals: Set<string>; // times being unscheduled in current session
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
		pendingAdds: new Set<string>(),
		pendingRemovals: new Set<string>(),

		// Add a single pending time
		addPendingTime: (timestamp: string) => {
			set((state) => {
				const newPending = new Set(state.pendingAdds);
				newPending.add(timestamp);
				return { pendingAdds: newPending };
			});
		},

		// Add multiple pending times
		addPendingTimeRange: (timestamps: string[]) => {
			set((state) => {
				const newPending = new Set(state.pendingAdds);

				timestamps.forEach((ts) => {
					newPending.add(ts);
				});

				return { pendingAdds: newPending };
			});
		},

		// Commit pending times to scheduledTimes (after saving to DB)
		commitPendingTimes: () => {
			set((state) => {
				const nextScheduled = new Set(state.scheduledTimes);

				state.pendingRemovals.forEach((ts) => {
					nextScheduled.delete(ts);
				});
				state.pendingAdds.forEach((ts) => {
					nextScheduled.add(ts);
				});

				return {
					scheduledTimes: nextScheduled,
					pendingAdds: new Set(),
					pendingRemovals: new Set(),
				};
			});
		},

		// Toggle a pending time (add/remove, or mark for removal if already scheduled)
		togglePendingTime: (timestamp: string) => {
			set((state) => {
				const newPending = new Set(state.pendingAdds);
				const newPendingRemovals = new Set(state.pendingRemovals || []);

				if (state.scheduledTimes.has(timestamp)) {
					// Already scheduled → mark for removal
					if (newPendingRemovals.has(timestamp)) {
						newPendingRemovals.delete(timestamp); // undo removal
					} else {
						newPendingRemovals.add(timestamp); // mark for removal
					}
				} else {
					// Not scheduled → normal pending toggle
					if (newPending.has(timestamp)) {
						newPending.delete(timestamp);
					} else {
						newPending.add(timestamp);
					}
				}

				return { pendingAdds: newPending, pendingRemovals: newPendingRemovals };
			});
		},

		// Clear only pending changes (adds and removals)
		clearPendingTimes: () =>
			set({
				pendingAdds: new Set(),
				pendingRemovals: new Set(),
			}),

		// Check if a time is scheduled (saved or pending)
		isScheduled: (timestamp) => {
			const { scheduledTimes, pendingAdds, pendingRemovals } = get();

			if (pendingRemovals.has(timestamp) && !pendingAdds.has(timestamp))
				return false;
			if (pendingAdds.has(timestamp) && !pendingRemovals.has(timestamp))
				return true;
			return scheduledTimes.has(timestamp);
		},

		hydrateScheduledTimes: (timestamps: string[]) => {
			set({
				scheduledTimes: new Set(timestamps),
				pendingAdds: new Set(), // clear pending on load
				pendingRemovals: new Set(),
			});
		},
	}),
);
