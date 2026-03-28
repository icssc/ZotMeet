import {
	getNotificationsByUserId,
	markNotificationAsRead,
} from "@data/user/queries";
import { getCurrentSession } from "@/lib/auth";
import { NotificationItem } from "@/lib/auth/user";
import { MuiAppShell } from "./mui-app-shell";

type AppShellWrapperProps = {
	children: React.ReactNode;
};

export default async function AppShellWrapper({
	children,
}: AppShellWrapperProps) {
	const { user } = await getCurrentSession();
	const notifications = user
		? await getNotificationsByUserId(user.memberId)
		: [];
	return (
		<MuiAppShell user={user} notifications={notifications}>
			{children}
		</MuiAppShell>
	);
}
