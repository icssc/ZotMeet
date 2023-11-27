import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
  const user = await event.locals.getUser()

  console.log({ user })

  return { user }
}
