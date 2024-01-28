import { derived, writable, type Writable } from "svelte/store";

import { TimeConstants } from "$lib/types/chrono";
import { ZotDate } from "$lib/utils/ZotDate";

const generateSampleZotDates = (): ZotDate[] => {
  return [
    new ZotDate(new Date("1 1 2024")),
    new ZotDate(new Date("1 2 2024")),
    new ZotDate(new Date("1 3 2024")),
    new ZotDate(new Date("1 4 2024")),
  ];
};

export const availabilityDates = writable<ZotDate[]>(generateSampleZotDates());
export const earliestTime = writable<number>(TimeConstants.MINUTES_PER_HOUR * 9);
export const latestTime = writable<number>(TimeConstants.MINUTES_PER_HOUR * 17.5);

type TimeBlocksStoresType = [
  availabilityDates: Writable<ZotDate[]>,
  earliestTime: Writable<number>,
  latestTime: Writable<number>,
];

type TimeBlockValuesType = [
  $availabilityDates: ZotDate[],
  $earliestTime: number,
  $latestTime: number,
];

const SAMPLE_BLOCK_LENGTH = 15;

export const availabilityTimeBlocks = derived<TimeBlocksStoresType, number[]>(
  [availabilityDates, earliestTime, latestTime],
  ([$availabilityDates, $earliestTime, $latestTime]: TimeBlockValuesType) =>
    ZotDate.initializeAvailabilities(
      $availabilityDates,
      $earliestTime,
      $latestTime,
      SAMPLE_BLOCK_LENGTH,
    ),
);

// export const selectedAvailability = {
//   /**
//    * Updates availability based on the selected availabilities, removes availabilities if
//    * already available.
//    * @param startTime first available time
//    * @param endTime final available time
//    * @param startIndex first available date
//    * @param endIndex final available date
//    */

//   indicateAvailability: (
//     startTime: string,
//     endTime: string,
//     startIndex: number,
//     endIndex: number,
//   ) => {
//     selectedAvailability.update((av) => {
//       const newAv = [...av];
//       const change = !newAv[0].getAvailability(startTime); // the opposite of what the first selected value currently is
//       newAv.forEach((a, idx) => {
//         if (startIndex >= idx && endIndex <= idx) {
//           a.setAvailabilityFromTime(startTime, endTime, change);
//         }
//       });
//       return newAv;
//     });
//   },
// };
