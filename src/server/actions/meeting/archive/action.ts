"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { meetings } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function archiveMeeting(id: string) {
    const meetingId = id;

    const { user } = await getCurrentSession();

    if (!user) {
        return { error: "You must be logged in to delete a meeting." };
    }

    await db
        .update(meetings)
        .set({ archived: true })
        .where(eq(meetings.id, meetingId));

    redirect("/summary");
}
