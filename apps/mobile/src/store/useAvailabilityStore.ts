import { nextPageState, pageState, prevPageState } from "@zotmeet/shared";
import { create } from "zustand";

/**
 * Native counterpart to the web app's `src/store/useAvailabilityStore.ts`,
 * starting with just its pagination slice: which page of dates the
 * availability table shows. The web's view / paint-mode / import-preview
 * state joins it here as those features arrive on mobile.
 */
interface AvailabilityStore {
	currentPage: number;
	itemsPerPage: number;
	isFirstPage: boolean;
	nextPage: (totalItems: number) => void;
	prevPage: () => void;
	setCurrentPage: (page: number) => void;
	setItemsPerPage: (itemsPerPage: number) => void;
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
}));
