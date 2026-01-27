import { getCurrentSession } from "@/lib/auth";
import { MuiAppShell } from "./mui-app-shell";

type AppShellWrapperProps = {
	children: React.ReactNode;
};

export default async function AppShellWrapper({
	children,
}: AppShellWrapperProps) {
	const { user } = await getCurrentSession();

	return <MuiAppShell user={user}>{children}</MuiAppShell>;
}
