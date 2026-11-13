import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest): Promise<NextResponse> {
	if (request.method === "GET") {
		return NextResponse.next();
	}

	// `/api/*` is the Expo app's surface. Its handlers authenticate only via
	// `Authorization: Bearer` (see `src/lib/auth/bearer.ts`) and never read
	// cookies, so the Origin check below — a defence against cookie-carrying
	// cross-site requests — does not apply. Native `fetch` sends no Origin at
	// all, and a CORS preflight `OPTIONS` carries no Authorization header, so
	// the exemption has to be by path rather than by header.
	if (request.nextUrl.pathname.startsWith("/api/")) {
		return NextResponse.next();
	}

	// Prevent CSRF attacks from route handlers
	const originHeader = request.headers.get("Origin");
	const hostHeader = request.headers.get("Host");

	if (originHeader === null || hostHeader === null) {
		return new NextResponse(null, {
			status: 403,
		});
	}

	let origin: URL;

	try {
		origin = new URL(originHeader);
	} catch {
		return new NextResponse(null, {
			status: 403,
		});
	}

	if (origin.host !== hostHeader) {
		return new NextResponse(null, {
			status: 403,
		});
	}

	return NextResponse.next();
}
