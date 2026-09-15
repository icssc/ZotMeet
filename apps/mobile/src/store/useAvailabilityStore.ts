import {
	type AvailabilityView,
	nextPageState,
	type PaintMode,
	pageState,
	prevPageState,
} from "@zotmeet/shared";
import { create } from "zustand";

/**
 * Native counterpart to the web app's `src/store/useAvailabilityStore.ts`.
 * Pagination plus the personal-edit slice (view + paint mode) so Add
 * Availability can swap the island and grid the way the web mobile layout does.
 */
interface AvailabilityStore {
	currentPage: number;
	itemsPerPage: number;
	isFirstPage: boolean;
	nextPage: (totalItems: number) => void;
	prevPage: () => void;
	setCurrentPage: (page: number) => void;
	setItemsPerPage: (itemsPerPage: number) => void;

	availabilityView: AvailabilityView;
	setAvailabilityView: (view: AvailabilityView) => void;

	paintMode: PaintMode;
	setPaintMode: (mode: PaintMode) => void;
}

export const useAvailabilityStore = create<AvailabilityStore>((set) => ({
	// Pagination — two date columns per page, the web's mobile breakpoint.
	// Transitions come from `@zotmeet/shared`, the same ones the web store uses.
	currentPage: 0,
	itemsPerPage: 2,
	isFirstPage: true,
	nextPage: (totalItems) => set((state) => nextPageState(state, totalItems)),
	prevPage: () => set((state) => prevPageState(state)),
	setCurrentPage: (page) => set((state) => pageState(state, page)),
	setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),

	availabilityView: "group",
	setAvailabilityView: (view) =>
		set((state) => {
			if (state.availabilityView === view) return state;
			return {
				availabilityView: view,
				paintMode: "available",
			};
		}),

	paintMode: "available",
	setPaintMode: (mode) => set({ paintMode: mode }),
}));
