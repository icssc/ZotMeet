import { cookies } from "next/headers";
import { toast } from "sonner";

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

	const toastString = `In cookies.ts: [COOKIE SET] session: ${token} expiresAt: ${expiresAt.toISOString()} Path:/ SameSite:lax Secure: ${process.env.NODE_ENV === "production"}`;

	toast.success(toastString);
}

export async function deleteSessionTokenCookie() {
	const cookieStore = await cookies();

	cookieStore.delete({ name: "session", path: "/" });
	cookieStore.delete({ name: "session", path: "/", maxAge: 0 });

	cookieStore.set("session", "", {
		httpOnly: true,
		sameSite: "lax",
		// TODO: check for deployment
		secure: process.env.NODE_ENV === "production",
		maxAge: 0,
		path: "/",
	});
}
