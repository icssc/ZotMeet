import { notFound, redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { ProfileContent } from "./profile-content";

export default async function ProfilePage() {
	const session = await getCurrentSession();
	if (!session?.user) {
		redirect("/auth/login/google");
	}

	if (!session.user.memberId) {
		notFound();
	}

	return <ProfileContent />;
}
