import { router } from '../init'

import { cslRouter } from './csl'
import { reservationsRouter } from './reservations'
import { scienceLibraryRouter } from './science-library'

export const appRouter = router({
  csl: cslRouter,
  reservations: reservationsRouter,
  scienceLibrary: scienceLibraryRouter,
})

// export type definition of API.
export type AppRouter = typeof appRouter
