import type { PageLoad } from './$types'

export const load: PageLoad = async (event) => ({
  id: event.params.id,
})
