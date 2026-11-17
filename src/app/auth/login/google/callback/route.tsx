import { cookies } from "next/headers";
import { handleOAuthCallback } from "@/lib/auth/handle-oauth-callback";

export async function GET(request: Request): Promise<Response> {
	const cookieStore = await cookies();
	return handleOAuthCallback(request, "google", cookieStore);
}
