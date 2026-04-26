import { create } from "zustand";
import type { PaintMode } from "@/lib/availability/paint-selection";
import type { SelectionStateType } from "@/lib/types/availability";

type AvailabilityView = "group" | "personal" | "schedule";

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

	availabilityView: AvailabilityView;
	hasAvailability: boolean;
	setAvailabilityView: (view: AvailabilityView) => void;
	setHasAvailability: (hasAvailability: boolean) => void;

	// Best Times
	enabled: boolean;
	setEnabled: (v: boolean) => void;

	draftRange: SelectionStateType | undefined;
	hoverRange: SelectionStateType | undefined;
	committedRange: SelectionStateType | undefined;
	setDraftRange: (range: SelectionStateType | undefined) => void;
	setHoverRange: (range: SelectionStateType | undefined) => void;
	setCommittedRange: (range: SelectionStateType | undefined) => void;
	paintMode: PaintMode;
	setPaintMode: (mode: PaintMode) => void;

	hoveredMember: string | null;
	isHoveringGrid: boolean;
	selectedMembers: string[];
	isMobileDrawerOpen: boolean;
	setHoveredMember: (member: string | null) => void;
	toggleHoverGrid: (val: boolean) => void;
	toggleSelectedMember: (memberId: string) => void;
	setSelectedMember: (members: string[]) => void;
	setIsMobileDrawerOpen: (open: boolean) => void;
	resetSelection: () => void;

	// Schedule Selection
	scheduledTimes: Set<string>;
	hasHydratedScheduledTimes: boolean;
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
	setAvailabilityView: (view) =>
		set((state) => {
			if (state.availabilityView === view) return {};
			return {
				availabilityView: view,
				draftRange: undefined,
				hoverRange: undefined,
				committedRange: undefined,
				isMobileDrawerOpen: false,
				paintMode: "available",
			};
		}),
	setHasAvailability: (hasAvailability) => set({ hasAvailability }),

	// Best Times
	enabled: false,
	setEnabled: (enabled) => set({ enabled }),

	// Selection ranges
	draftRange: undefined,
	hoverRange: undefined,
	committedRange: undefined,
	setDraftRange: (range) => set({ draftRange: range }),
	setHoverRange: (range) => set({ hoverRange: range }),
	setCommittedRange: (range) => set({ committedRange: range }),

	// Paint mode
	paintMode: "available",
	setPaintMode: (mode) => set({ paintMode: mode }),

	// Group ancillary state
	hoveredMember: null,
	isHoveringGrid: false,
	selectedMembers: [],
	isMobileDrawerOpen: false,
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
			draftRange: undefined,
			hoverRange: undefined,
			committedRange: undefined,
			hoveredMember: null,
		}),

	// Schedule Selection
	scheduledTimes: new Set<string>(),
	hasHydratedScheduledTimes: false,
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
				hasHydratedScheduledTimes: true,
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
			hasHydratedScheduledTimes: true,
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
