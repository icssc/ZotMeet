import { createTRPCSvelte } from '@bevm0/trpc-svelte-query'
import { httpBatchLink } from '@trpc/client'

import { transformer } from './transformer'

import type { AppRouter } from '$lib/server/trpc/routers'

export const trpc = createTRPCSvelte<AppRouter>({
  transformer,
  links: [httpBatchLink({ url: 'http://localhost:5173/api/trpc' })],
})
