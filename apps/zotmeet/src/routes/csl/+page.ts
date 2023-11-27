import type { PageLoad } from './$types'

export const load: PageLoad = async (event) => {
  const { trpc } = await event.parent()

  return {
    csl: trpc.context.csl.rooms.fetch(),
  }
}
