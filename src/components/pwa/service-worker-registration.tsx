"use client";

import { useEffect } from "react";

/**
 * When a new SW version finishes installing, ask it to activate immediately
 * so the next navigation runs on the updated worker.
 */
function promoteWaitingWorker(reg: ServiceWorkerRegistration): void {
	reg.waiting?.postMessage("SKIP_WAITING");
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
}

/**
 * Registers the ZotMeet service worker on the client. Mounted once from the
 * root layout. Only runs in production to keep dev HMR sane.
 */
export function ServiceWorkerRegistration(): null {
	useEffect(() => {
		if (!("serviceWorker" in navigator)) return;
		if (process.env.NODE_ENV !== "production") return;

		const register = async (): Promise<void> => {
			try {
				const reg = await navigator.serviceWorker.register("/sw.js", {
					scope: "/",
				});
				promoteWaitingWorker(reg);
			} catch (err) {
				console.warn("[sw] registration failed", err);
			}
		};

		void register();
	}, []);

	return null;
}
