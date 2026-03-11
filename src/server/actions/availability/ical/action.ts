"use server";

import {
	getExistingMeeting,
	getScheduledTimeBlocks,
} from "@data/meeting/queries";
import { generateICalString } from "@/lib/ical";

export async function getICalFileContent(meetingId: string) {
	const meetingData = await getExistingMeeting(meetingId);
	const blocks = await getScheduledTimeBlocks(meetingId);

	const icalContent = generateICalString(meetingData, blocks);

	return {
		success: icalContent !== null,
		content: icalContent,
		filename: `${meetingData.title.replace(/[^a-zA-Z0-9]/g, "_")}.ics`,
	};
}
