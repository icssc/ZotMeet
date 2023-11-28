import { SvelteKit } from '@svelte.kit/cdk'
import { App, Stack } from 'aws-cdk-lib'

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
  const stackName = `sparkle-starter-canary`

  const app = new App({ autoSynth: true })

  const stack = new Stack(app, stackName)

  const sveltekit = new SvelteKit(stack, stackName, {
    constructProps: {
      handler: () => ({
        environment: {},
      }),
    },
  })

  await sveltekit.init()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
