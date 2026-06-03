/** Path-only post-logout target; rejects protocol-relative and off-site URLs. */
function safePostLogoutPath(path: string): string {
	let normalized = path;

	if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
		try {
			const parsed = new URL(normalized);
			normalized = `${parsed.pathname}${parsed.search}`;
		} catch {
			return "/";
		}
	}

	if (!normalized.startsWith("/") || normalized.startsWith("//")) {
		return "/";
	}

	return normalized;
}

/** Builds the ICSSC OIDC end-session URL after clearing the local ZotMeet session. */
export function getOidcLogoutUrl(postLogoutPath = "/"): string {
	const issuer = process.env.OIDC_ISSUER_URL;
	if (!issuer) {
		throw new Error("Missing OIDC_ISSUER_URL env var.");
	}

	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
	const postLogoutRedirect = new URL(
		safePostLogoutPath(postLogoutPath),
		baseUrl,
	).toString();

	const logoutUrl = new URL(`${issuer}/logout`);
	logoutUrl.searchParams.set("post_logout_redirect_uri", postLogoutRedirect);
	return logoutUrl.toString();
}
