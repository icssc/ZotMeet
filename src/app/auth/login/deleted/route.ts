import { redirect } from "next/navigation";

/** Post-account-deletion landing (Route Handler so redirects/cookies are allowed). */
export function GET() {
	redirect("/auth/login?deleted=1");
}
