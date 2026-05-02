"use client";

import { getGoogleCalendarPrefilledLink } from "@actions/availability/google/calendar/action";
import {
	Create,
	GroupAddOutlined,
	InsertInvitationRounded,
} from "@mui/icons-material";
import GoogleIcon from "@mui/icons-material/Google";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import type { SelectMeeting } from "@/db/schema";
import type { UserProfile } from "@/lib/auth/user";
import {
	savePersonalAvailabilityChanges,
	saveScheduleChanges,
} from "@/lib/meetings/save/utils";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

export interface AvailabilityActionsProps {
	meetingData: SelectMeeting;
	user: UserProfile | null;
	availabilityDates: ZotDate[];
	ifNeededDates: ZotDate[];
	onCancel: () => void;
	onSave: () => void;
	setChangeableTimezone: (can: boolean) => void;
	setTimezone: (timezone: string) => void;
	onOpenInviteDialog: () => void;
}

export function AvailabilityActions({
	meetingData,
	user,
	availabilityDates,
	ifNeededDates,
	onCancel,
	onSave,
	setChangeableTimezone,
	setTimezone,
	onOpenInviteDialog,
}: AvailabilityActionsProps) {
	const router = useRouter();
	const { showSuccess, showError } = useSnackbar();
	const [_isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [isScheduled, setIsScheduled] = useState(meetingData.scheduled);
	const [isGeneratingLink, setIsGeneratingLink] = useState(false);

	const {
		hasAvailability,
		availabilityView,
		setHasAvailability,
		setAvailabilityView,
	} = useAvailabilityStore(
		useShallow((state) => ({
			hasAvailability: state.hasAvailability,
			availabilityView: state.availabilityView,
			setHasAvailability: state.setHasAvailability,
			setAvailabilityView: state.setAvailabilityView,
		})),
	);

	const { commitPendingTimes, clearPendingTimes } = useAvailabilityStore(
		useShallow((state) => ({
			commitPendingTimes: state.commitPendingTimes,
			clearPendingTimes: state.clearPendingTimes,
		})),
	);

	const isOwner = !!user && meetingData.hostId === user.memberId;

	const handleCancel = () => {
		onCancel();
		setChangeableTimezone(true);
		setAvailabilityView("group");
	};

	const handleSave = async () => {
		setChangeableTimezone(true);
		const didSave = await savePersonalAvailabilityChanges({
			meetingId: meetingData.id,
			user,
			availabilityDates,
			ifNeededDates,
		});
		if (didSave) {
			setHasAvailability(true);
			setAvailabilityView("group");
			onSave();
		}
	};

	const handleScheduleCancel = () => {
		clearPendingTimes();
		setAvailabilityView("group");
	};

	const handleScheduleSave = async () => {
		try {
			const { pendingAdds, pendingRemovals } = useAvailabilityStore.getState();
			const didSave = await saveScheduleChanges({
				meetingId: meetingData.id,
				pendingAdds,
				pendingRemovals,
				onError: showError,
			});
			if (!didSave) return;

			if (pendingAdds.size > 0 || pendingRemovals.size > 0) {
				commitPendingTimes();
				const { scheduledTimes } = useAvailabilityStore.getState();
				setIsScheduled(scheduledTimes.size > 0);
			}
			setAvailabilityView("group");
		} catch (error) {
			console.error("Failed to save meeting blocks", error);
			showError("Failed to save meeting schedule. Please try again.");
		}
	};

	return (
		<div className="flex w-full flex-col gap-2">
			{availabilityView === "personal" || availabilityView === "schedule" ? (
				<div className="flex flex-row flex-wrap justify-end gap-2">
					<Button
						variant="outlined"
						color="inherit"
						size="small"
						onClick={
							availabilityView === "personal"
								? handleCancel
								: handleScheduleCancel
						}
					>
						<span className="hidden md:flex">Cancel</span>
					</Button>
					<Button
						variant="contained"
						size="small"
						type="submit"
						onClick={
							availabilityView === "personal" ? handleSave : handleScheduleSave
						}
					>
						<span className="hidden md:flex">Save</span>
					</Button>
				</div>
			) : (
				<div className="flex flex-col gap-2">
					{isScheduled && (
						<Button
							variant="outlined"
							size="medium"
							startIcon={<GoogleIcon sx={{ fontSize: 18 }} />}
							onClick={async () => {
								if (isGeneratingLink) return;
								setIsGeneratingLink(true);
								try {
									const { success, link } =
										await getGoogleCalendarPrefilledLink({
											meetingId: meetingData.id,
											meetingTitle: meetingData.title,
											meetingDescription: meetingData.description,
											meetingLocation: meetingData.location,
											timezone: meetingData.timezone,
										});

									if (!success || !link) {
										showError("Failed to generate Google Calendar link.");
										return;
									}

									window.open(link, "_blank", "noopener,noreferrer");
									showSuccess(
										"Google Calendar link opened! Confirm the event in your calendar.",
									);
								} catch (error) {
									console.error(
										"Error generating Google Calendar link:",
										error,
									);
									showError(
										"An error occurred while generating the Google Calendar link.",
									);
								} finally {
									setIsGeneratingLink(false);
								}
							}}
						>
							Add to Calendar
						</Button>
					)}
					<div className="hidden flex-col gap-2 sm:flex">
						<Button
							variant="contained"
							startIcon={<Create sx={{ color: "inherit" }} />}
							className="w-full max-w-full normal-case"
							sx={{ py: 0.75 }}
							onClick={() => {
								if (!user) {
									setIsAuthModalOpen(true);
									router.push("/auth/login/google");
									return;
								}
								setChangeableTimezone(false);
								setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
								setAvailabilityView("personal");
							}}
						>
							<span className="hidden md:flex">
								{hasAvailability ? "Edit Availability" : "Add Availability"}
							</span>
						</Button>
						{isOwner && (
							<>
								<Button
									variant="outlined"
									startIcon={<InsertInvitationRounded />}
									className="w-full"
									sx={{ py: 0.75 }}
									onClick={() => setAvailabilityView("schedule")}
								>
									<span className="hidden md:flex">Schedule Meeting</span>
								</Button>
								<Button
									variant="outlined"
									startIcon={<GroupAddOutlined />}
									className="w-full"
									sx={{ py: 0.75 }}
									onClick={onOpenInviteDialog}
								>
									<span className="hidden md:flex">Invite Members</span>
								</Button>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
