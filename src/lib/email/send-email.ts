import "server-only";

import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { Resource } from "sst";

const ses = new SESv2Client({});

type SendEmailInput = {
	to: string;
	subject: string;
	text: string;
	html: string;
};

export async function sendEmail({ to, subject, text, html }: SendEmailInput) {
	const from = `ZotMeet <notifications@${Resource.NotificationEmail.sender}>`;

	await ses.send(
		new SendEmailCommand({
			FromEmailAddress: from,
			Destination: { ToAddresses: [to] },
			Content: {
				Simple: {
					Subject: { Data: subject, Charset: "UTF-8" },
					Body: {
						Text: { Data: text, Charset: "UTF-8" },
						Html: { Data: html, Charset: "UTF-8" },
					},
				},
			},
		}),
	);
}
