"use client";

import { saveAvailability } from "@actions/availability/save/action";
import {
	deleteScheduledTimeBlock,
	saveScheduledTimeBlock,
} from "@actions/meeting/schedule/action";
import {
	CircleCheckIcon,
	CircleXIcon,
	DeleteIcon,
	EditIcon,
} from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { DeleteModal } from "@/components/availability/header/delete-modal";
import { EditModal } from "@/components/availability/header/edit-modal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { SelectMeeting } from "@/db/schema";
import type { UserProfile } from "@/lib/auth/user";
import { cn } from "@/lib/utils";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityViewStore } from "@/store/useAvailabilityViewStore";
import { useBestTimesToggleStore } from "@/store/useBestTimesToggleStore";
import { useScheduleSelectionStore } from "@/store/useScheduleSelectionStore";

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
	const {
		hasAvailability,
		availabilityView,
		setHasAvailability,
		setAvailabilityView,
	} = useAvailabilityViewStore(
		useShallow((state) => ({
			hasAvailability: state.hasAvailability,
			availabilityView: state.availabilityView,
			setHasAvailability: state.setHasAvailability,
			setAvailabilityView: state.setAvailabilityView,
		})),
	);

	const { enabled: showBestTimes, setEnabled: setShowBestTimes } =
		useBestTimesToggleStore(
			useShallow((state) => ({
				enabled: state.enabled,
				setEnabled: state.setEnabled,
			})),
		);

	const handleCancel = () => {
		onCancel();
		setChangeableTimezone(true);
		setAvailabilityView("group");
	};

	const { pendingAdds, commitPendingTimes, clearPendingTimes } =
		useScheduleSelectionStore(
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
			const { pendingAdds, pendingRemovals } =
				useScheduleSelectionStore.getState();

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
			setAvailabilityView("group");
		} catch (error) {
			console.error("Failed to save meeting blocks", error);
		}
	};

	// const [isGuestDialogOpen, setIsGuestDialogOpen] = useState(false);
	// const [guestName, setGuestName] = useState("");

	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

	return (
		<>
			<div className="flex-between gap-x-2 px-2 pt-8 md:px-4 md:pt-10">
				<h1 className="line-clamp-1 h-8 truncate font-medium font-montserrat text-xl md:h-fit md:text-3xl">
					{meetingData.title}
				</h1>

				<div className="flex flex-row items-center gap-x-2">
					{isOwner && (
						<>
							<Button
								onClick={() => setIsEditModalOpen(true)}
								variant="outline"
								className="h-full min-h-fit min-w-fit flex-center rounded font-dm-sans"
							>
								<EditIcon className="text-2xl" />
							</Button>

							<Button
								onClick={() => setIsDeleteModalOpen(true)}
								variant="outline"
								className="h-full min-h-fit min-w-fit flex-center rounded font-dm-sans"
							>
								<DeleteIcon className="text-2xl" />
							</Button>
						</>
					)}
					<div className="flex flex-row justify-end space-x-2">
						{availabilityView === "personal" ? (
							<div className="flex space-x-2 md:space-x-4">
								<Button
									className={cn(
										"h-8 min-h-fit flex-center border border-yellow-500 bg-white px-2 text-yellow-500 uppercase md:w-28 md:p-0",
										"hover:border-yellow-500 hover:bg-yellow-500 hover:text-white",
									)}
									onClick={handleCancel}
								>
									<span className="hidden md:flex">Cancel</span>
									<CircleXIcon />
								</Button>
								<Button
									className={cn(
										"h-8 min-h-fit flex-center border border-green-500 bg-white px-2 text-secondary uppercase md:w-24 md:p-0",
										"group hover:border-green-500 hover:bg-green-500",
									)}
									type="submit"
									onClick={handleSave}
								>
									<span className="hidden text-green-500 group-hover:text-white md:flex">
										Save
									</span>
									<CircleCheckIcon className="text-green-500 group-hover:text-white" />
								</Button>
							</div>
						) : availabilityView === "schedule" ? (
							<div className="flex space-x-2 md:space-x-4">
								<Button
									className={cn(
										"h-8 min-h-fit flex-center border border-yellow-500 bg-white px-2 text-yellow-500 uppercase md:w-24 md:p-0",
										"group hover:border-yellow-500 hover:bg-yellow-500 hover:text-white",
									)}
									onClick={handleScheduleCancel}
								>
									<span className="hidden md:flex">Cancel</span>
									<CircleXIcon />
								</Button>
								<Button
									className={cn(
										"h-8 min-h-fit flex-center border border-green-500 bg-white px-2 text-secondary uppercase md:w-24 md:p-0",
										"group hover:border-green-500 hover:bg-green-500",
									)}
									type="submit"
									onClick={handleScheduleSave}
								>
									<span className="hidden text-green-500 group-hover:text-white md:flex">
										Save
									</span>
									<CircleCheckIcon className="text-green-500 group-hover:text-white" />
								</Button>
							</div>
						) : (
							<div className="flex space-x-2">
								{isOwner && (
									<Button
										className={cn(
											"h-8 min-h-fit min-w-fit flex-center px-2 md:w-40 md:p-0",
										)}
										onClick={() => {
											setAvailabilityView("schedule");
										}}
									>
										<span className="flex font-dm-sans">Schedule Meeting</span>
									</Button>
								)}
								<Button
									className={cn(
										"h-8 min-h-fit min-w-fit flex-center px-2 md:w-40 md:p-0",
									)}
									onClick={() => {
										if (!user) {
											setIsAuthModalOpen(true);
											redirect("/auth/login/google");
										}
										setChangeableTimezone(false);
										setTimezone(
											Intl.DateTimeFormat().resolvedOptions().timeZone,
										);
										setAvailabilityView("personal");
									}}
								>
									<span className="flex font-dm-sans">
										{hasAvailability ? "Edit Availability" : "Add Availability"}
									</span>
								</Button>
							</div>
						)}
						<div className="flex items-center space-x-2">
							<Switch
								checked={showBestTimes}
								onCheckedChange={setShowBestTimes}
							/>
							<span className="flex font-dm-sans">Best Times</span>
						</div>
					</div>
				</div>
			</div>

			{/*<AuthDialog />*/}

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

			{/* <GuestDialog
                isGuestDialogOpen={isGuestDialogOpen}
                setIsGuestDialogOpen={setIsGuestDialogOpen}
                guestName={guestName}
                setGuestName={setGuestName}
                saveAvailabilityData={saveAvailabilityData}
            /> */}
		</>
	);
}
