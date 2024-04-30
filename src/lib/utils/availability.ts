import type { PageData } from "../../routes/availability/[slug]/$types";

import { ZotDate } from "./ZotDate";

import type { AvailabilityInsertSchema } from "$lib/db/schema";
import type { GuestSession } from "$lib/types/availability";

export async function getGuestAvailability(guestSession: GuestSession) {
  const response = await fetch("/api/availability", {
    method: "POST",
    body: JSON.stringify(guestSession),
    headers: {
      "content-type": "application/json",
    },
  });

  const guestData: AvailabilityInsertSchema[] | null = await response.json();

  return guestData?.map(
    (availability) =>
      new ZotDate(
        new Date(availability.day),
        false,
        JSON.parse("[" + availability.availability_string + "]"),
      ),
  );
}

export const getUserAvailability = (data: PageData) => {
  if (data.availability) {
    return data.availability?.map(
      (availability) =>
        new ZotDate(
          new Date(availability.day),
          false,
          JSON.parse("[" + availability.availability_string + "]"),
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