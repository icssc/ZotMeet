"use client";

import { getGoogleCalendarPrefilledLink } from "@actions/availability/google/calendar/action";
import { updateMeetingInvitePermissions } from "@actions/meeting/invite/action";
import {
	Create,
	GroupAddOutlined,
	InsertInvitationRounded,
} from "@mui/icons-material";
import GoogleIcon from "@mui/icons-material/Google";
import { Button, FormControlLabel, Switch } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import type { SelectMeeting } from "@/db/schema";
import { useReturnToPath } from "@/hooks/use-return-to-path";
import { loginPathWithReturnTo } from "@/lib/auth/return-to";
import type { UserProfile } from "@/lib/auth/user";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

export interface AvailabilityActionsProps {
	meetingData: SelectMeeting;
	user: UserProfile | null;
	handlePersonalCancel: () => void;
	handlePersonalSave: () => Promise<void>;
	handleScheduleCancel: () => void;
	handleScheduleSave: () => Promise<boolean>;
	isScheduled: boolean;
	setChangeableTimezone: (can: boolean) => void;
	setTimezone: (timezone: string) => void;
	onOpenInviteDialog: () => void;
	isMeetingDeletionPending?: boolean;
}

export function AvailabilityActions({
	meetingData,
	user,
	handlePersonalCancel,
	handlePersonalSave,
	handleScheduleCancel,
	handleScheduleSave,
	isScheduled,
	setChangeableTimezone,
	setTimezone,
	onOpenInviteDialog,
	isMeetingDeletionPending = false,
}: AvailabilityActionsProps) {
	const router = useRouter();
	const returnToPath = useReturnToPath();
	const { showSuccess, showError } = useSnackbar();
	const [isGeneratingLink, setIsGeneratingLink] = useState(false);
	const [membersCanInvite, setMembersCanInvite] = useState(
		meetingData.membersCanInvite,
	);
	const [isUpdatingPermissions, setIsUpdatingPermissions] = useState(false);

	const { hasAvailability, availabilityView, setAvailabilityView } =
		useAvailabilityStore(
			useShallow((state) => ({
				hasAvailability: state.hasAvailability,
				availabilityView: state.availabilityView,
				setAvailabilityView: state.setAvailabilityView,
			})),
		);

	const isOwner = !!user && meetingData.hostId === user.memberId;
	const canShowInviteButton = isOwner || membersCanInvite;

	useEffect(() => {
		setMembersCanInvite(meetingData.membersCanInvite);
	}, [meetingData.membersCanInvite]);

	const handleMembersCanInviteChange = useCallback(
		async (checked: boolean) => {
			setIsUpdatingPermissions(true);
			setMembersCanInvite(checked);

			try {
				const result = await updateMeetingInvitePermissions({
					meetingId: meetingData.id,
					membersCanInvite: checked,
				});

				if (!result.success) {
					setMembersCanInvite(!checked);
					showError(result.message);
				} else {
					showSuccess(result.message);
				}
			} catch (error) {
				console.error(error);
				setMembersCanInvite(!checked);
				showError("Failed to update invite permissions.");
			} finally {
				setIsUpdatingPermissions(false);
			}
		},
		[meetingData.id, showError, showSuccess],
	);

	const handleSaveClick = () => {
		const action =
			availabilityView === "personal" ? handlePersonalSave : handleScheduleSave;
		action().catch((error) => {
			console.error("Save failed", error);
		});
	};

	return (
		<div className="flex w-full flex-col gap-2">
			{availabilityView === "personal" || availabilityView === "schedule" ? (
				<div className="hidden flex-row flex-wrap justify-end gap-2 sm:flex">
					<Button
						variant="outlined"
						color="inherit"
						size="small"
						onClick={
							availabilityView === "personal"
								? handlePersonalCancel
								: handleScheduleCancel
						}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						size="small"
						type="submit"
						disabled={isMeetingDeletionPending}
						onClick={handleSaveClick}
					>
						Save
					</Button>
				</div>
			) : (
				<div className="flex flex-col gap-2">
					{isOwner && (
						<div className="hidden items-center justify-between rounded-md border p-2 sm:flex">
							<FormControlLabel
								control={
									<Switch
										checked={membersCanInvite}
										disabled={isUpdatingPermissions}
										onChange={(e) => {
											void handleMembersCanInviteChange(e.target.checked);
										}}
									/>
								}
								label="Allow members to invite others"
							/>
						</div>
					)}
					{isScheduled && (
						<div className="hidden flex-col sm:flex">
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
						</div>
					)}
					<div className="hidden sm:block">
						<Button
							variant="contained"
							startIcon={<Create sx={{ color: "inherit" }} />}
							className="w-full max-w-full normal-case"
							sx={{ py: 0.75 }}
							onClick={() => {
								if (!user) {
									router.push(loginPathWithReturnTo(returnToPath));
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
					</div>
					<div className="hidden sm:block">
						{isOwner && (
							<Button
								variant="outlined"
								startIcon={<InsertInvitationRounded />}
								className="w-full"
								sx={{ py: 0.75 }}
								onClick={() => setAvailabilityView("schedule")}
							>
								<span className="hidden md:flex">Schedule Meeting</span>
							</Button>
						)}
						{canShowInviteButton && (
							<Button
								variant="outlined"
								startIcon={<GroupAddOutlined />}
								className="w-full"
								sx={{ py: 0.75 }}
								onClick={onOpenInviteDialog}
							>
								<span className="hidden md:flex">Invite Members</span>
							</Button>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
