/** @type {import('next').NextConfig} */
const nextConfig = {
	serverExternalPackages: ["@node-rs/argon2"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "s3.amazonaws.com",
				pathname: "/libapps/**",
			},
			{
				protocol: "https",
				hostname: "libapps.s3.amazonaws.com",
				pathname: "/accounts/**",
			},
			{
				protocol: "https",
				hostname: "d2jv02qf7xgjwx.cloudfront.net",
				pathname: "/accounts/**",
			},
		],
	},
	async rewrites() {
		return [
			{
				source: "/.well-known/apple-app-site-association",
				destination: "/apple-app-site-association",
			},
		];
	},
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
						// `preload` is intentionally omitted: adding it commits the
						// domain to the HSTS preload list, which is effectively
						// permanent. Submit at https://hstspreload.org and re-add
						// the directive once the domain is verified.
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains",
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
			{
				source: "/sw-register.js",
				headers: [
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
			{
				source: "/screenshots/:path*",
				headers: [
					{ key: "Content-Type", value: "image/png" },
					{
						key: "Cache-Control",
						value: "public, max-age=86400, immutable",
					},
				],
			},
		];
	},
};

export default nextConfig;
