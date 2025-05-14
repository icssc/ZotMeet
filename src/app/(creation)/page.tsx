import { Creation } from "@/components/creation/creation";
import { getCurrentSession } from "@/lib/auth";

export default async function Page() {
    const { session, user } = await getCurrentSession();
    const isUserLoggedIn = !!session && !!user;
    return <Creation isUserLoggedIn={isUserLoggedIn} />;
}
