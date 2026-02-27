import { notFound, redirect } from "next/navigation";
import { GroupsPage } from "@/components/groups/groups-page";
import { getCurrentSession } from "@/lib/auth";
import { getGroupsWithDetails } from "@/server/data/groups/queries";

export default async function Page() {
	const session = await getCurrentSession();
	if (!session?.user) {
		redirect("/");
	}

	const memberId = session.user.memberId;
	if (!memberId) {
		notFound();
	}

	const groups = await getGroupsWithDetails(session.user.id, memberId);

	return (
		<div className="px-8 py-8">
			<GroupsPage groups={groups} />
		</div>
	);
}
