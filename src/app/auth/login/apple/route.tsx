import { cookies, headers } from "next/headers";
import { startOAuthLogin } from "@/lib/auth/start-oauth-login";

export async function GET(): Promise<Response> {
	const cookieStore = await cookies();
	const headersList = await headers();
	return startOAuthLogin("apple", cookieStore, headersList);
}
