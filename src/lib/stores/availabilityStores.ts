import { writable } from "svelte/store";

import { Availability } from "$lib/components/availability/Availability";

function createAvailability() {
  const { subscribe, set, update } = writable<Availability[]>([]);

  /**
   * Updates availability based on the selected availabilities
   * @param startTime first available time
   * @param endTime final available time
   * @param startIndex first available date
   * @param endIndex final available date
   */
  const updateAvailability = (
    startTime: string,
    endTime: string,
    startIndex: number,
    endIndex: number,
  ) => {
    update((av) => {
      const newAv = [...av];
      newAv.forEach((a, idx) => {
        if (startIndex >= idx && endIndex <= idx) {
          a.setAvailabilityFromTime(startTime, endTime);
        }
      });
      return newAv;
    });
  };

  const initialize = (days: string[]) => set(days.map((day: string) => new Availability(day)));

  return {
    subscribe,
    initialize,
    updateAvailability,
  };
}

export const selectedAvailability = createAvailability();
