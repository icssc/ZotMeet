import { createTRPCSvelte } from '@bevm0/trpc-svelte-query'
import { QueryClient } from '@tanstack/svelte-query'
import { httpBatchLink } from '@trpc/client'

import type { LayoutLoad } from './$types'

import { transformer } from '$lib/client/transformer'
import type { AppRouter } from '$lib/server/trpc/routers'

export const load: LayoutLoad = async (event) => {
  const queryClient = new QueryClient()

  const trpc = createTRPCSvelte<AppRouter>(
    {
      transformer,
      links: [
        httpBatchLink({
          url: 'http://localhost:5173/api/trpc',
          fetch: event.fetch,
        }),
      ],
    },
    { svelteQueryContext: queryClient },
  )

  return {
    trpc,
    user: event.data.user,
  }
}
