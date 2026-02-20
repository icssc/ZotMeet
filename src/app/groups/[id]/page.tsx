import { notFound, redirect } from "next/navigation";
import { GroupMemberList } from "@/components/groups/group-member-list";
import { getCurrentSession } from "@/lib/auth";
import {
	getExistingGroup,
	getGroupMeetingsWithStats,
	getUsersInGroup,
	isGroupAdmin,
	isUserInGroup,
} from "@/server/data/groups/queries";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function Page(props: PageProps) {
	const params = await props.params;
	const { id } = params;

	if (!id) {
		notFound();
	}

	const session = await getCurrentSession();
	if (!session?.user) {
		redirect("/");
	}

	const group = await getExistingGroup(id).catch(() => null);
	if (!group) {
		notFound();
	}

	const userInGroup = await isUserInGroup({
		userId: session.user.id,
		groupId: id,
	});
	if (!userInGroup) {
		redirect("/groups");
	}

	const [members, isAdmin] = await Promise.all([
		getUsersInGroup(id),
		isGroupAdmin({ userId: session.user.id, groupId: id }),
	]);
	const meetingsWithStats = await getGroupMeetingsWithStats(id, members.length);

	return (
		<div className="px-8 py-8">
			<GroupMemberList
				group={group}
				members={members}
				meetings={meetingsWithStats}
				isAdmin={isAdmin}
				currentUserId={session.user.id}
			/>
		</div>
	);
}
