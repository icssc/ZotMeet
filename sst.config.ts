// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
    app(input) {
        return {
            name: "ZotMeet",
            removal: input?.stage === "production" ? "retain" : "remove",
            protect: ["production"].includes(input?.stage),
            home: "aws",
        };
    },
    async run() {
        new sst.aws.Nextjs("site", {
            environment: {
                DATABASE_URL: process.env.DATABASE_URL ?? "localhost:3000",
            },
            domain: {
                name: `${$app.stage === "prod" ? "" : `${$app.stage}.`}zotmeet.com`,
                dns: sst.aws.dns({
                    zone: "Z0670880YRIE7KPL5SPX", // test
                }),
            },
        });
    },
});
