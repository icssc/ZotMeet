import { create } from "zustand";
import type {
	AvailabilityBlockType,
	SelectionStateType,
} from "@/lib/types/availability";

interface AvailabilityStore {
	// Pagination
	currentPage: number;
	itemsPerPage: number;
	isFirstPage: boolean;
	nextPage: (totalItems: number) => void;
	prevPage: () => void;
	setCurrentPage: (page: number) => void;
	setItemsPerPage: (itemsPerPage: number) => void;
	setIsFirstPage: (isFirstPage: boolean) => void;

	// View
	availabilityView: "group" | "personal" | "schedule";
	hasAvailability: boolean;
	setAvailabilityView: (view: "group" | "personal" | "schedule") => void;
	setHasAvailability: (hasAvailability: boolean) => void;

	// Best Times
	enabled: boolean;
	setEnabled: (v: boolean) => void;

	// Block Selection
	startBlockSelection: AvailabilityBlockType | undefined;
	endBlockSelection: AvailabilityBlockType | undefined;
	selectionState: SelectionStateType | undefined;
	setStartBlockSelection: (block: AvailabilityBlockType | undefined) => void;
	setEndBlockSelection: (block: AvailabilityBlockType | undefined) => void;
	setSelectionState: (state: SelectionStateType | undefined) => void;

	// Group Selection
	selectedZotDateIndex: number | undefined;
	selectedBlockIndex: number | undefined;
	selectionIsLocked: boolean;
	hoveredMember: string | null;
	isHoveringGrid: boolean;
	selectedMembers: string[];
	isMobileDrawerOpen: boolean;
	setSelectedZotDateIndex: (index: number | undefined) => void;
	setSelectedBlockIndex: (index: number | undefined) => void;
	setSelectionIsLocked: (locked: boolean) => void;
	setHoveredMember: (member: string | null) => void;
	toggleHoverGrid: (val: boolean) => void;
	toggleSelectedMember: (memberId: string) => void;
	setSelectedMember: (members: string[]) => void;
	setIsMobileDrawerOpen: (open: boolean) => void;
	resetSelection: () => void;

	// Schedule Selection
	scheduledTimes: Set<string>;
	pendingAdds: Set<string>;
	pendingRemovals: Set<string>;
	addPendingTime: (timestamp: string) => void;
	addPendingTimeRange: (timestamps: string[]) => void;
	replaceEntireSelection: (timestamps: string[]) => void;
	commitPendingTimes: () => void;
	togglePendingTime: (timestamp: string) => void;
	clearPendingTimes: () => void;
	isScheduled: (timestamp: string) => boolean;
	hydrateScheduledTimes: (timestamps: string[]) => void;

	/** Personal import preview: ISO keys that exist on the current meeting grid (subset of a past meeting). */
	importPreviewIsoSet: Set<string> | null;
	setImportPreview: (isoStrings: readonly string[] | null) => void;
}

