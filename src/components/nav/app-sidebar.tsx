import { SidebarComponent } from "@/components/nav/app-nav";
import { getCurrentSession } from "@/lib/auth";

export default async function AppSidebar() {
	const { user } = await getCurrentSession();

	return <SidebarComponent user={user} />;
}
