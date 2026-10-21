import { getNotificationsByMemberId } from "@data/user/queries";
import { PostHogIdentify } from "@/components/analytics/posthog-identify";
import { getCurrentSession } from "@/lib/auth";
import { MuiAppShell } from "./mui-app-shell";

type AppShellWrapperProps = {
	children: React.ReactNode;
};

export default async function AppShellWrapper({
	children,
}: AppShellWrapperProps) {
	const { user } = await getCurrentSession();
	const notifications = user
		? await getNotificationsByMemberId(user.memberId)
		: [];
	return (
		<>
			<PostHogIdentify memberId={user?.memberId ?? null} />
			<MuiAppShell user={user} notifications={notifications}>
				{children}
			</MuiAppShell>
		</>
	);
}
