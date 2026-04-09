"use client";
import { getUser, sendNotificationsToUsers } from "@actions/user/action";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
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
		console.log(allAvailabilities);
		if (!notificationids.has(availability.memberId)) {
			notificationids.add(availability.memberId);
		}
	}

	const [notificationSuccess, setNotificationSuccess] =
		useState<boolean>(false);
	const [notificationFailure, setNotificationFailure] =
		useState<boolean>(false);
	const sendNotification = async () => {
		try {
			const name = await getUser();
			console.log(window.location.href);
			await sendNotificationsToUsers(
				[...notificationids],
				meetingData.title,
				name?.displayName + " is requesting your availability",
				meetingData.meetingType,
				window.location.href,
			);
			setNotificationSuccess(true);
		} catch (error) {
			console.error("Error sending notifications:", error);
			setNotificationFailure(true);
		}
	};
	return (
		<div className="pt-2">
			<Button
				className="h-8 min-h-fit min-w-fit flex-center md:px-4 md:py-0"
				onClick={sendNotification}
				variant="contained"
			>
				<NotificationsOutlinedIcon sx={{ color: "#fff" }} />
				Notify Everyone
			</Button>
			<Snackbar
				open={notificationSuccess}
				onClose={() => {
					setNotificationSuccess(false);
				}}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				message="Notification Sent Successfully!"
				action={
					<IconButton
						size="small"
						onClick={() => setNotificationSuccess(false)}
					>
						<CloseIcon sx={{ color: "#fff" }} fontSize="small" />
					</IconButton>
				}
			/>
			<Snackbar
				open={notificationFailure}
				onClose={() => {
					setNotificationFailure(false);
				}}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				message="Failed to send notification..."
				action={
					<IconButton
						size="small"
						onClick={() => setNotificationFailure(false)}
					>
						<CloseIcon sx={{ color: "#fff" }} fontSize="small" />
					</IconButton>
				}
			/>
		</div>
	);
}
