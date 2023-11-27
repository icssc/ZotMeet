import { router } from '../init'

import { cslRouter } from './csl'
import { reservationsRouter } from './reservations'

export const appRouter = router({
  csl: cslRouter,
  reservations: reservationsRouter,
})

// export type definition of API.
export type AppRouter = typeof appRouter
