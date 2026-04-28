// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: "ZotMeet",
			removal: input?.stage === "production" ? "retain" : "remove",
			protect: ["production"].includes(input?.stage),
			home: "aws",
			providers: {
				aws: { region: "us-west-1" },
			},
		};
	},
	async run() {
		const domainName = `${$app.stage === "production" ? "" : `${$app.stage}.`}zotmeet.com`;
		const baseUrl = `https://${domainName}`;

		const emailDLQ = new sst.aws.Queue("ZotMeetEmailDLQ", {
			messageRetentionPeriod: "14 days",
		});

		const emailQueue = new sst.aws.Queue("ZotMeetEmailQueue", {
			visibilityTimeout: "3 minutes",
			messageRetentionPeriod: "14 days",
			dlq: {
				queue: emailDLQ.arn,
				retry: 3,
			},
		});

		const emailProcessorLambda = new sst.aws.Function(
			"ZotMeetEmailProcessorLambda",
			{
				handler: "src/email/emailProcessor.handler",
				timeout: "30 seconds",
				memory: "512 MB",
				reservedConcurrency: 1,
				environment: {
					NODE_ENV: $app.stage === "production" ? "production" : "development",
					STAGE: $app.stage,
				},
				permissions: [
					{
						actions: ["ses:SendEmail"],
						resources: [
							"arn:aws:ses:us-east-2:990864464737:identity/icssc@uci.edu",
						],
					},
					{
						actions: [
							"sqs:ReceiveMessage",
							"sqs:DeleteMessage",
							"sqs:GetQueueAttributes",
						],
						resources: [emailQueue.arn],
					},
				],
			},
		);

		emailQueue.subscribe(emailProcessorLambda.arn, {
			batch: {
				size: 14,
				window: "1.25 seconds",
				partialResponses: true,
			},
		});

		new sst.aws.Nextjs("site", {
			environment: {
				DATABASE_URL: process.env.DATABASE_URL ?? "localhost:3000",
				OIDC_CLIENT_ID: process.env.OIDC_CLIENT_ID!,
				OIDC_ISSUER_URL: process.env.OIDC_ISSUER_URL!,
				GOOGLE_OAUTH_REDIRECT_URI: `${baseUrl}/auth/login/google/callback`,
				NEXT_PUBLIC_BASE_URL: baseUrl,
				EMAIL_QUEUE_URL: emailQueue.url,
			},
			cachePolicy: "e6e88864-aee5-41aa-b393-c48f78e33d2d",
			domain: {
				name: domainName,
				dns: sst.aws.dns({
					zone: "Z0670880YRIE7KPL5SPX",
				}),
			},
		});
	},
});
