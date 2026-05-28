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

	function getSameOriginRedirect(value) {
		if (typeof value !== "string") return "/summary";

		try {
			const url = new URL(value, window.location.origin);
			if (url.origin !== window.location.origin) return "/summary";
			return url.pathname + url.search + url.hash;
		} catch (_err) {
			return "/summary";
		}
	}

	navigator.serviceWorker.addEventListener("message", (event) => {
		if (event.data && event.data.type === "notification-click") {
			window.location.assign(getSameOriginRedirect(event.data.redirect));
		}
	});
})();
