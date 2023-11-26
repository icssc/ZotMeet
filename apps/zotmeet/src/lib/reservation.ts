/**
 * A reservation event is a single event that is part of a reservation.
 */
export interface ReservationEvent {
  /**
   * The start time of the event.
   */
  start: Date

  /**
   * The end time of the event.
   */
  end: Date
}

/**
 * A reservation is a collection of events that are grouped together.
 */
export interface Reservation {
  /**
   * Each reservation is unique to a group of people planning a meeting.
   */
  id: string

  /**
   * Each user that fills out the form will have their own collection of events.
   */
  events: Record<string, ReservationEvent[]>
}
