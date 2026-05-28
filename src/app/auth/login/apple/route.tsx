import { cookies, headers } from "next/headers";
import { startOAuthLogin } from "@/lib/auth/start-oauth-login";

export async function GET(request: Request): Promise<Response> {
	const cookieStore = await cookies();
	const headersList = await headers();
	const returnTo = new URL(request.url).searchParams.get("returnTo");
	return startOAuthLogin("apple", cookieStore, headersList, returnTo);
}
