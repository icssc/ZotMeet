"use client";

import { useEffect } from "react";

/**
 * Registers the ZotMeet service worker on the client. Mounted once from the
 * root layout. Only runs in production to keep dev HMR sane.
 */
export function ServiceWorkerRegistration() {
	useEffect(() => {
		if (typeof window === "undefined") return;
		if (!("serviceWorker" in navigator)) return;
		if (process.env.NODE_ENV !== "production") return;

		const register = async () => {
			try {
				const reg = await navigator.serviceWorker.register("/sw.js", {
					scope: "/",
				});

				// Prompt the new SW to activate immediately when one is waiting.
				if (reg.waiting) reg.waiting.postMessage("SKIP_WAITING");
				reg.addEventListener("updatefound", () => {
					const installing = reg.installing;
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
			} catch (err) {
				console.warn("[sw] registration failed", err);
			}
		};

		void register();
	}, []);

	return null;
}
