"use client";
import { getGoogleCalendarPrefilledLink } from "@actions/availability/google/calendar/action";
import {
	saveAvailability,
	saveIfNeeded,
} from "@actions/availability/save/action";
import {
	deleteScheduledTimeBlock,
	saveScheduledTimeBlock,
} from "@actions/meeting/schedule/action";
import GoogleIcon from "@mui/icons-material/Google";
import {
	AccessTime,
	CalendarMonth,
	ContentCopy,
	LocationOn,
	Settings,
	Create,
	InsertInvitationRounded 
} from "@mui/icons-material";
import { Button, IconButton, Paper, Typography } from "@mui/material";
import { DeleteIcon, MoreVerticalIcon, EditIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { DeleteModal } from "@/components/availability/header/delete-modal";
import { EditModal } from "@/components/availability/header/edit-modal";
import { InviteMembersDialog } from "@/components/availability/invite-members-dialog";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import type { SelectMeeting } from "@/db/schema";
import type { UserProfile } from "@/lib/auth/user";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";
import type { Availability } from "../availability";
import {
	formatDateToUSNumeric,
	formatTimeWithHoursAndMins,
} from "@/lib/availability/utils";
import { copyTextToClipboard } from "@/lib/clipboard/utils";

interface AvailabilityHeaderProps {
	meetingData: SelectMeeting;
	user: UserProfile | null;
	availabilityDates: ZotDate[];
	ifNeededDates: ZotDate[];
	onCancel: () => void;
	onSave: () => void;
	setChangeableTimezone: (can: boolean) => void;
	setTimezone: (timezone: string) => void;
	availabilityEditState: Availability;
	autoOpenInviteDialog?: boolean;
	inviteQueryInUrl?: boolean;
}

export function AvailabilityHeader({
	meetingData,
	user,
	availabilityDates,
	ifNeededDates,
	onCancel,
	onSave,
	setChangeableTimezone,
	setTimezone,
	availabilityEditState: _availabilityEditState,
	autoOpenInviteDialog = false,
	inviteQueryInUrl = false,
}: AvailabilityHeaderProps) {
	const router = useRouter();
	const pathname = usePathname();
	const { showSuccess, showError } = useSnackbar();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isInviteDialogOpen, setIsInviteDialogOpen] =
		useState(autoOpenInviteDialog);
	const [isScheduled, setIsScheduled] = useState(meetingData.scheduled);
	const [isGeneratingLink, setIsGeneratingLink] = useState(false); // disable gcal button reclick while generating link

	const isOwner = !!user && meetingData.hostId === user.memberId;
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

	const handleCancel = () => {
		onCancel();
		setChangeableTimezone(true);
		setAvailabilityView("group");
	};

	// const [isGuestDialogOpen, setIsGuestDialogOpen] = useState(false);
	// const [guestName, setGuestName] = useState("");

	const [_isAuthModalOpen, setIsAuthModalOpen] = useState(false);

	useEffect(() => {
		if (!inviteQueryInUrl) return;
		router.replace(pathname, { scroll: false });
	}, [inviteQueryInUrl, pathname, router]);

	const handleSave = async () => {
		if (!user) {
			// setIsGuestDialogOpen(true);

			return;
		}
		setChangeableTimezone(true);
		const availability = {
			meetingId: meetingData.id,
			availabilityTimes: availabilityDates.flatMap((date) => date.availability),
			displayName: user.displayName,
		};
		const ifNeeded = {
			meetingId: meetingData.id,
			availabilityTimes: ifNeededDates.flatMap((date) => date.availability),
			displayName: user.displayName,
		};
		const response = await saveAvailability(availability);

		const ifNeededResponse = await saveIfNeeded(ifNeeded);

		if (response.status === 200 && ifNeededResponse.status === 200) {
			setHasAvailability(true);
			setAvailabilityView("group");
			onSave();

			// Clear guest member name
			if (!user) {
				// setGuestName("");
			}
		} else {
			console.error("Error saving availability:", response.body.error);
		}
	};

	const { commitPendingTimes, clearPendingTimes } = useAvailabilityStore(
		useShallow((state) => ({
			commitPendingTimes: state.commitPendingTimes,
			clearPendingTimes: state.clearPendingTimes,
		})),
	);

	const handleScheduleCancel = () => {
		clearPendingTimes();
		setAvailabilityView("group");
	};

	const handleScheduleSave = async () => {
		try {
			const { pendingAdds, pendingRemovals } = useAvailabilityStore.getState();
			const toSchedulePayload = (timestamp: string) => {
				const date = new Date(timestamp);
				const scheduledDate = new Date(
					date.getFullYear(),
					date.getMonth(),
					date.getDate(),
				);
				const scheduledFromTime = date.toTimeString().slice(0, 8); // HH:mm:ss
				const scheduledToTime = new Date(date.getTime() + 15 * 60 * 1000)
					.toTimeString()
					.slice(0, 8);
				return {
					meetingId: meetingData.id,
					scheduledDate,
					scheduledFromTime,
					scheduledToTime,
				};
			};

			// Remove pending removals
			for (const timestamp of pendingRemovals) {
				await deleteScheduledTimeBlock(toSchedulePayload(timestamp));
			}
			// Add new pending times
			for (const timestamp of pendingAdds) {
				await saveScheduledTimeBlock(toSchedulePayload(timestamp));
			}

			if (pendingAdds.size > 0 || pendingRemovals.size > 0) {
				// Move pending to scheduled after successful save
				commitPendingTimes();
				const { scheduledTimes } = useAvailabilityStore.getState();
				setIsScheduled(scheduledTimes.size > 0);
			}
			setAvailabilityView("group");
		} catch (error) {
			console.error("Failed to save meeting blocks", error);
		}
	};

	const formattedStartDate = formatDateToUSNumeric(
		new Date(meetingData.dates[0]),
	);
	const formattedEndDate = formatDateToUSNumeric(
		new Date(meetingData.dates[meetingData.dates.length - 1]),
	);

	const formattedStartTime = formatTimeWithHoursAndMins(meetingData.fromTime);

	const formattedEndTime = formatTimeWithHoursAndMins(meetingData.toTime);

	async function handleCopy() {
		try {
			const copied = await copyTextToClipboard(meetingData.title);
			if (!copied) {
				throw new Error("Clipboard write failed");
			}
			showSuccess("Meeting name copied to clipboard");
		} catch (_clipboardError) {
			showError("Failed to copy Meeting name");
		}
	}

	return (
		<Paper variant="outlined" className="mt-10">
			<div className="flex flex-col gap-4">
				<div className="flex w-full items-center">
					<h1 className="line-clamp-1 min-w-0 self-start truncate font-medium text-xl md:text-3xl">
						{meetingData.title}
					</h1>

					<div className="ml-auto sm:ml-8">
						<IconButton size="small" onClick={handleCopy}>
							<ContentCopy />
						</IconButton>
					</div>

					{isOwner && (
						<div className="block sm:hidden">
							<IconButton size="small" onClick={() => setIsEditModalOpen(true)}>
								<MoreVerticalIcon />
							</IconButton>
						</div>
					)}
				</div>
				<div className="flex gap-8">
					<div className="flex items-center gap-2">
						<CalendarMonth fontSize="small" />
						<Typography color="textSecondary" className="whitespace-nowrap">
							{formattedStartDate} - {formattedEndDate}
						</Typography>
					</div>

					<div className="flex items-center gap-2">
						<AccessTime />
						<Typography color="textSecondary" className="whitespace-nowrap">
							{formattedStartTime} - {formattedEndTime}
						</Typography>
					</div>

					{meetingData.location && (
						<div>
							<LocationOn />
							<Typography color="textSecondary">
								{meetingData.location}
							</Typography>
						</div>
					)}

					<div className="order-2 flex w-full shrink-0 flex-col gap-2 self-start lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:w-full">
						{availabilityView === "personal" ||
						availabilityView === "schedule" ? (
							<div className="flex flex-wrap justify-end gap-2">
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
										availabilityView === "personal"
											? handleSave
											: handleScheduleSave
									}
								>
									<span className="hidden md:flex">Save</span>
								</Button>
							</div>
						) : (
							<div className="flex flex-wrap justify-end gap-2">
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
										setTimezone(
											Intl.DateTimeFormat().resolvedOptions().timeZone,
										);
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
											className="w-full"
											sx={{ py: 0.75 }}
											onClick={() => setIsInviteDialogOpen(true)}
										>
											<span className="hidden md:flex">Invite Members</span>
										</Button>
									</>
								)}
							</div>
						)}
					</div>

					{isOwner && (
						<div className="-ml-2 hidden items-center gap-x-1 sm:flex">
							<Button
								onClick={() => setIsEditModalOpen(true)}
								variant="text"
								size="medium"
								color="primary"
								startIcon={<Settings sx={{ color: "primary.main" }} />}
							>
								<Typography>Edit Meeting</Typography>
							</Button>

							<Button
								onClick={() => setIsDeleteModalOpen(true)}
								variant="text"
								size="medium"
								startIcon={<DeleteIcon />}
							>
								<Typography>Delete Meeting</Typography>
							</Button>
						</div>
					)}
				</div>

				<EditModal
					meetingData={meetingData}
					isOpen={isEditModalOpen}
					handleOpenChange={setIsEditModalOpen}
				/>

				<DeleteModal
					meetingData={meetingData}
					isOpen={isDeleteModalOpen}
					handleOpenChange={setIsDeleteModalOpen}
				/>
			</div>

			<InviteMembersDialog
				open={isInviteDialogOpen}
				onOpenChange={setIsInviteDialogOpen}
				meetingId={meetingData.id}
			/>
		</Paper>
	);
}
