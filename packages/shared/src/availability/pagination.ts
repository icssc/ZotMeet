/**
 * Paging through a meeting's date columns. Both apps keep this state in a
 * zustand `useAvailabilityStore`; the transitions live here so the two
 * stores cannot drift. Pure — `@zotmeet/shared` has no zustand dependency —
 * so each store calls these inside its own `set`.
 */

export interface DatePaginationState {
	currentPage: number;
	itemsPerPage: number;
	isFirstPage: boolean;
}

/** `Math.floor((total - 1) / perPage)`; `0` for an empty list. */
export function lastPageIndex(
	totalItems: number,
	itemsPerPage: number,
): number {
	return Math.floor((totalItems - 1) / itemsPerPage);
}

/** The next page, or the same state when already on the last page. */
export function nextPageState(
	state: DatePaginationState,
	totalItems: number,
): DatePaginationState {
	if (state.currentPage >= lastPageIndex(totalItems, state.itemsPerPage)) {
		return state;
	}
	return { ...state, currentPage: state.currentPage + 1, isFirstPage: false };
}

/** The previous page, or the same state when already on the first. */
export function prevPageState(state: DatePaginationState): DatePaginationState {
	if (state.currentPage <= 0) return state;
	const currentPage = state.currentPage - 1;
	return { ...state, currentPage, isFirstPage: currentPage === 0 };
}

/** Jump to `page`. */
export function pageState(
	state: DatePaginationState,
	page: number,
): DatePaginationState {
	return { ...state, currentPage: page, isFirstPage: page === 0 };
}
