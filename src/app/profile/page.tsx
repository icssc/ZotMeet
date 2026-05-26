import { notFound, redirect } from "next/navigation";
import { NotificationsPanel } from "@/components/profile/notifications-panel";
import { ProfileSettings } from "@/components/profile/profile-settings";
import { ProfileSidebarLayout } from "@/components/profile/profile-sidebar-layout";
import { getCurrentSession } from "@/lib/auth";
import { toNotificationPrefs } from "@/lib/notification/types";
import { getNotificationPreferences } from "@/server/data/user/queries";

export default async function ProfilePage() {
	const session = await getCurrentSession();
	if (!session?.user) {
		redirect("/auth/login");
	}

	if (!session.user.memberId) {
		notFound();
	}

	const notifPrefs = await getNotificationPreferences(session.user.memberId);

	return (
		<ProfileSidebarLayout
			panels={{
				"edit-profile": <ProfileSettings user={session.user} />,
				notifications: (
					<NotificationsPanel
						initialPreferences={toNotificationPrefs(notifPrefs)}
					/>
				),
			}}
		/>
	);
}
