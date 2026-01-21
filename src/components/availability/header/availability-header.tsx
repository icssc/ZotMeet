"use client";

import { saveAvailability } from "@actions/availability/save/action";
import {
	CircleCheckIcon,
	CircleXIcon,
	DeleteIcon,
	EditIcon,
} from "lucide-react";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { DeleteModal } from "@/components/availability/header/delete-modal";
import { EditModal } from "@/components/availability/header/edit-modal";
import { Button } from "@/components/ui/button";
import type { SelectMeeting } from "@/db/schema";
import type { UserProfile } from "@/lib/auth/user";
import { cn } from "@/lib/utils";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityViewStore } from "@/store/useAvailabilityViewStore";

interface AvailabilityHeaderProps {
	meetingData: SelectMeeting;
	user: UserProfile | null;
	availabilityDates: ZotDate[];
	onCancel: () => void;
	onSave: () => void;
}

export function AvailabilityHeader({
	meetingData,
	user,
	availabilityDates,
	onCancel,
	onSave,
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

	const handleCancel = () => {
		onCancel();
		setAvailabilityView("group");
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

		// availabilityDates: ZotDate[]
		const availabilityTimes = availabilityDates.flatMap(
			(date) => date.availability,
		);

		const seen = new Set<string>();
		const dedupedAvailabilityTimes = availabilityTimes.filter((entry) => {
			const key = `${entry.time}|${entry.availabilityType}`;
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});

		const availability = {
			meetingId: meetingData.id,
			availabilityTimes: dedupedAvailabilityTimes,
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
										"h-8 min-h-fit flex-center border-yellow-500 bg-white px-2 text-yellow-500 uppercase outline md:w-28 md:p-0",
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
						) : (
							<Button
								className={cn(
									"h-8 min-h-fit min-w-fit flex-center px-2 md:w-40 md:p-0",
								)}
								onClick={() => {
									if (!user) {
										setIsAuthModalOpen(true);
										return;
									}
									setAvailabilityView("personal");
								}}
							>
								<span className="flex font-dm-sans">
									{hasAvailability ? "Edit Availability" : "Add Availability"}
								</span>
							</Button>
						)}
					</div>
				</div>
			</div>

			<AuthDialog
				open={isAuthModalOpen}
				setOpen={setIsAuthModalOpen}
				trigger={false}
			/>

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
