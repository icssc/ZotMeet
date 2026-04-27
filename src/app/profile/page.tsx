import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { notFound, redirect } from "next/navigation";
import { NotificationPreferences } from "@/components/profile/notification-preferences";
import { ProfileSettings } from "@/components/profile/profile-settings";
import { getCurrentSession } from "@/lib/auth";

export default async function ProfilePage() {
	const session = await getCurrentSession();
	if (!session?.user) {
		redirect("/auth/login/google");
	}

	if (!session.user.memberId) {
		notFound();
	}

	return (
		<Box sx={{ px: 8, py: 8 }}>
			<Typography variant="h4" className="hidden md:block">
				Settings
			</Typography>

			<Typography variant="h4" className="block md:hidden">
				Profile
			</Typography>

			<Box className="mt-8">
				<ProfileSettings user={session.user} />
			</Box>

			<NotificationPreferences
				emailNotifications={session.user.emailNotifications}
			/>
		</Box>
	);
}
