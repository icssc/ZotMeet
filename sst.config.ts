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
            domain: {
                name: `${$app.stage === "prod" ? "" : `${$app.stage}.`}zotmeet.com`,
                dns: sst.aws.dns({
                    zone: "zotmeet.com",
                }),
            },
        });
    },
});
