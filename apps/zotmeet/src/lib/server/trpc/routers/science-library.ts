import { router, procedure } from '../init'

import { data as scienceLibraryData } from '$lib/data/science-library'

export const scienceLibraryRouter = router({
  rooms: procedure.query(() => scienceLibraryData),
})
