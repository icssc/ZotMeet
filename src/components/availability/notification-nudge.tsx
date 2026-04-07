"use client";
import { sendNotificationsToUsers } from "@actions/user/action";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { SelectMeeting } from "@/db/schema";
import type { MemberMeetingAvailability } from "@/lib/types/availability";
export function NotificationNudge({
	meetingData,
	allAvailabilities,
}: {
	meetingData: SelectMeeting;
	allAvailabilities: MemberMeetingAvailability[];
}) {
	const notificationids = new Set<string>();
	for (const availability of allAvailabilities) {
		if (!notificationids.has(availability.memberId)) {
			notificationids.add(availability.memberId);
		}
	}

	const [notificationSuccess, setNotificationSuccess] = useState<
		boolean | null
	>(null);
	const sendNotification = async () => {
		try {
			await sendNotificationsToUsers(
				[...notificationids],
				meetingData.title,
				"You have been notified about the meeting " + meetingData.title,
				meetingData.meetingType,
				window.location.href,
			);
			setNotificationSuccess(true);
		} catch (error) {
			console.error("Error sending notifications:", error);
			setNotificationSuccess(false);
		}
	};
	if (notificationSuccess != null) {
		if (notificationSuccess) {
			return (
				<div className="pt-2">
					<Button onClick={sendNotification}>
						<NotificationsOutlinedIcon color="secondary" />
						Notify Everyone
					</Button>
					<Alert
						severity="success"
						onClose={() => setNotificationSuccess(null)}
					>
						Notifications sent successfully!
					</Alert>
				</div>
			);
		} else {
			<div className="pt-2">
				<Button onClick={sendNotification}>
					<NotificationsOutlinedIcon color="secondary" />
					Notify Everyone
				</Button>
				<Alert severity="error" onClose={() => setNotificationSuccess(null)}>
					Failed to send notifications.
				</Alert>
			</div>;
		}
	} else {
		return (
			<div className="pt-2">
				<Button onClick={sendNotification}>
					<NotificationsOutlinedIcon color="secondary" />
					Notify Everyone
				</Button>
			</div>
		);
	}
}
