import { redirect } from "next/navigation";
import { ProfileSettings } from "@/components/profile/profile-settings";
import { getCurrentSession } from "@/lib/auth";

export default async function ProfilePage() {
	const { user } = await getCurrentSession();
	if (!user) {
		redirect("/");
	}

	return (
		<div className="px-8 py-8">
			<h1 className="font-figtree font-semibold text-3xl">Profile Settings</h1>

			<div className="mt-6">
				<div className="flex gap-6 border-gray-200 border-b">
					<span className="flex items-center gap-1.5 border-[#f1658c] border-b-2 pb-3 font-medium text-[#f1658c] text-sm">
						<span>★</span> Profile
					</span>
				</div>
				<div className="mt-8">
					<ProfileSettings user={user} />
				</div>
			</div>
		</div>
	);
}
