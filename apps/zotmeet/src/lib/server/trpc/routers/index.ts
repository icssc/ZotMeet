import { type } from 'arktype'

import { router, procedure } from '../init'

export const appRouter = router({
  hello: procedure.input(type({ text: 'string' }).assert).query(({ input }) => ({
    greeting: `hello ${input.text}`,
  })),
})

// export type definition of API
export type AppRouter = typeof appRouter
