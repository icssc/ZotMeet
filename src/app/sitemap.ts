import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/pwa-config.mjs";

/**
 * Minimal public sitemap. Authenticated routes (groups, profile, summary) are
 * intentionally omitted because they require a session and aren't useful for
 * crawlers or App Store review.
 */
export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();
	const routes = ["/", "/studyrooms"];
	return routes.map((path) => ({
		url: `${APP_URL}${path}`,
		lastModified: now,
		changeFrequency: "weekly" as const,
		priority: path === "/" ? 1 : 0.7,
	}));
}
