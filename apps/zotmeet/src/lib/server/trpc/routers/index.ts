import { router } from '../init'

import { cslRouter } from './csl'

export const appRouter = router({
  csl: cslRouter,
})

// export type definition of API.
export type AppRouter = typeof appRouter
