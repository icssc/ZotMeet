import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/pwa-config.mjs";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/auth/"] }],
		sitemap: `${APP_URL}/sitemap.xml`,
	};
}
