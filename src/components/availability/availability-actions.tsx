"use client";

import { Create, Event, GroupAddOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { AddToCalendarButton } from "@/components/availability/add-to-calendar-button";
import type { MeetingGoogleCalendarSnapshot, SelectMeeting } from "@/db/schema";
import { useReturnToPath } from "@/hooks/use-return-to-path";
import { loginPathWithReturnTo } from "@/lib/auth/return-to";
import type { UserProfile } from "@/lib/auth/user";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

export interface AvailabilityActionsProps {
	meetingData: SelectMeeting;
	user: UserProfile | null;
	membersCanInvite: boolean;
	handlePersonalCancel: () => void;
	handlePersonalSave: () => Promise<void>;
	handleScheduleCancel: () => void;
	handleScheduleSave: () => Promise<boolean>;
	isScheduleSaving?: boolean;
	isScheduled: boolean;
	setChangeableTimezone: (can: boolean) => void;
	setTimezone: (timezone: string) => void;
	onOpenInviteDialog: () => void;
	isMeetingDeletionPending?: boolean;
	mergedScheduledInterval?: MeetingGoogleCalendarSnapshot | null;
	googleCalendarLinkSnapshot?: MeetingGoogleCalendarSnapshot | null;
}

export function AvailabilityActions({
	meetingData,
	user,
	membersCanInvite,
	handlePersonalCancel,
	handlePersonalSave,
	handleScheduleCancel,
	handleScheduleSave,
	isScheduleSaving = false,
	isScheduled,
	setChangeableTimezone,
	setTimezone,
	onOpenInviteDialog,
	isMeetingDeletionPending = false,
	mergedScheduledInterval = null,
	googleCalendarLinkSnapshot = null,
}: AvailabilityActionsProps) {
	const router = useRouter();
	const returnToPath = useReturnToPath();

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
						size="small"
						disabled={availabilityView === "schedule" && isScheduleSaving}
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
						disabled={
							isMeetingDeletionPending ||
							(availabilityView === "schedule" && isScheduleSaving)
						}
						onClick={handleSaveClick}
					>
						Save
					</Button>
				</div>
			) : (
				<div className="flex flex-col gap-2">
					{isScheduled && (
						<div className="hidden flex-col sm:flex">
							<AddToCalendarButton
								meetingId={meetingData.id}
								user={user}
								mergedScheduledInterval={mergedScheduledInterval}
								googleCalendarLinkSnapshot={googleCalendarLinkSnapshot}
							/>
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
					<div className="hidden sm:flex sm:flex-col sm:gap-2">
						{isOwner && (
							<Button
								variant="outlined"
								startIcon={<Event />}
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
