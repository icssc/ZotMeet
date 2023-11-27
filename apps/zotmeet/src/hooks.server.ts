import { adapt } from '@aponia.js/adapter-prisma'
import { Auth } from '@aponia.js/core'
import { Session } from '@aponia.js/core/session'
import { createAuthHelpers } from '@aponia.js/sveltekit'
import GitHub from '@auth/core/providers/github'
import Google from '@auth/core/providers/google'
import { sequence } from '@sveltejs/kit/hooks'

import { prisma } from '$lib/server/db'

const session = new Session()

const auth = new Auth({
  session,
  providers: [Google({}), GitHub({})],
})

adapt(auth, prisma)

const authHandle = createAuthHelpers(auth)

export const handle = sequence(authHandle)
