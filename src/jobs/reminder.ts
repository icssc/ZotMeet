export const handler = async () => {
	const siteUrl = process.env.SITE_URL;
	const secret = process.env.CRON_SECRET;

	if (!siteUrl || !secret) {
		console.error("Missing SITE_URL or CRON_SECRET environment variables");
		return;
	}

	const res = await fetch(`${siteUrl}/api/cron/reminders`, {
		headers: { Authorization: `Bearer ${secret}` },
	});

	const body = await res.json();
	console.log(`Reminder cron: status=${res.status}`, body);
};
