import {
	type CreateGroupInput,
	type CreateGroupResponse,
	createGroupSchema,
	type GroupDetailResponse,
	type GroupsListResponse,
} from "@zotmeet/shared";
import { apiFetch } from "@/lib/api/client";

/** Mobile counterpart to the web app's `@actions/group/*` and `@data/groups/queries`, over HTTP. */

export function getGroups(): Promise<GroupsListResponse> {
	return apiFetch<GroupsListResponse>("/api/groups");
}

export async function createGroup(
	input: CreateGroupInput,
): Promise<CreateGroupResponse> {
	const parsed = createGroupSchema.parse(input);
	return apiFetch<CreateGroupResponse>("/api/groups", {
		method: "POST",
		body: JSON.stringify(parsed),
	});
}

export function getGroup(id: string): Promise<GroupDetailResponse> {
	return apiFetch<GroupDetailResponse>(`/api/groups/${encodeURIComponent(id)}`);
}
