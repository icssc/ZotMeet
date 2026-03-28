import { getNotificationsByMemberId } from "@data/user/queries";
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
		<MuiAppShell user={user} notifications={notifications}>
			{children}
		</MuiAppShell>
	);
}
