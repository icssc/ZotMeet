/** Trim and collapse internal whitespace for user-facing search input. */
export function normalizeSearchQuery(query: string): string {
	return query.trim().replace(/\s+/g, " ");
}

/** Escape `\`, `%`, and `_` so they match literally in SQL LIKE/ILIKE. */
export function escapeLikePattern(query: string): string {
	return query.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

/** Builds a `%term%` ILIKE pattern, or `null` when the normalized query is too short. */
export function toIlikeContainsPattern(query: string): string | null {
	const normalized = normalizeSearchQuery(query);
	if (normalized.length < 2) return null;
	return `%${escapeLikePattern(normalized)}%`;
}
