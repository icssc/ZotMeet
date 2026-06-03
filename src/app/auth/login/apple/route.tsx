import { cookies, headers } from "next/headers";
import { startOAuthLogin } from "@/lib/auth/start-oauth-login";

export async function GET(request: Request): Promise<Response> {
	const cookieStore = await cookies();
	const headersList = await headers();
	const url = new URL(request.url);
	const returnTo = url.searchParams.get("returnTo");
	const selectAccount = url.searchParams.get("selectAccount") === "1";
	return startOAuthLogin("apple", cookieStore, headersList, returnTo, {
		selectAccount,
	});
}
