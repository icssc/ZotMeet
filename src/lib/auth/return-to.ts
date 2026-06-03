/** Validates and normalizes a post-auth redirect target (path + query only). */
export function safeReturnTo(value: string | null | undefined): string | null {
	if (!value) {
		return null;
	}

	if (value.startsWith("http://") || value.startsWith("https://")) {
		try {
			const url = new URL(value);
			return safeReturnTo(`${url.pathname}${url.search}`);
		} catch {
			return null;
		}
	}

	if (!value.startsWith("/") || value.startsWith("//")) {
		return null;
	}

	if (value.startsWith("/auth/login")) {
		return null;
	}

	return value;
}

export function loginPathWithReturnTo(returnTo?: string | null): string {
	const safe = safeReturnTo(returnTo);
	if (!safe) {
		return "/auth/login";
	}
	return `/auth/login?returnTo=${encodeURIComponent(safe)}`;
}

export function oauthLoginPath(
	provider: "google" | "apple",
	returnTo?: string | null,
	options?: { selectAccount?: boolean },
): string {
	const params = new URLSearchParams();
	const safe = safeReturnTo(returnTo);
	if (safe) {
		params.set("returnTo", safe);
	}
	if (options?.selectAccount) {
		params.set("selectAccount", "1");
	}
	const query = params.toString();
	const base = `/auth/login/${provider}`;
	return query ? `${base}?${query}` : base;
}
