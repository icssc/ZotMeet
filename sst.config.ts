import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import type { SSTConfig } from "sst";
import { SvelteKitSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "ZotMeet",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      if (!process.env.CERTIFICATE_ARN) {
        throw new Error("Certificate ARN not provided.");
      }
      const site = new SvelteKitSite(stack, "site", {
        customDomain: {
          domainName: `${stack.stage === "prod" ? "" : `${stack.stage}.`}zotmeet.com`,
          hostedZone: "zotmeet.com",
          cdk: {
            certificate: Certificate.fromCertificateArn(
              stack,
              "MyCert",
              process.env.CERTIFICATE_ARN,
            ),
          },
        },
      });
      stack.addOutputs({ url: site.url });
    });
  },
} satisfies SSTConfig;
