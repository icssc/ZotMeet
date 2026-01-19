import { cookies } from "next/headers";

export async function setSessionTokenCookie(token: string, expiresAt: Date) {
	const cookieStore = await cookies();

	cookieStore.delete("session");

	cookieStore.set("session", token, {
		httpOnly: true,
		sameSite: "lax",
		// TODO: check for deployment
		secure: process.env.NODE_ENV === "production",
		expires: expiresAt,
		path: "/",
	});
}

export async function deleteSessionTokenCookie() {
	const cookieStore = await cookies();

	cookieStore.delete("session");

	cookieStore.set("session", "", {
		httpOnly: true,
		sameSite: "lax",
		// TODO: check for deployment
		secure: process.env.NODE_ENV === "production",
		maxAge: 0,
		path: "/",
	});
}
