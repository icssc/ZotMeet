// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: "ZotMeet",
			removal: input?.stage === "production" ? "retain" : "remove",
			protect: ["production"].includes(input?.stage),
			home: "aws",
			providers: {
				aws: { region: "us-west-1" },
			},
		};
	},
	async run() {
		const domainName = `${$app.stage === "production" ? "" : `${$app.stage}.`}zotmeet.com`;
		const baseUrl = `https://${domainName}`;
		const mobileDomainName = `mobile.${domainName}`;

		const sesProvider = new aws.Provider("SesProvider", {
			region: "us-east-2",
		});

		new sst.aws.Nextjs("site", {
			link: [
				sst.aws.Email.get("NotificationEmail", "icssc.club", {
					provider: sesProvider,
				}),
			],
			environment: {
				DATABASE_URL: process.env.DATABASE_URL ?? "localhost:3000",
				OIDC_CLIENT_ID: process.env.OIDC_CLIENT_ID!,
				OIDC_ISSUER_URL: process.env.OIDC_ISSUER_URL!,
				GOOGLE_OAUTH_REDIRECT_URI: `${baseUrl}/auth/login/google/callback`,
				NEXT_PUBLIC_BASE_URL: baseUrl,
			},
			cachePolicy: "e6e88864-aee5-41aa-b393-c48f78e33d2d",
			domain: {
				name: domainName,
				dns: sst.aws.dns({
					zone: "Z0670880YRIE7KPL5SPX",
				}),
			},
		});

		// A static export of the Expo app, so a mobile PR can be reviewed by
		// opening a URL on a phone — no Expo account, no install, nothing to
		// check out. Native behaviour (haptics, the native date picker, real
		// gesture physics) does not survive react-native-web, so this stands
		// alongside the EAS Update preview rather than replacing it.
		//
		// Deliberately not deployed to production: apps/mobile is still an
		// exploration prototype and mobile.zotmeet.com would publish it as
		// though it were shipped. Drop this guard when that stops being true.
		if ($app.stage !== "production") {
			new sst.aws.StaticSite("mobile", {
				path: "apps/mobile",
				build: {
					command: `pnpm exec expo export --platform web && node scripts/emit-preview-qr.mjs https://${mobileDomainName}`,
					output: "dist",
				},
				// expo-router pre-renders `/profile` to `profile.html` and a
				// dynamic route to a literal `[id].html`, neither of which
				// CloudFront can match against a clean URL. Serving index.html
				// on a miss hands routing to the client-side router, which
				// resolves both correctly.
				errorPage: "index.html",
				domain: {
					name: mobileDomainName,
					dns: sst.aws.dns({
						zone: "Z0670880YRIE7KPL5SPX",
					}),
				},
			});
		}
	},
});
