import { createTRPCRequestHandler } from '@bevm0/trpc-sveltekit'

import type { RouteParams, RouteId } from './$types'

import { createContext } from '$lib/server/trpc/context'
import { appRouter } from '$lib/server/trpc/routers'
import type { AppRouter } from '$lib/server/trpc/routers'

/**
 * export GET and POST SvelteKit request handlers
 * @see https://trpc.io/docs/api-handler
 * @see https://kit.svelte.dev/docs/routing#server
 */

const requestHandler = createTRPCRequestHandler<AppRouter, RouteParams, RouteId>({
  router: appRouter,
  createContext,
})

export const GET = requestHandler
export const POST = requestHandler
