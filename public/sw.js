/**
 * ZotMeet service worker.
 *
 * Strategy:
 *   - Precache a small "app shell" of truly static assets (icons, offline
 *     page, manifest). Each entry is fetched individually so one failure
 *     doesn't abort the whole install.
 *   - Navigations are network-only and fall back to the cached offline page
 *     when the network is unreachable. We deliberately do NOT cache HTML
 *     responses: most ZotMeet pages render per-user data, and caching them
 *     in a single per-origin Cache would leak between users on shared
 *     devices (library workstations, family computers, etc.).
 *   - Cache-first for known-immutable static assets (`_next/static/*`,
 *     `/icons/*`, favicons, apple touch icon). Everything else is passed
 *     through to the network.
 *
 * Bumping `CACHE_VERSION` invalidates all previously cached responses on the
 * next activation. Update it whenever the app shell or offline page changes.
 */
const CACHE_VERSION = "zotmeet-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const APP_SHELL = [
	"/offline.html",
	"/manifest.webmanifest",
	"/apple-touch-icon.png",
	"/icons/icon-192.png",
	"/icons/icon-512.png",
];

/**
 * Returns true if a same-origin GET response can safely be cached and reused
 * across users. We restrict this to immutable Next.js build assets and our
 * own static icon/manifest files.
 */
function isCacheableStaticPath(pathname) {
	return (
		pathname.startsWith("/_next/static/") ||
		pathname.startsWith("/icons/") ||
		pathname === "/apple-touch-icon.png" ||
		pathname === "/manifest.webmanifest" ||
		pathname === "/offline.html"
	);
}

self.addEventListener("install", (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(STATIC_CACHE);
			// Best-effort precache: a flaky network shouldn't block installation.
			await Promise.all(
				APP_SHELL.map(async (url) => {
					try {
						const res = await fetch(url, { cache: "no-store" });
						if (res.ok) await cache.put(url, res);
					} catch {
						// Ignore individual precache failures.
					}
				}),
			);
			await self.skipWaiting();
		})(),
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(
				keys
					.filter((key) => !key.startsWith(CACHE_VERSION))
					.map((key) => caches.delete(key)),
			);
			await self.clients.claim();
		})(),
	);
});

/**
 * Network-only handler for navigation requests. Falls back to the cached
 * offline page if the network is unreachable. HTML responses are never
 * cached to avoid leaking per-user content across sessions.
 */
async function handleNavigation(request) {
	try {
		return await fetch(request);
	} catch (_err) {
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
 * Cache-first handler for known-immutable same-origin static assets.
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

	if (request.mode === "navigate") {
		event.respondWith(handleNavigation(request));
		return;
	}

	const url = new URL(request.url);

	// Never cache API or auth subresources; let them hit the network directly.
	if (url.pathname.startsWith("/api") || url.pathname.startsWith("/auth")) {
		return;
	}

	if (
		url.origin === self.location.origin &&
		isCacheableStaticPath(url.pathname)
	) {
		event.respondWith(handleStatic(request));
	}
});

self.addEventListener("message", (event) => {
	if (event.data === "SKIP_WAITING") {
		self.skipWaiting();
	}
});
