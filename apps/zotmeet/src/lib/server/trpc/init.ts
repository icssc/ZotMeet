import { initTRPC } from '@trpc/server'

import type { Context } from './context'

import { transformer } from '$lib/client/transformer'

const trpc = initTRPC.context<Context>().create({ transformer })

export const { procedure, router, middleware, mergeRouters } = trpc
