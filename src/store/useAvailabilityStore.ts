import { create } from "zustand";
import type { PaintMode } from "@/lib/availability/paint-selection";
import type {
	AvailabilityView,
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
	selectedMembers: string[];
	isMobileDrawerOpen: boolean;
	setHoveredMember: (member: string | null) => void;
	toggleSelectedMember: (memberId: string) => void;
	setSelectedMember: (members: string[]) => void;
	setIsMobileDrawerOpen: (open: boolean) => void;
	resetSelection: () => void;

	// Schedule Selection
	scheduledTimes: Set<string>;
	hasHydratedScheduledTimes: boolean;
	pendingAdds: Set<string>;
	pendingRemovals: Set<string>;
	replaceEntireSelection: (timestamps: string[]) => void;
	commitPendingTimes: () => void;
	clearPendingTimes: () => void;
	isScheduled: (timestamp: string) => boolean;
	hydrateScheduledTimes: (timestamps: string[]) => void;

	/** Personal import preview split by source availability type. */
	importPreview: {
		availableIsoSet: Set<string>;
		ifNeededIsoSet: Set<string>;
	} | null;
	setImportPreview: (
		preview: {
			availableIsoStrings: readonly string[];
			ifNeededIsoStrings: readonly string[];
		} | null,
	) => void;
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
				importPreview: null,
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
	selectedMembers: [],
	isMobileDrawerOpen: false,
	setHoveredMember: (member) => set({ hoveredMember: member }),
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
			}
			return {
				selectedMembers: [...state.selectedMembers, memberId],
			};
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

	importPreview: null,
	setImportPreview: (preview) =>
		set({
			importPreview:
				preview === null
					? null
					: {
							availableIsoSet: new Set(preview.availableIsoStrings),
							ifNeededIsoSet: new Set(preview.ifNeededIsoStrings),
						},
		}),
}));
