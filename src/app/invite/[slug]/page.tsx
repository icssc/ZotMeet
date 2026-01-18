import { notFound } from "next/navigation";
import { InviteDecision } from "@/components/groups/invite-decision";
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
	try {
		await getExistingInvite(slug);
	} catch (_error) {
		notFound();
	}

	// Check if user in session
	const session = await getCurrentSession();
	if (!session) {
		notFound();
	}

	return (
		<div>
			<InviteDecision inviteToken={slug} />
		</div>
	);
}
