import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { GroupSettingsForm } from "@/components/groups/group-settings-form";
import { getCurrentSession } from "@/lib/auth";
import { loginPathWithReturnTo } from "@/lib/auth/return-to";
import {
	getExistingGroup,
	isGroupAdmin,
	isUserInGroup,
} from "@/server/data/groups/queries";

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
		redirect(loginPathWithReturnTo(`/groups/${id}/settings`));
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

	const admin = await isGroupAdmin({
		userId: session.user.id,
		groupId: id,
	});
	if (!admin) {
		redirect(`/groups/${id}`);
	}

	return (
		<div className="px-5 py-6">
			<div className="mb-4 flex items-center gap-2">
				<Link
					href={`/groups/${id}`}
					className="inline-flex cursor-pointer items-center justify-center rounded-md p-2"
				>
					<ArrowBack className="size-5" />
				</Link>
				<h1 className="font-semibold text-xl">Group Settings</h1>
			</div>

			<GroupSettingsForm group={group} />
		</div>
	);
}
