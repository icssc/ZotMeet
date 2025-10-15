"use server";

export async function scheduleMeeting(
    meetingId: string,
    startIso: string,
    endIso: string
) {
    // Placeholder implementation: in production, update the meetings table to mark scheduled and store times.
    console.log(
        `Scheduling meeting ${meetingId} from ${startIso} to ${endIso}`
    );

    return {
        status: 200,
        body: {
            message: "Scheduled (placeholder)",
        },
    };
}
