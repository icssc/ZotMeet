"use client";

import { getGoogleCalendarPrefilledLink } from "@actions/availability/google/calendar/action";
import { saveAvailability } from "@actions/availability/save/action";
import {
	deleteScheduledTimeBlock,
	saveScheduledTimeBlock,
} from "@actions/meeting/schedule/action";
import GoogleIcon from "@mui/icons-material/Google";
//import { Button } from "@/components/ui/button";
import { Button } from "@mui/material";
import {
	CalendarCheck,
	CalendarPlus,
	CircleCheckIcon,
	CircleXIcon,
	DeleteIcon,
	EditIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import { DeleteModal } from "@/components/availability/header/delete-modal";
import { EditModal } from "@/components/availability/header/edit-modal";
import type { SelectMeeting } from "@/db/schema";
import type { UserProfile } from "@/lib/auth/user";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

interface AvailabilityHeaderProps {
	meetingData: SelectMeeting;
	user: UserProfile | null;
	availabilityDates: ZotDate[];
	onCancel: () => void;
	onSave: () => void;
	setChangeableTimezone: (can: boolean) => void;
	setTimezone: (timezone: string) => void;
}

export function AvailabilityHeader({
	meetingData,
	user,
	availabilityDates,
	onCancel,
	onSave,
	setChangeableTimezone,
	setTimezone,
}: AvailabilityHeaderProps) {
	const router = useRouter();

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
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isScheduled, setIsScheduled] = useState(meetingData.scheduled);
	const [isGeneratingLink, setIsGeneratingLink] = useState(false); // disable gcal button reclick while generating link

	const isOwner = !!user && meetingData.hostId === user.memberId;

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

		const response = await saveAvailability(availability);

		if (response.status === 200) {
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
			pendingAdds: state.pendingAdds,
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

			// Remove pending removals
			for (const timestamp of pendingRemovals) {
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

				await deleteScheduledTimeBlock({
					meetingId: meetingData.id,
					scheduledDate,
					scheduledFromTime,
					scheduledToTime,
				});
			}
			// Add new pending times
			for (const timestamp of pendingAdds) {
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

				await saveScheduledTimeBlock({
					meetingId: meetingData.id,
					scheduledDate,
					scheduledFromTime,
					scheduledToTime,
				});
			}

			// Move pending to scheduled after successful save
			commitPendingTimes();
			setIsScheduled(true);
			setAvailabilityView("group");
		} catch (error) {
			console.error("Failed to save meeting blocks", error);
		}
	};

	return (
		<>
			<div className="px-2 pt-8">
				<div className="flex items-start justify-between gap-x-4">
					<h1 className="line-clamp-1 truncate font-figtree font-medium text-xl md:text-3xl">
						{meetingData.title}
					</h1>

					<div className="flex shrink-0 space-x-2">
						{availabilityView === "personal" ||
						availabilityView === "schedule" ? (
							<>
								<Button
									variant="outlined"
									size="small"
									onClick={
										availabilityView === "personal"
											? handleCancel
											: handleScheduleCancel
									}
								>
									<span className="hidden md:flex">Cancel</span>
									<CircleXIcon />
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
									<CircleCheckIcon />
								</Button>
							</>
						) : (
							<>
								{isScheduled && (
									<Button
										size="small"
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
													toast.error(
														"Failed to generate Google Calendar link.",
													);
													return;
												}

												window.open(link, "_blank", "noopener,noreferrer");

												toast.success(
													"Google Calendar link opened! Confirm the event in your calendar.",
												);
											} catch (error) {
												console.error(
													"Error generating Google Calendar link:",
													error,
												);
												toast.error(
													"An error occurred while generating the Google Calendar link.",
												);
											} finally {
												setIsGeneratingLink(false);
											}
										}}
									>
										<GoogleIcon className="size-5" />
										<span className="hidden font-dm-sans md:flex">
											Add to Calendar
										</span>
									</Button>
								)}

								{isOwner && (
									<Button
										variant="contained"
										size="small"
										onClick={() => setAvailabilityView("schedule")}
									>
										<CalendarCheck className="size-5" />
										<span className="hidden font-dm-sans md:flex">
											Schedule Meeting
										</span>
									</Button>
								)}

								<Button
									variant="contained"
									size="small"
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
									<CalendarPlus className="size-5" />
									<span className="hidden font-dm-sans md:flex">
										{hasAvailability ? "Edit Availability" : "Add Availability"}
									</span>
								</Button>
							</>
						)}
					</div>
				</div>

				{isOwner && (
					<div className="-ml-2 flex items-center gap-x-1 pt-1">
						<Button
							onClick={() => setIsEditModalOpen(true)}
							variant="text"
							size="small"
							startIcon={<EditIcon />}
							sx={{ color: "text.secondary" }}
						>
							Edit Meeting
						</Button>

						<Button
							onClick={() => setIsDeleteModalOpen(true)}
							variant="text"
							size="small"
							startIcon={<DeleteIcon />}
							sx={{
								color: "text.secondary",
								"&:hover": { color: "error.main" },
							}}
						>
							Delete Meeting
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
		</>
	);
}
