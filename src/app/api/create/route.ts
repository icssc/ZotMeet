import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromSession, insertMeeting } from "@/lib/db/databaseUtils";
import { CreateMeetingPostParams } from "@/lib/types/meetings";

export async function POST(request: NextRequest) {
    try {
        // Parse the incoming JSON body
        const body: CreateMeetingPostParams = await request.json();

        const {
            title,
            description,
            fromTime,
            toTime,
            meetingDates,
            sessionId,
        } = body;

        console.log(
            "Creating meeting:",
            title,
            description,
            fromTime,
            toTime,
            meetingDates
        );

        // Validate the input data
        if (fromTime >= toTime) {
            return NextResponse.json(
                { error: "From time must be before to time" },
                { status: 400 }
            );
        }

        if (!meetingDates || meetingDates.length === 0) {
            return NextResponse.json(
                { error: "At least one date must be provided" },
                { status: 400 }
            );
        }

        // Limit the number of dates to prevent abuse
        if (meetingDates.length > 100) {
            return NextResponse.json(
                { error: "Too many dates provided" },
                { status: 400 }
            );
        }

        // Sort the dates in UTC order
        const sortedDates = meetingDates
            .map((dateString) => new Date(dateString))
            .sort((a, b) => a.getTime() - b.getTime());

        // Retrieve the host ID if the session ID is provided
        const host_id = sessionId
            ? await getUserIdFromSession(sessionId)
            : undefined;

        // Prepare the meeting data
        const meeting = {
            title,
            description: description || "",
            from_time: fromTime,
            to_time: toTime,
            host_id,
        };

        // Insert the meeting into the database
        const meetingId = await insertMeeting(meeting, sortedDates);

        // Return the created meeting ID
        return NextResponse.json({ meetingId });
    } catch (err) {
        const error = err as Error;
        console.error("Error creating meeting:", error.message);

        // Return a 500 error response
        return NextResponse.json(
            { error: `Error creating meeting: ${error.message}` },
            { status: 500 }
        );
    }
}
