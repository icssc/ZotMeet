import { Creation } from "@/components/creation/creation";
import { Landing } from "@/components/landing/landing";
import { getCurrentSession } from "@/lib/auth";

export default async function Page() {
	const { user } = await getCurrentSession();
	return user ? <Creation user={user} /> : <Landing />;
}
