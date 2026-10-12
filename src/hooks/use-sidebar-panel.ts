import { parseAsStringLiteral, useQueryState } from "nuqs";

export const SIDEBAR_PANELS = ["attendees", "rooms"] as const;
export type SidebarPanel = (typeof SIDEBAR_PANELS)[number];

/**
 * The meeting sidebar's tab, in the URL as `?panel=rooms` so it survives a
 * refresh and can be linked to.
 */
export function useSidebarPanel() {
	return useQueryState(
		"panel",
		parseAsStringLiteral(SIDEBAR_PANELS).withDefault("attendees"),
	);
}
