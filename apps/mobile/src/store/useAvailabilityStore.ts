import type { AvailabilityView, PaintMode } from "@zotmeet/shared";
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
