import { notFound, redirect } from "next/navigation";
import { homePathWithGroupInviteToken } from "@/lib/group-open-invite";
import { getExistingInvite } from "@/server/data/groups/invite-queries";

interface PageProps {
	params: Promise<{
		slug: string;
	}>;
}

export default async function Page(props: PageProps) {
	const { slug } = await props.params;

	if (!slug) {
		notFound();
	}

	try {
		const invite = await getExistingInvite(slug);
		if (invite.expiresAt && invite.expiresAt < new Date()) {
			notFound();
		}
	} catch {
		notFound();
	}

	redirect(homePathWithGroupInviteToken(slug));
}
