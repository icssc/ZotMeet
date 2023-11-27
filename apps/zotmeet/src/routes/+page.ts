import type { PageLoad } from './$types'

export const load: PageLoad = async (event) => {
  const { trpc } = await event.parent()

  // This is a pre-fetching example.
  // The query for the page will not have to run on page mount if the data isn't pre-fetched here.

  return {
    greeting: trpc.context.hello.fetch({ text: 'Elysia' }),
  }
}
