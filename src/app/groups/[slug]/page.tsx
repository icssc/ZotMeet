import { getGroupsByUserId, isUserInGroup } from "@data/groups/queries";
import { notFound, redirect } from "next/navigation";
import { CreateGroup } from "@/components/groups/create-group-popup";
import { getCurrentSession } from "@/lib/auth";

interface PageProps {
	params: Promise<{
		slug: string;
	}>;
}

export async function generateMetadata(props: PageProps) {
	const params = await props.params;
	const { slug } = params;

	if (slug === "home") {
		return {
			title: "Groups - ZotMeet",
		};
	}

	return {
		title: `Group ${slug} - ZotMeet`,
	};
}

export default async function Page(props: PageProps) {
	const params = await props.params;
	const { slug } = params;

	if (!slug) {
		notFound();
	}

	const { user } = await getCurrentSession();
	if (!user) {
		redirect("/");
	}

	const usersInGroup = await getGroupsByUserId(user.id);

	if (slug === "home") {
		return (
			<div className="relative p-8">
				<h1 className="mb-4 font-medium font-montserrat text-3xl">Groups</h1>
				<p className="mb-4 text-gray-600">Create and manage your groups</p>

				<div className="">
					<p className="">Your Groups: </p>
					{usersInGroup.map((u, index) => (
						<p key={u.id}>{u.name}</p>
					))}

					<CreateGroup email={user.email} />
				</div>
			</div>
		);
	}

	// work in progress, need to investigate why react doesn't like passing a slug to query db
	//const userInGroup = await isUserInGroup(user.id, slug);
	//if (userInGroup) {
	return (
		<div className="p-8">
			<h1 className="mb-4 font-medium font-montserrat text-3xl">
				Group: {slug}
			</h1>
			<p className="text-gray-600">
				This is the group detail page for ID: {slug}
			</p>
		</div>
	);
	//}
}
