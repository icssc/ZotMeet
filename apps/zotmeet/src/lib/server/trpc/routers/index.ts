import { type } from 'arktype'

import { router, procedure } from '../init'

import { data as cslData } from '$lib/data/csl'
import { data as scienceLibraryData } from '$lib/data/science-library'

export const appRouter = router({
  hello: procedure.input(type({ text: 'string' }).assert).query(({ input }) => ({
    greeting: `hello ${input.text}`,
  })),

  csl: procedure.query(() => cslData),

  scienceLibrary: procedure.query(() => scienceLibraryData),
})

// export type definition of API
export type AppRouter = typeof appRouter
