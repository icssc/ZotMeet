import type { DataTransformerOptions } from '@trpc/server'
import { uneval } from 'devalue'
import SuperJSON from 'superjson'

export const transformer: DataTransformerOptions = {
  input: SuperJSON,
  output: {
    serialize: (object) => uneval(object),
    // eslint-disable-next-line no-eval
    deserialize: (object) => eval(`(${object})`),
  },
}
