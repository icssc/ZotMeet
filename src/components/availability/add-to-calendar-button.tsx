"use client";

import { addMeetingToMyGoogleCalendar } from "@actions/availability/google/calendar/action";
import { Cached, Check } from "@mui/icons-material";
import GoogleIcon from "@mui/icons-material/Google";
import { Button } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import type { MeetingGoogleCalendarSnapshot } from "@/db/schema";
import { oauthLoginPath } from "@/lib/auth/return-to";
import type { UserProfile } from "@/lib/auth/user";
import {
	deriveAddToCalendarLabelState,
	INSUFFICIENT_SCOPE_REASON,
} from "@/lib/google-calendar/snapshot";

const RECONNECT_GOOGLE_ERRORS = new Set([
	"No OAuth refresh token",
	"Failed to refresh OAuth token",
]);

const CALENDAR_REASON_MESSAGES: Record<string, string> = {
	non_contiguous_schedule:
		"This meeting has separate time blocks, so it can't be added as a single event.",
	no_access_token: "Reconnect Google to add events to your calendar.",
};

function reasonMessage(status: "skipped" | "failed", reason: string): string {
	console.error("Add to calendar did not sync", { status, reason });
	return (
		CALENDAR_REASON_MESSAGES[reason] ??
		(status === "skipped"
			? "Could not add this meeting to your Google Calendar."
			: "Could not sync to Google Calendar. Please try again.")
	);
}

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
	const pathname = usePathname();
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
			router.push(oauthLoginPath("google", pathname));
			return;
		}

		startTransition(async () => {
			try {
				const response = await addMeetingToMyGoogleCalendar({ meetingId });
				if (!response.success) {
					if (RECONNECT_GOOGLE_ERRORS.has(response.error)) {
						showError("Connect Google to add events to your calendar.");
						router.push(oauthLoginPath("google", pathname));
						return;
					}
					showError(`Could not sync to Google Calendar: ${response.error}.`);
					return;
				}

				const result = response.result;
				if (result.status === "synced") {
					showSuccess("Synced to your Google Calendar.");
					router.refresh();
				} else if (
					result.status === "skipped" &&
					result.reason === INSUFFICIENT_SCOPE_REASON
				) {
					showError(
						"Reconnect Google to allow adding events to your calendar.",
					);
					router.push(oauthLoginPath("google", pathname));
				} else if (result.status === "skipped") {
					showError(reasonMessage(result.status, result.reason));
				} else {
					showError(reasonMessage(result.status, result.reason));
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
