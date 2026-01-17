import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { SelectGroupInvite } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { getExistingInvite } from "@/server/data/groups/invite-queries";

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

	// Check if invite exists
	let groupInvite: SelectGroupInvite;
	try {
		groupInvite = await getExistingInvite(slug);
	} catch (_error) {
		notFound();
	}

	// Check if user in session
	const session = await getCurrentSession();
	if (!session) {
		notFound();
	}

	return (
		<div className="p-8">
			<h1 className="mb-4 font-medium font-montserrat text-3xl">
				Invite to Group
			</h1>
			<p className="mb-4 text-gray-600">
				Invite token: {groupInvite.inviteToken}
			</p>
			<Button>Accept</Button>
			<Button>Decline</Button>
		</div>
	);
}
