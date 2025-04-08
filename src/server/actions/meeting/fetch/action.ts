"use server";

import { getCurrentSession } from "@/lib/auth";
import { getMeetingsByUserId } from "@/server/data/meeting/queries";

export async function getUserMeetings() {
  const { user } = await getCurrentSession();
  
  if (!user) {
    return { error: "You must be logged in to view your meetings." };
  }
  
  const meetings = await getMeetingsByUserId(user.memberId);
  return { meetings };
}
