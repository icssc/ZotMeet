import { notFound, redirect } from "next/navigation";
import { AcceptGroupInvite } from "@/components/groups/accept-group-invite";
import type { SelectGroupInvite } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { loginPathWithReturnTo } from "@/lib/auth/return-to";
import { getExistingInvite } from "@/server/data/groups/invite-queries";
import { getExistingGroup, isUserInGroup } from "@/server/data/groups/queries";

interface PageProps {
	params: Promise<{
		slug: string;
	}>;
}

export default async function Page(props: PageProps) {
	const params = await props.params;
	const { slug } = params;

	const session = await getCurrentSession();
	if (!session?.user) {
		redirect(loginPathWithReturnTo(`/invite/${slug}`));
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

	redirect(`/groups/${invite.groupId}`);
}
