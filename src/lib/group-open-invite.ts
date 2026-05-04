/** Query param on `/` when opening the group-invite accept dialog from a link. */
export const GROUP_INVITE_QUERY_PARAM = "groupInvite";

export function homePathWithGroupInviteToken(inviteToken: string) {
	const q = new URLSearchParams({ [GROUP_INVITE_QUERY_PARAM]: inviteToken });
	return `/?${q.toString()}`;
}
