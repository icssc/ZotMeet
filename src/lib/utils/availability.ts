import type { PageData } from "../../routes/availability/[slug]/$types";

import { ZotDate } from "./ZotDate";

import type { AvailabilityMeetingDateJoinSchema } from "$lib/db/schema";
import type { GuestSession } from "$lib/types/availability";

export async function getGuestAvailability(guestSession: GuestSession) {
  const response = await fetch("/api/availability", {
    method: "POST",
    body: JSON.stringify(guestSession),
    headers: {
      "content-type": "application/json",
    },
  });

  const guestData: AvailabilityMeetingDateJoinSchema[] = await response.json();

  return guestData?.map(
    (availability) =>
      new ZotDate(
        new Date(availability.meeting_dates.date),
        false,
        Array.from(availability.availabilities.availability_string).map((char) => char === "1"),
      ),
  );
}

export const getUserAvailability = (data: PageData) => {
  if (data.availability) {
    return data.availability?.map(
      (availability) =>
        new ZotDate(
          new Date(availability.meeting_dates.date),
          false,
          Array.from(availability.availabilities.availability_string).map((char) => char === "1"),
        ),
    );
  }
  return null;
};

export const getGeneralAvailability = async (data: PageData, guestSession: GuestSession) => {
  const userAvailability = getUserAvailability(data);

  if (userAvailability) {
    return userAvailability;
  }

  const guestAvailability = await getGuestAvailability(guestSession);

  if (guestAvailability) {
    return guestAvailability;
  }

  return null;
};
