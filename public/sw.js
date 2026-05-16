/**
 * ZotMeet service worker.
 *
 * Strategy:
 *   - Precache a small "app shell" of static assets (icons, offline page).
 *   - Network-first for navigations and same-origin GETs, falling back to the
 *     cached offline page when the network is unavailable.
 *   - Cache-first for the precached static assets.
 *
 * Bumping `CACHE_VERSION` invalidates all previously cached responses on the
 * next activation. Update it whenever the app shell or offline page changes.
 */
const CACHE_VERSION = "zotmeet-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const APP_SHELL = [
	"/",
	"/offline.html",
	"/manifest.webmanifest",
	"/apple-touch-icon.png",
	"/icons/icon-192.png",
	"/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(STATIC_CACHE)
			.then((cache) => cache.addAll(APP_SHELL))
			.then(() => self.skipWaiting()),
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys
						.filter((key) => !key.startsWith(CACHE_VERSION))
						.map((key) => caches.delete(key)),
				),
			)
			.then(() => self.clients.claim()),
	);
});

/**
 * Network-first handler for navigation requests. Falls back to the cached
 * offline page if the network is unreachable.
 */
async function handleNavigation(request) {
	try {
		const fresh = await fetch(request);
		const cache = await caches.open(RUNTIME_CACHE);
		cache.put(request, fresh.clone());
		return fresh;
	} catch (_err) {
		const cached = await caches.match(request);
		if (cached) return cached;
		const offline = await caches.match("/offline.html");
		return (
			offline ??
			new Response("You are offline.", {
				status: 503,
				headers: { "Content-Type": "text/plain" },
			})
		);
	}
}

/**
 * Cache-first handler for same-origin static GETs.
 */
async function handleStatic(request) {
	const cached = await caches.match(request);
	if (cached) return cached;
	try {
		const fresh = await fetch(request);
		if (fresh.ok && fresh.type === "basic") {
			const cache = await caches.open(RUNTIME_CACHE);
			cache.put(request, fresh.clone());
		}
		return fresh;
	} catch (_err) {
		return new Response("", { status: 504 });
	}
}

self.addEventListener("fetch", (event) => {
	const { request } = event;

	if (request.method !== "GET") return;

	const url = new URL(request.url);

	// Never cache API or auth routes; let them hit the network directly.
	if (url.pathname.startsWith("/api") || url.pathname.startsWith("/auth")) {
		return;
	}

	if (request.mode === "navigate") {
		event.respondWith(handleNavigation(request));
		return;
	}

	if (url.origin === self.location.origin) {
		event.respondWith(handleStatic(request));
	}
});

self.addEventListener("message", (event) => {
	if (event.data === "SKIP_WAITING") {
		self.skipWaiting();
	}
});
