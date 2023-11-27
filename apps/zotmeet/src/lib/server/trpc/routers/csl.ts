import { type } from 'arktype'
import dayjs from 'dayjs'

import { router, procedure } from '../init'

import { data as cslData } from '$lib/data/csl'

// Scuffed data pre-processing.

const allCslRooms = cslData.flatMap((slot) => slot.rooms)

const cslRooms = allCslRooms.reduce<Record<string, string>>((acc, room) => {
  acc[room.room_id] = room.room_name
  return acc
}, {})

const cslRoomIds = Object.keys(cslRooms)

const cslRoomNames = Object.values(cslRooms)

const cslRoomEntries = Object.entries(cslRooms)

/**
 * The CSL router handles requests for CSL data.
 */
export const cslRouter = router({
  /**
   * Returns all the rooms at CSL.
   */
  rooms: procedure.query(() => ({
    rooms: cslRooms,
    roomIds: cslRoomIds,
    roomNames: cslRoomNames,
    roomEntries: cslRoomEntries,
  })),

  /**
   * Returns all the available timeslots for a specified room at CSL.
   */
  getById: procedure.input(type('number | undefined').assert).query(({ input }) => {
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
})
