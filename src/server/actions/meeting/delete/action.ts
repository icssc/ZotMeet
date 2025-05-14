"use server";

import { db } from "@/db";
import { meetings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function deleteMeeting(id: string) {
    const meetingId = id;
    console.log("IN DELETE MEETING ACTION");
    console.log("meeting id:", meetingId);

    const { user } = await getCurrentSession();

    if (!user) {
        return { error: "You must be logged in to delete a meeting." };
    }

    await db.update(meetings)
    .set({archived: true})
    .where(eq(meetings.id, meetingId));

    redirect("/summary");

}