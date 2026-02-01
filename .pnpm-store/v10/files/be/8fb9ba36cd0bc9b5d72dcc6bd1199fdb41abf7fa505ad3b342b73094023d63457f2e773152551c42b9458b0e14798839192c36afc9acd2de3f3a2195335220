'use client';

import "../debounce-C70-rAd_.js";
import { n as createAdapterProvider } from "../context-DRdo5A2P.js";
import "../reset-CKsIu3sM.js";
import "../patch-history-C8rMQUGm.js";
import { n as useNuqsNextAppRouterAdapter } from "../impl.app-DZU75kMe.js";
import { n as useNuqsNextPagesRouterAdapter, t as isPagesRouter } from "../impl.pages-DPcvoxQ5.js";

//#region src/adapters/next.ts
function useNuqsNextAdapter() {
	const pagesRouterImpl = useNuqsNextPagesRouterAdapter();
	const appRouterImpl = useNuqsNextAppRouterAdapter();
	return {
		searchParams: appRouterImpl.searchParams,
		updateUrl(search, options) {
			if (isPagesRouter()) return pagesRouterImpl.updateUrl(search, options);
			else return appRouterImpl.updateUrl(search, options);
		},
		autoResetQueueOnUpdate: false
	};
}
const NuqsAdapter = createAdapterProvider(useNuqsNextAdapter);

//#endregion
export { NuqsAdapter };
//# sourceMappingURL=next.js.map