import { Creation } from "@/components/creation/creation";
import { getCurrentSession } from "@/lib/auth";

export default async function Page() {
	const { user } = await getCurrentSession();

	return <Creation user={user} />;
}
