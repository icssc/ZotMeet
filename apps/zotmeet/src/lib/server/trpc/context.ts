import type { TRPCSvelteContextOptions } from '@bevm0/trpc-sveltekit'
import type { inferAsyncReturnType } from '@trpc/server'

export function createContext(options: TRPCSvelteContextOptions): TRPCSvelteContextOptions {
  return options
}

export type Context = inferAsyncReturnType<typeof createContext>
