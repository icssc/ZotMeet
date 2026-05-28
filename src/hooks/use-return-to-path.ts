"use client";

import { usePathname, useSearchParams } from "next/navigation";

/** Current app path including query string, for post-login redirects. */
export function useReturnToPath(): string {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const query = searchParams.toString();
	return query ? `${pathname}?${query}` : pathname;
}
