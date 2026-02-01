import { c as debug, o as renderQueryString } from "./context-DRdo5A2P.js";
import { t as resetQueues } from "./reset-CKsIu3sM.js";
import { i as shouldPatchHistory, n as markHistoryAsPatched } from "./patch-history-C8rMQUGm.js";
import { startTransition, useCallback, useEffect, useOptimistic } from "react";
import { useRouter, useSearchParams } from "next/navigation.js";

//#region src/adapters/next/impl.app.ts
const NUM_HISTORY_CALLS_PER_UPDATE = 3;
let mutex = 0;
function onPopState() {
	mutex = 0;
	resetQueues();
}
function onHistoryStateUpdate() {
	mutex--;
	if (mutex <= 0) {
		mutex = 0;
		queueMicrotask(resetQueues);
	}
}
function patchHistory() {
	if (!shouldPatchHistory("next/app")) return;
	const originalReplaceState = history.replaceState;
	const originalPushState = history.pushState;
	history.replaceState = function nuqs_replaceState(state, title, url) {
		onHistoryStateUpdate();
		return originalReplaceState.call(history, state, title, url);
	};
	history.pushState = function nuqs_pushState(state, title, url) {
		onHistoryStateUpdate();
		return originalPushState.call(history, state, title, url);
	};
	markHistoryAsPatched("next/app");
}
function NavigationSpy() {
	useEffect(() => {
		patchHistory();
		window.addEventListener("popstate", onPopState);
		return () => window.removeEventListener("popstate", onPopState);
	}, []);
	return null;
}
function useNuqsNextAppRouterAdapter() {
	const router = useRouter();
	const [optimisticSearchParams, setOptimisticSearchParams] = useOptimistic(useSearchParams());
	return {
		searchParams: optimisticSearchParams,
		updateUrl: useCallback((search, options) => {
			startTransition(() => {
				if (!options.shallow) setOptimisticSearchParams(search);
				const url = renderURL(search);
				debug("[nuqs next/app] Updating url: %s", url);
				const updateMethod = options.history === "push" ? history.pushState : history.replaceState;
				mutex = NUM_HISTORY_CALLS_PER_UPDATE;
				updateMethod.call(history, null, "", url);
				if (options.scroll) window.scrollTo(0, 0);
				if (!options.shallow) router.replace(url, { scroll: false });
			});
		}, []),
		rateLimitFactor: NUM_HISTORY_CALLS_PER_UPDATE,
		autoResetQueueOnUpdate: false
	};
}
function renderURL(search) {
	const { origin, pathname, hash } = location;
	return origin + pathname + renderQueryString(search) + hash;
}

//#endregion
export { useNuqsNextAppRouterAdapter as n, NavigationSpy as t };
//# sourceMappingURL=impl.app-DZU75kMe.js.map