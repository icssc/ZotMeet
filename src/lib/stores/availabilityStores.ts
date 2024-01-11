import { writable } from "svelte/store";

import { Availability } from "$lib/components/availability/Availability";

export const selectedAvailability = {
  ...writable<Availability[]>([]),
  /**
   * Initializes availability with given dates from date picker.
   * @param days
   */
  initialize: (days: string[]) =>
    selectedAvailability.set(days.map((day: string) => new Availability(day))),

  /**
   * Updates availability based on the selected availabilities, removes availabilities if
   * already available.
   * @param startTime first available time
   * @param endTime final available time
   * @param startIndex first available date
   * @param endIndex final available date
   */

  indicateAvailability: (
    startTime: string,
    endTime: string,
    startIndex: number,
    endIndex: number,
  ) => {
    selectedAvailability.update((av) => {
      const newAv = [...av];
      const change = !newAv[0].getAvailability(startTime); // the opposite of what the first selected value currently is
      newAv.forEach((a, idx) => {
        if (startIndex >= idx && endIndex <= idx) {
          a.setAvailabilityFromTime(startTime, endTime, change);
        }
      });
      return newAv;
    });
  },
};
