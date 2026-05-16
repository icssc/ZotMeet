/** @type {import('next').NextConfig} */
const nextConfig = {
	serverExternalPackages: ["@node-rs/argon2"],
	async headers() {
		return [
			// Security headers required/recommended by PWA Builder and Apple's
			// review process for App Store-distributed PWAs.
			{
				source: "/:path*",
				headers: [
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "X-Frame-Options", value: "SAMEORIGIN" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
					{
						key: "Permissions-Policy",
						value:
							"camera=(), microphone=(), geolocation=(), interest-cohort=()",
					},
				],
			},
			// Service workers must be served fresh so updates ship immediately.
			{
				source: "/sw.js",
				headers: [
					{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
					{ key: "Service-Worker-Allowed", value: "/" },
					{
						key: "Content-Type",
						value: "application/javascript; charset=utf-8",
					},
				],
			},
			// Web app manifest should be discoverable by PWA Builder/crawlers.
			{
				source: "/manifest.webmanifest",
				headers: [
					{ key: "Content-Type", value: "application/manifest+json" },
					{
						key: "Cache-Control",
						value: "public, max-age=3600, must-revalidate",
					},
				],
			},
		];
	},
};

export default nextConfig;
