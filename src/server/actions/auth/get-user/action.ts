"use server";

import { getCurrentSession } from "@/lib/auth";

export async function getCurrentUser() {
  const { user } = await getCurrentSession();
  return { user };
} 