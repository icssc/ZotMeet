import { cookies, headers } from "next/headers";
import {
	NativeOAuthLoginError,
	parseNativeOAuthLoginParams,
	startOAuthLogin,
} from "@/lib/auth/start-oauth-login";

export async function GET(request: Request): Promise<Response> {
	const cookieStore = await cookies();
	const headersList = await headers();
	const { searchParams } = new URL(request.url);
	const returnTo = searchParams.get("returnTo");

	// The Expo app opens this same route with `client=expo` and its own PKCE
	// parameters; see `nativeOAuthLoginPath` in `@zotmeet/shared`.
	let native: ReturnType<typeof parseNativeOAuthLoginParams>;
	try {
		native = parseNativeOAuthLoginParams(searchParams, "google");
	} catch (error) {
		if (error instanceof NativeOAuthLoginError) {
			return new Response(error.message, { status: 400 });
		}
		throw error;
	}

	return startOAuthLogin("google", cookieStore, headersList, returnTo, native);
}
