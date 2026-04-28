import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import type { SQSBatchResponse, SQSHandler } from "aws-lambda";
import {
	buildMeetingInviteEmail,
	type MeetingInviteEmailData,
} from "./templates/meetingInvite";

const ses = new SESClient({ region: "us-east-2" });
const SENDER = "icssc@uci.edu";

export interface EmailJob {
	type: "meeting_invite";
	to: string;
	data: MeetingInviteEmailData;
}

export const handler: SQSHandler = async (event): Promise<SQSBatchResponse> => {
	const failures: SQSBatchResponse["batchItemFailures"] = [];

	for (const record of event.Records) {
		try {
			const job = JSON.parse(record.body) as EmailJob;

			let subject: string;
			let html: string;

			switch (job.type) {
				case "meeting_invite":
					subject = `You've been invited to ${job.data.meetingTitle}`;
					html = buildMeetingInviteEmail(job.data);
					break;
				default:
					console.warn(`Unknown email job type: ${job.type}`);
					continue;
			}

			await ses.send(
				new SendEmailCommand({
					Source: SENDER,
					Destination: { ToAddresses: [job.to] },
					Message: {
						Subject: { Data: subject },
						Body: { Html: { Data: html } },
					},
				}),
			);
		} catch (err) {
			console.error(`Failed to process record ${record.messageId}:`, err);
			failures.push({ itemIdentifier: record.messageId });
		}
	}

	return { batchItemFailures: failures };
};
