import { notFound } from "next/navigation";
import React from "react";
import { CreateGroup } from "@/components/summary/CreateGroup";
import { getCurrentSession } from "@/lib/auth";

interface PageProps {
	params: Promise<{
		slug: string;
	}>;
}

export async function generateMetadata(props: PageProps) {
	const params = await props.params;
	const { slug } = params;

	return {};
}

export default async function Page(props: PageProps) {
	const params = await props.params;
	const { slug } = params;

	if (!slug) {
		notFound();
	}

	const session = await getCurrentSession();
	const userAvailability = null;

	//check if user in session (unfinished)
	if (session.user !== null) {
		const userId = session.user.memberId;
	}

	return (
		<div className="p-8">
			<p>hello, this is the homepage for groups</p>
			<CreateGroup />
		</div>
	);
}
