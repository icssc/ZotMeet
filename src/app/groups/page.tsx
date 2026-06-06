import { notFound, redirect } from "next/navigation";
import { GroupsPage } from "@/components/groups/groups-page";
import { getCurrentSession } from "@/lib/auth";
import { loginPathWithReturnTo } from "@/lib/auth/return-to";
import { getGroupsWithDetails } from "@/server/data/groups/queries";
import { getNotificationsByMemberId } from "@/server/data/user/queries";

export default async function Page() {
	const session = await getCurrentSession();
	if (!session?.user) {
		redirect(loginPathWithReturnTo("/groups"));
	}

	const memberId = session.user.memberId;
	if (!memberId) {
		notFound();
	}

	const [groups, notifications] = await Promise.all([
		getGroupsWithDetails(session.user.id, memberId),
		getNotificationsByMemberId(memberId),
	]);

	return (
		<div className="px-4 py-8 sm:px-8">
			<GroupsPage groups={groups} notifications={notifications} />
		</div>
	);
}