export const useAvailabilityStore = create<AvailabilityStore>((set, get) => ({
	// Pagination
	currentPage: 0,
	itemsPerPage: 5,
	isFirstPage: true,
	nextPage: (totalItems) =>
		set((state) => {
			const lastPage = Math.floor((totalItems - 1) / state.itemsPerPage);
			if (state.currentPage < lastPage) {
				return {
					currentPage: state.currentPage + 1,
					isFirstPage: false,
				};
			}
			return state;
		}),
	prevPage: () =>
		set((state) => {
			if (state.currentPage > 0) {
				return {
					currentPage: state.currentPage - 1,
					isFirstPage: state.currentPage - 1 === 0,
				};
			}
			return state;
		}),
	setCurrentPage: (page) =>
		set({
			currentPage: page,
			isFirstPage: page === 0,
		}),
	setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
	setIsFirstPage: (isFirstPage) => set({ isFirstPage }),

	// View
	availabilityView: "group",
	hasAvailability: false,
	setAvailabilityView: (view) => set({ availabilityView: view }),
	setHasAvailability: (hasAvailability) => set({ hasAvailability }),

	// Best Times
	enabled: false,
	setEnabled: (enabled) => set({ enabled }),

	// Block Selection
	startBlockSelection: undefined,
	endBlockSelection: undefined,
	selectionState: undefined,
	setStartBlockSelection: (block) => set({ startBlockSelection: block }),
	setEndBlockSelection: (block) => set({ endBlockSelection: block }),
	setSelectionState: (state) => set({ selectionState: state }),

	// Group Selection
	selectedZotDateIndex: undefined,
	selectedBlockIndex: undefined,
	selectionIsLocked: false,
	hoveredMember: null,
	isHoveringGrid: false,
	selectedMembers: [],
	isMobileDrawerOpen: false,
	setSelectedZotDateIndex: (index) => set({ selectedZotDateIndex: index }),
	setSelectedBlockIndex: (index) => set({ selectedBlockIndex: index }),
	setSelectionIsLocked: (locked) => set({ selectionIsLocked: locked }),
	setHoveredMember: (member) => set({ hoveredMember: member }),
	toggleHoverGrid: (val) => set({ isHoveringGrid: val }),
	setSelectedMember: (members) => set({ selectedMembers: members }),
	toggleSelectedMember: (memberId) =>
		set((state) => {
			const isSelected = state.selectedMembers.includes(memberId);
			if (isSelected) {
				return {
					selectedMembers: state.selectedMembers.filter(
						(id) => id !== memberId,
					),
				};
			} else {
				return {
					selectedMembers: [...state.selectedMembers, memberId],
				};
			}
		}),
	setIsMobileDrawerOpen: (open) => set({ isMobileDrawerOpen: open }),
	resetSelection: () =>
		set({
			selectedZotDateIndex: undefined,
			selectedBlockIndex: undefined,
			hoveredMember: null,
		}),

	// Schedule Selection
	scheduledTimes: new Set<string>(),
	pendingAdds: new Set<string>(),
	pendingRemovals: new Set<string>(),

	addPendingTime: (timestamp: string) => {
		set((state) => {
			const newPending = new Set(state.pendingAdds);
			newPending.add(timestamp);
			return { pendingAdds: newPending };
		});
	},

	addPendingTimeRange: (timestamps: string[]) => {
		set((state) => {
			const newPending = new Set(state.pendingAdds);
			timestamps.forEach((ts) => {
				newPending.add(ts);
			});
			return { pendingAdds: newPending };
		});
	},

	replaceEntireSelection: (timestamps: string[]) => {
		set((state) => {
			const newSelection = new Set(timestamps);
			const pendingRemovals = new Set<string>();
			const pendingAdds = new Set<string>();

			for (const ts of state.scheduledTimes) {
				if (!newSelection.has(ts)) {
					pendingRemovals.add(ts);
				}
			}
			for (const ts of newSelection) {
				if (!state.scheduledTimes.has(ts)) {
					pendingAdds.add(ts);
				}
			}
			return { pendingAdds, pendingRemovals };
		});
	},

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

	togglePendingTime: (timestamp: string) => {
		set((state) => {
			const newPending = new Set(state.pendingAdds);
			const newPendingRemovals = new Set(state.pendingRemovals || []);

			if (state.scheduledTimes.has(timestamp)) {
				if (newPendingRemovals.has(timestamp)) {
					newPendingRemovals.delete(timestamp);
				} else {
					newPendingRemovals.add(timestamp);
				}
			} else {
				if (newPending.has(timestamp)) {
					newPending.delete(timestamp);
				} else {
					newPending.add(timestamp);
				}
			}

			return { pendingAdds: newPending, pendingRemovals: newPendingRemovals };
		});
	},

	clearPendingTimes: () =>
		set({
			pendingAdds: new Set(),
			pendingRemovals: new Set(),
		}),

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
			pendingAdds: new Set(),
			pendingRemovals: new Set(),
		});
	},

	importPreviewIsoSet: null,
	setImportPreview: (isoStrings) =>
		set({
			importPreviewIsoSet: isoStrings === null ? null : new Set(isoStrings),
		}),
}));
