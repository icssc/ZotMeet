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
	currentPage: 0,
	itemsPerPage: 2,
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
}));
