"use client";

import { useState } from "react";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { Button } from "@/components/ui/button";
import { SelectMeeting } from "@/db/schema";
import { UserProfile } from "@/lib/auth/user";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityViewStore } from "@/store/useAvailabilityViewStore";
import { saveAvailability } from "@actions/availability/save/action";
import { deleteMeeting } from "@actions/meeting/delete/action";
import { editMeeting } from "@actions/meeting/edit/action";
import { CircleCheckIcon, CircleXIcon } from "lucide-react";

import EditingModal from "../edit/edit-modal";

interface AvailabilityHeaderProps {
    meetingData: SelectMeeting;
    user: UserProfile | null;
    availabilityDates: ZotDate[];
    onCancel: () => void;
}

export function AvailabilityHeader({
    meetingData,
    user,
    availabilityDates,
    onCancel,
}: AvailabilityHeaderProps) {
    const {
        hasAvailability,
        setHasAvailability,
        availabilityView,
        setAvailabilityView,
    } = useAvailabilityViewStore();

    // const [isGuestDialogOpen, setIsGuestDialogOpen] = useState(false);
    // const [guestName, setGuestName] = useState("");

    const [open, setOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [saved, setSaved] = useState(false);

    const handleDeleteMeeting = (meetingId: string) => {
        deleteMeeting(meetingId);
    };

    const handleEditSave = (meeting: {
        title: string;
        description: string;
        fromTime: `${string}:${string}:${string}`;
        toTime: `${string}:${string}:${string}`;
        timezone: string;
        meetingDates: string[];
    }) => {
        const newMeeting = {
            title: meeting.title,
            description: meeting.description,
            fromTime: meeting.fromTime,
            toTime: meeting.toTime,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            meetingDates: meeting.meetingDates.map((zotDate) =>
                new Date(zotDate).toISOString()
            ),
        };

        const result = editMeeting(meetingData.id, newMeeting);
        const error = result?.error;

        if (error) {
            console.error("Failed to create meeting: ", error);
        }

        setSaved(true);
        setIsModalOpen(false); // Close modal after saving
    };

    const handleCancel = () => {
        onCancel();
        setAvailabilityView("group");
    };

    const handleSave = async () => {
        if (!user) {
            // setIsGuestDialogOpen(true);

            return;
        }

        const availability = {
            meetingId: meetingData.id,
            availabilityTimes: availabilityDates.flatMap(
                (date) => date.availability
            ),
            displayName: user.displayName,
        };

        const response = await saveAvailability(availability);

        if (response.status === 200) {
            setHasAvailability(true);
            setAvailabilityView("group");

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
            <div className="flex items-center space-x-2 px-2 pt-8 md:px-4 md:pt-10">
                <h1 className="h-8 space-x-2 pr-2 font-montserrat text-xl font-medium md:h-fit md:text-3xl">
                    {meetingData.title}
                </h1>
                <div className="flex w-full flex-row justify-end space-x-2">
                    <button
                        onClick={openModal}
                        className="flex-center h-8 min-h-fit min-w-fit rounded bg-blue-600 px-2 font-dm-sans text-white md:w-40 md:p-0"
                    >
                        Edit Meeting
                    </button>
                    <button
                        onClick={() => {
                            handleDeleteMeeting(meetingData.id);
                        }}
                        className="flex-center h-8 min-h-fit min-w-fit rounded bg-blue-600 px-2 font-dm-sans text-white md:w-40 md:p-0"
                    >
                        Delete Meeting
                    </button>

                    <EditingModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        onSave={handleEditSave}
                    >
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => {
                                    handleEditSave;
                                }}
                                className="mt-4 rounded bg-green-500 px-3 py-1 text-white hover:bg-green-700"
                            >
                                Save
                            </button>
                        </div>
                    </EditingModal>

                    {availabilityView === "personal" ? (
                        <div className="flex space-x-2 md:space-x-4">
                            <Button
                                className={cn(
                                    "flex-center h-8 min-h-fit border-yellow-500 bg-white px-2 uppercase text-yellow-500 outline md:w-28 md:p-0",
                                    "hover:border-yellow-500 hover:bg-yellow-500 hover:text-white"
                                )}
                                onClick={handleCancel}
                            >
                                <span className="hidden md:flex">Cancel</span>
                                <CircleXIcon />
                            </Button>

                            <Button
                                className={cn(
                                    "flex-center h-8 min-h-fit border border-green-500 bg-white px-2 uppercase text-secondary md:w-24 md:p-0",
                                    "group hover:border-green-500 hover:bg-green-500"
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
                                "flex-center h-8 min-h-fit min-w-fit px-2 md:w-40 md:p-0"
                            )}
                            onClick={() => {
                                if (!user) {
                                    setOpen(true);
                                    return;
                                }
                                setAvailabilityView("personal");
                            }}
                        >
                            <span className="flex font-dm-sans">
                                {hasAvailability
                                    ? "Edit Availability"
                                    : "Add Availability"}
                            </span>
                        </Button>
                    )}
                </div>
            </div>

            <AuthDialog
                open={open}
                setOpen={setOpen}
                trigger={false}
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
