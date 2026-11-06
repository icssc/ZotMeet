import type { GroupsListResponse } from "@zotmeet/shared";
import { apiFetch } from "@/lib/api/client";

/** Mobile counterpart to the web app's `@actions/group/*` and `@data/groups/queries`, over HTTP. */

export function getGroups(): Promise<GroupsListResponse> {
	return apiFetch<GroupsListResponse>("/api/groups");
}
