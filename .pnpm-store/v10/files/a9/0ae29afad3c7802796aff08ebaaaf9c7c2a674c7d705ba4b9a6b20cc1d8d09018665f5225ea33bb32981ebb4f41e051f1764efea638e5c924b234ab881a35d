'use client';

import { n as createAdapterProvider, o as renderQueryString } from "../context-DRdo5A2P.js";
import { startTransition, useCallback, useMemo } from "react";
import { useLocation, useMatches, useNavigate } from "@tanstack/react-router";

//#region src/adapters/tanstack-router.ts
function useNuqsTanstackRouterAdapter(watchKeys) {
	const search = useLocation({ select: (state) => Object.fromEntries(Object.entries(state.search).filter(([key]) => watchKeys.includes(key))) });
	const navigate = useNavigate();
	const from = useMatches({ select: (matches) => matches.length > 0 ? matches[matches.length - 1]?.fullPath : void 0 });
	return {
		searchParams: useMemo(() => new URLSearchParams(Object.entries(search).flatMap(([key, value]) => {
			if (Array.isArray(value)) return value.map((v) => [key, v]);
			else if (typeof value === "object" && value !== null) return [[key, JSON.stringify(value)]];
			else return [[key, value]];
		})), [search, watchKeys.join(",")]),
		updateUrl: useCallback((search$1, options) => {
			startTransition(() => {
				navigate({
					to: renderQueryString(search$1) || ".",
					...from ? { from } : {},
					replace: options.history === "replace",
					resetScroll: options.scroll,
					hash: (prevHash) => prevHash ?? ""
				});
			});
		}, [navigate, from]),
		rateLimitFactor: 1
	};
}
const NuqsAdapter = createAdapterProvider(useNuqsTanstackRouterAdapter);

//#endregion
export { NuqsAdapter };
//# sourceMappingURL=tanstack-router.js.map