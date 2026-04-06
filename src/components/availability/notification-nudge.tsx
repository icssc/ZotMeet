"use client";
import { sendNotificationsToUsers } from "@actions/user/action";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
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
	const sendNotification = async () => {
		await sendNotificationsToUsers(
			[...notificationids],
			meetingData.title,
			"You have been notified about the meeting " + meetingData.title,
			meetingData.meetingType,
			window.location.href,
		);
	};
	return (
		<div className="pt-2">
			<Button onClick={sendNotification}>
				<NotificationsOutlinedIcon color="secondary" />
				Notify Everyone
			</Button>
		</div>
	);
}
