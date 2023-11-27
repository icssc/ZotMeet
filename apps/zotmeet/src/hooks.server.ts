import adapterPrisma from '@aponia.js/adapter-prisma'
import { SvelteKitAuth } from '@aponia.js/sveltekit'
import GitHub from '@auth/core/providers/github'
import Google from '@auth/core/providers/google'
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

export const handle = sequence(authHandle)
