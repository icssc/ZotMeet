'use client';

import "../../debounce-C70-rAd_.js";
import { n as createAdapterProvider } from "../../context-DRdo5A2P.js";
import "../../reset-CKsIu3sM.js";
import "../../patch-history-C8rMQUGm.js";
import { n as useNuqsNextAppRouterAdapter, t as NavigationSpy } from "../../impl.app-DZU75kMe.js";
import { Suspense, createElement } from "react";

//#region src/adapters/next/app.ts
const Provider = createAdapterProvider(useNuqsNextAppRouterAdapter);
function NuqsAdapter({ children,...adapterProps }) {
	return createElement(Provider, {
		...adapterProps,
		children: [createElement(Suspense, {
			key: "nuqs-adapter-suspense-navspy",
			children: createElement(NavigationSpy)
		}), children]
	});
}

//#endregion
export { NuqsAdapter };
//# sourceMappingURL=app.js.map