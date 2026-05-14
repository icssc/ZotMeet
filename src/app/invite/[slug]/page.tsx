import { acceptInvite } from "@actions/group/invite/create/action";
import { getExistingInvite } from "@data/groups/invite-queries";
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

	// get group id from token
	const group = await getExistingInvite(slug);

	const groupExists = await getExistingGroup(group.groupId).catch(() => null);
	if (!groupExists) {
		notFound();
	}

	const userInGroup = await isUserInGroup({
		userId: session.user.id,
		groupId: slug,
	});
	if (!userInGroup) {
		await acceptInvite(params.slug);
		redirect(`/groups/${group.groupId}`);
	}
}
