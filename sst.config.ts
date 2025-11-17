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
        const domainName = `${$app.stage === "prod" ? "" : `${$app.stage}.`}zotmeet.com`;
        const baseUrl = `https://${domainName}`;

        new sst.aws.Nextjs("site", {
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
    },
});
