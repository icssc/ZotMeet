import "server-only";

import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const ses = new SESv2Client({ region: "us-east-2" });

type SendEmailInput = {
	to: string;
	subject: string;
	text: string;
	html: string;
};

export async function sendEmail({ to, subject, text, html }: SendEmailInput) {
	const from = `ZotMeet <no-reply@icssc.club>`;

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

export async function sendEmailToEach(
	addresses: string[],
	email: Omit<SendEmailInput, "to">,
) {
	const results = await Promise.allSettled(
		addresses.map((to) => sendEmail({ to, ...email })),
	);

	for (const result of results) {
		if (result.status === "rejected") {
			console.error("Failed to send notification email: ", result.reason);
		}
	}
}
