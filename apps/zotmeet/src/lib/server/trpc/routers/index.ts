import { type } from 'arktype'
import dayjs from 'dayjs'

import { router, procedure } from '../init'

import { data as cslData } from '$lib/data/csl'
import { data as scienceLibraryData } from '$lib/data/science-library'

export const appRouter = router({
  hello: procedure.input(type({ text: 'string' }).assert).query(({ input }) => ({
    greeting: `hello ${input.text}`,
  })),

  csl: procedure.query(() => cslData),

  scienceLibrary: procedure.query(() => scienceLibraryData),

  cslById: procedure.input(type('number | undefined').assert).query(({ input }) => {
    if (input == null) {
      return []
    }

    const rooms = cslData
      .flatMap((slot) =>
        slot.rooms.map((room) => ({
          ...room,
          start: dayjs(slot.segment_start_time, 'H:mm A'),
        })),
      )
      .filter((room) => room.room_id === input)
      .map((room) => ({
        ...room,
        start: room.start.toDate(),
        end: room.start.add(30, 'minutes').toDate(),
      }))

    return rooms
  }),

  cslRoomIds: procedure.query(() =>
    Array.from(new Set(cslData.flatMap((slot) => slot.rooms).map((room) => room.room_id))),
  ),
})

// export type definition of API
export type AppRouter = typeof appRouter
