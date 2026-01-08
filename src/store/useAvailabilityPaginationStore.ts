import { create } from "zustand";

interface AvailabilityPaginationStore {
	currentPage: number;
	itemsPerPage: number;
	isFirstPage: boolean;
	nextPage: (totalItems: number) => void;
	prevPage: () => void;
	setCurrentPage: (page: number) => void;
	setItemsPerPage: (itemsPerPage: number) => void;
	setIsFirstPage: (isFirstPage: boolean) => void;
}

export const useAvailabilityPaginationStore =
	create<AvailabilityPaginationStore>((set) => ({
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
			set((state) => ({
				currentPage: state.currentPage - 1,
				isFirstPage: state.currentPage - 1 === 0,
			})),
		setCurrentPage: (page) =>
			set({
				currentPage: page,
				isFirstPage: page === 0,
			}),
		setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
		setIsFirstPage: (isFirstPage) => set({ isFirstPage }),
	}));
