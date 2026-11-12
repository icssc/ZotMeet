import type { GroupListItem } from "./schema";

export const GROUPS_LIST_FILTERS = ["all", "created", "upcoming"] as const;
export type GroupsListFilter = (typeof GROUPS_LIST_FILTERS)[number];

export const GROUPS_LIST_FILTER_LABELS: Record<GroupsListFilter, string> = {
	all: "All",
	created: "By You",
	upcoming: "Upcoming",
};

export type GroupForList = Pick<
	GroupListItem,
	"name" | "isCreator" | "upcomingMeetingName" | "needsAvailability"
>;

export function buildGroupsListModel<T extends GroupForList>({
	groups,
	search,
	filter,
}: {
	groups: T[];
	search: string;
	filter: GroupsListFilter;
}): {
	actionRequired: T[];
	rest: T[];
	isEmpty: boolean;
	isFilteredEmpty: boolean;
} {
	const query = search.trim().toLowerCase();
	const filtered = groups.filter((group) => {
		if (query && !group.name.toLowerCase().includes(query)) return false;
		if (filter === "created") return group.isCreator;
		if (filter === "upcoming") return Boolean(group.upcomingMeetingName);
		return true;
	});

	const isEmpty = groups.length === 0;
	return {
		actionRequired: filtered.filter((group) => group.needsAvailability),
		rest: filtered.filter((group) => !group.needsAvailability),
		isEmpty,
		isFilteredEmpty: !isEmpty && filtered.length === 0,
	};
}
