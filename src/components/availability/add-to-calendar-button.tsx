"use client";

import { addMeetingToMyGoogleCalendar } from "@actions/availability/google/calendar/action";
import { Cached, Check } from "@mui/icons-material";
import GoogleIcon from "@mui/icons-material/Google";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import type { MeetingGoogleCalendarSnapshot } from "@/db/schema";
import type { UserProfile } from "@/lib/auth/user";
import { deriveAddToCalendarLabelState } from "@/lib/google-calendar/snapshot";

type AddToCalendarButtonProps = {
	meetingId: string;
	user: UserProfile | null;
	mergedScheduledInterval: MeetingGoogleCalendarSnapshot | null;
	googleCalendarLinkSnapshot: MeetingGoogleCalendarSnapshot | null;
	className?: string;
};

export function AddToCalendarButton({
	meetingId,
	user,
	mergedScheduledInterval,
	googleCalendarLinkSnapshot,
	className,
}: AddToCalendarButtonProps) {
	const router = useRouter();
	const { showSuccess, showError } = useSnackbar();
	const [isPending, startTransition] = useTransition();

	const state = deriveAddToCalendarLabelState({
		storedSnapshot: googleCalendarLinkSnapshot,
		currentInterval: mergedScheduledInterval,
	});

	if (state === "non_contiguous") {
		// Schedule is non-contiguous (multi-interval) — API write isn't supported.
		return null;
	}

	let label: string;
	let icon: React.ReactNode;
	let disabled = isPending;

	switch (state) {
		case "add":
			label = "Add to Calendar";
			icon = <GoogleIcon sx={{ fontSize: 18 }} />;
			break;
		case "drifted":
			label = "Update Calendar Event";
			icon = <Cached sx={{ fontSize: 18 }} />;
			break;
		case "in_sync":
			label = "Added to Calendar";
			icon = <Check sx={{ fontSize: 18 }} />;
			disabled = true;
			break;
	}

	const handleClick = () => {
		if (!user) {
			router.push("/auth/login/google");
			return;
		}

		startTransition(async () => {
			try {
				const response = await addMeetingToMyGoogleCalendar({ meetingId });
				if (!response.success) {
					showError(`Could not sync to Google Calendar: ${response.error}.`);
					return;
				}

				const result = response.result;
				if (result.status === "synced") {
					showSuccess("Synced to your Google Calendar.");
					router.refresh();
				} else if (result.status === "skipped") {
					showError(`Skipped: ${result.reason}.`);
				} else {
					showError(`Sync failed: ${result.reason}.`);
				}
			} catch (error) {
				console.error("AddToCalendarButton error", error);
				showError("An error occurred syncing to Google Calendar.");
			}
		});
	};

	return (
		<Button
			variant="outlined"
			size="medium"
			startIcon={icon}
			disabled={disabled}
			onClick={handleClick}
			className={className}
		>
			{isPending ? "Syncing..." : label}
		</Button>
	);
}
