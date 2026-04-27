import { ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { GroupSettingsForm } from "@/components/groups/group-settings-form";
import { getCurrentSession } from "@/lib/auth";
import { getExistingGroup, isUserInGroup } from "@/server/data/groups/queries";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function GroupSettingsPage(props: PageProps) {
	const params = await props.params;
	const { id } = params;

	if (!id) {
		notFound();
	}

	const session = await getCurrentSession();
	if (!session?.user) {
		redirect("/auth/login/google");
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

	return (
		<div className="px-5 py-6 md:hidden">
			<div className="mb-4 flex items-center gap-2">
				<Link href={`/groups/${id}`}>
					<IconButton>
						<ArrowBack className="size-5" />
					</IconButton>
				</Link>
				<h1 className="font-semibold text-xl">Group Settings</h1>
			</div>

			<GroupSettingsForm group={group} />
		</div>
	);
}
