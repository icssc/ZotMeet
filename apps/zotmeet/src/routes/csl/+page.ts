import type { PageLoad } from './$types'

export const load: PageLoad = async (event) => {
  const { trpc } = await event.parent()

  return {
    cslRoomIds: trpc.context.cslRoomIds.fetch(),
    csl: trpc.context.csl.fetch(),
  }
}
