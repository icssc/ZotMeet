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
        new sst.aws.Nextjs("site", {
            environment: {
                DATABASE_URL: process.env.DATABASE_URL ?? "localhost:3000",
                GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID!,
                GOOGLE_OAUTH_CLIENT_SECRET:
                    process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
                GOOGLE_OAUTH_REDIRECT_URI:
                    $app.stage === "prod"
                        ? "https://zotmeet.com/auth/login/google/callback"
                        : "http://localhost:3000/auth/login/google/callback",
            },
            domain: {
                name: `${$app.stage === "prod" ? "" : `${$app.stage}.`}zotmeet.com`,
                dns: sst.aws.dns({
                    zone: "Z0670880YRIE7KPL5SPX",
                }),
            },
        });
    },
});
