import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { notFound, redirect } from "next/navigation";
import { ProfileSettings } from "@/components/profile/profile-settings";
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

	return (
		<Box sx={{ px: 8, py: 8 }}>
			<Typography
				variant="h4"
				sx={{ fontWeight: 600, fontFamily: "Figtree, sans-serif" }}
			>
				Settings
			</Typography>

			<Box sx={{ mt: 8 }}>
				<ProfileSettings user={session.user} />
			</Box>
			<Box sx={{ mt: 8, display: { md: "none" } }}>
				<ProfileContent />
			</Box>
		</Box>
	);
}
