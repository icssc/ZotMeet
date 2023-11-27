import adapterPrisma from '@aponia.js/adapter-prisma'
import { SvelteKitAuth } from '@aponia.js/sveltekit'
import GitHub from '@auth/core/providers/github'
import Google from '@auth/core/providers/google'
import { error, type Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

import { GITHUB_ID, GITHUB_SECRET, GOOGLE_ID, GOOGLE_SECRET } from '$env/static/private'
import { prisma } from '$lib/server/db'

const authHandle = SvelteKitAuth({
  adapter: adapterPrisma(prisma),
  session: {},
  providers: [
    Google({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
    GitHub({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
  ],
})

const authorizationHandle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/profile')) {
    const session = await event.locals.getSession()

    if (session?.user?.id == null) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal, @typescript-eslint/no-confusing-void-expression
      throw error(401, {
        message: 'Unauthorized',
      })
    }
  }

  return resolve(event)
}

export const handle = sequence(authHandle, authorizationHandle)
