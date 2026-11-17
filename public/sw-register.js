/**
 * Registers the ZotMeet service worker. Loaded via a static <script> tag so
 * PWABuilder's headless checker (and first paint) see registration without
 * waiting for React hydration.
 */
(() => {
	if (!("serviceWorker" in navigator)) return;

	function promoteWaitingWorker(reg) {
		if (reg.waiting) reg.waiting.postMessage("SKIP_WAITING");
		reg.addEventListener("updatefound", () => {
			var installing = reg.installing;
			if (!installing) return;
			installing.addEventListener("statechange", () => {
				if (
					installing.state === "installed" &&
					navigator.serviceWorker.controller
				) {
					installing.postMessage("SKIP_WAITING");
				}
			});
		});
	}

	navigator.serviceWorker
		.register("/sw.js", { scope: "/" })
		.then(promoteWaitingWorker)
		.catch((err) => {
			console.warn("[sw] registration failed", err);
		});
})();
