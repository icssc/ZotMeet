import { notFound, redirect } from "next/navigation";
import { AcceptGroupInvite } from "@/components/groups/accept-group-invite";
import { GroupMemberList } from "@/components/groups/group-member-list";
import type { SelectGroupInvite } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { getExistingInvite } from "@/server/data/groups/invite-queries";
import {
	getExistingGroup,
	getGroupMeetingsWithStats,
	getUsersInGroup,
	isGroupAdmin,
	isUserInGroup,
} from "@/server/data/groups/queries";

interface PageProps {
	params: Promise<{
		slug: string;
	}>;
}

export default async function Page(props: PageProps) {
	const params = await props.params;
	const { slug } = params;

	if (!slug) {
		notFound();
	}

	const session = await getCurrentSession();
	if (!session?.user) {
		redirect("/auth/login/google");
	}

	let invite: SelectGroupInvite;
	try {
		invite = await getExistingInvite(slug);
	} catch {
		notFound();
	}

	if (invite.expiresAt && invite.expiresAt < new Date()) {
		notFound();
	}

	const group = await getExistingGroup(invite.groupId).catch(() => null);
	if (!group) {
		notFound();
	}

	const userInGroup = await isUserInGroup({
		userId: session.user.id,
		groupId: invite.groupId,
	});

	if (!userInGroup) {
		return (
			<AcceptGroupInvite
				source="invite_link"
				inviteToken={slug}
				groupId={invite.groupId}
				groupName={group.name}
				groupIcon={group.icon}
			/>
		);
	}

	const [members, isAdmin] = await Promise.all([
		getUsersInGroup(invite.groupId),
		isGroupAdmin({ userId: session.user.id, groupId: invite.groupId }),
	]);
	const meetingsWithStats = await getGroupMeetingsWithStats(
		invite.groupId,
		members.length,
		session.user.memberId,
	);

	return (
		<div className="px-8 py-8">
			<GroupMemberList
				group={group}
				members={members}
				meetings={meetingsWithStats}
				isAdmin={isAdmin}
				currentUserId={session.user.id}
				currentMemberId={session.user.memberId}
			/>
		</div>
	);
}
