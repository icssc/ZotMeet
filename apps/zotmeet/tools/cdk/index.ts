import { SvelteKit } from '@svelte.kit/cdk'
import { type } from 'arktype'
import { App, Stack } from 'aws-cdk-lib'
import { config } from 'dotenv'
// import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets'
// import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53'

config({
  path: '../../.env',
})

const envSchema = type(
  {
    GITHUB_ID: 'string',
    GITHUB_SECRET: 'string',
    GOOGLE_ID: 'string',
    GOOGLE_SECRET: 'string',
    POSTGRES_PRISMA_URL: 'string',
  },
  { keys: 'distilled' },
)

/**
 * The SvelteKit construct only provisions the minimal resources need to support a SvelteKit SSR app.
 *
 * The main components include:
 * - CloudFront Distribution - CDN proxying requests between API Gateway and S3.
 * - Lambda - Runs the actual SvelteKit server.
 * - API Gateway - Proxies requests to the Lambda.
 * - S3 Bucket - Stores static  assets.
 *
 * This CDK app shows the simplest setup.
 */
async function main(): Promise<void> {
  const stackName = `ZotMeet-canary`

  const app = new App({ autoSynth: true })

  const stack = new Stack(app, stackName)

  /**
   * Parse the env by using the schema defined above. If invalid, then the app will fail to deploy.
   */
  const environment = envSchema.assert(process.env)

  const sveltekit = new SvelteKit(stack, stackName, {
    constructProps: {
      handler: () => ({
        environment,
      }),
    },
  })

  // /**
  //  * Use the CloudFront Distribution provisioned by the SvelteKit construct as the target for the A record.
  //  */
  // const aliasTarget = new CloudFrontTarget(sveltekit.distribution);

  // new ARecord(stack, "a-record", {
  //   zone: HostedZone.fromHostedZoneAttributes(stack, "hosted-zone", {
  //     zoneName: "sparkle.com",
  //     hostedZoneId: process.env.HOSTED_ZONE_ID ?? "",
  //   }),
  //   recordName: `${stage === "prod" ? "" : `${stage}.`}sparkle`,
  //   target: RecordTarget.fromAlias(aliasTarget),
  // });

  await sveltekit.init()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
