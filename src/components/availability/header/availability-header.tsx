"use client";

import { useState } from "react";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { DeleteModal } from "@/components/availability/header/delete-modal";
import { EditModal } from "@/components/availability/header/edit-modal";
import { Button } from "@/components/ui/button";
import { SelectMeeting } from "@/db/schema";
import { UserProfile } from "@/lib/auth/user";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";
import { useAvailabilityViewStore } from "@/store/useAvailabilityViewStore";
import { saveAvailability } from "@actions/availability/save/action";
import { meet } from "googleapis/build/src/apis/meet";
import {
    CircleCheckIcon,
    CircleXIcon,
    DeleteIcon,
    EditIcon,
} from "lucide-react";
import { toast } from "sonner";

interface AvailabilityHeaderProps {
    meetingData: SelectMeeting;
    user: UserProfile | null;
    availabilityDates: ZotDate[];
    onCancel: () => void;
    onScheduleCancel: () => void;
    onSave: () => void;
}

export function AvailabilityHeader({
    meetingData,
    user,
    availabilityDates,
    onCancel,
    onScheduleCancel,
    onSave,
}: AvailabilityHeaderProps) {
    const {
        hasAvailability,
        setHasAvailability,
        availabilityView,
        setAvailabilityView,
    } = useAvailabilityViewStore();

    const handleMeetingExport = () => {
        if (!user) {
            return;
        }
        if (!meetingData.scheduled) {
            toast.error("Meeting has not been scheduled yet.");
            return;
        }

        const params = new URLSearchParams({
            action: "TEMPLATE",
            text: meetingData.title,
            details: meetingData.description || "",
            location: "TBD",
            dates: `${meetingData.scheduledFromTime}/${meetingData.scheduledToTime}`,
        });

        const calendarUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;
        window.open(calendarUrl, "_blank");
    };
    const handleCancel = () => {
        onCancel();
        setAvailabilityView("group");
    };

    // const [isGuestDialogOpen, setIsGuestDialogOpen] = useState(false);
    // const [guestName, setGuestName] = useState("");

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
                <h1 className="line-clamp-1 h-8 truncate font-montserrat text-xl font-medium md:h-fit md:text-3xl">
                    {meetingData.title}
                </h1>

                <div className="flex flex-row items-center gap-x-2">
                    <Button
                        onClick={() => setIsEditModalOpen(true)}
                        variant="outline"
                        className="flex-center h-full min-h-fit min-w-fit rounded font-dm-sans"
                    >
                        <EditIcon className="text-2xl" />
                    </Button>

                    <Button
                        onClick={() => setIsDeleteModalOpen(true)}
                        variant="outline"
                        className="flex-center h-full min-h-fit min-w-fit rounded font-dm-sans"
                    >
                        <DeleteIcon className="text-2xl" />
                    </Button>

                    <div className="flex flex-row justify-end space-x-2">
                        {availabilityView === "personal" ? (
                            <div className="flex space-x-2 md:space-x-4">
                                <Button
                                    className={cn(
                                        "flex-center h-8 min-h-fit border-yellow-500 bg-white px-2 uppercase text-yellow-500 outline md:w-28 md:p-0",
                                        "hover:border-yellow-500 hover:bg-yellow-500 hover:text-white"
                                    )}
                                    onClick={handleCancel}
                                >
                                    <span className="hidden md:flex">
                                        Cancel
                                    </span>
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
                        ) : availabilityView === "group" ? (
                            <div className="flex space-x-2 md:space-x-4">
                                <Button
                                    className={cn(
                                        "flex-center h-8 min-h-fit min-w-fit px-2 md:w-40 md:p-0"
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
                                        {hasAvailability
                                            ? "Edit Availability"
                                            : "Add Availability"}
                                    </span>
                                </Button>
                                <Button
                                    className={cn(
                                        "flex-center h-8 min-h-fit border border-yellow-600 bg-white px-2 uppercase text-yellow-600 outline md:w-40 md:p-0",
                                        "hover:border-yellow-600 hover:bg-yellow-600 hover:text-white"
                                    )}
                                    onClick={() => {
                                        if (!user) {
                                            setIsAuthModalOpen(true);
                                            return;
                                        }
                                        setAvailabilityView("schedule");
                                    }}
                                >
                                    <span className="flex font-dm-sans">
                                        Schedule Meeting
                                    </span>
                                </Button>
                                <Button
                                    className={cn(
                                        "flex-center h-8 min-h-fit border border-yellow-600 bg-white px-2 uppercase text-yellow-600 outline md:w-10 md:p-0",
                                        "hover:border-yellow-600 hover:bg-yellow-600 hover:text-white"
                                    )}
                                    onClick={() => {
                                        if (!user) {
                                            setIsAuthModalOpen(true);
                                            return;
                                        }
                                        handleMeetingExport();
                                    }}
                                >
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/768px-Google_Calendar_icon_%282020%29.svg.png?20221106121915"
                                        alt="calendar icon"
                                        className="h-4 w-4"
                                    />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex space-x-2 md:space-x-4">
                                <Button
                                    className={cn(
                                        "flex-center h-8 min-h-fit border-yellow-500 bg-white px-2 uppercase text-yellow-500 outline md:w-28 md:p-0",
                                        "hover:border-yellow-500 hover:bg-yellow-500 hover:text-white"
                                    )}
                                    onClick={() => {
                                        onScheduleCancel();
                                        setAvailabilityView("group");
                                    }}
                                >
                                    <span className="hidden md:flex">
                                        Cancel
                                    </span>
                                    <CircleXIcon />
                                </Button>
                                <Button
                                    className={cn(
                                        "flex-center h-8 min-h-fit border border-green-500 bg-white px-2 uppercase text-secondary md:w-24 md:p-0",
                                        "group hover:border-green-500 hover:bg-green-500"
                                    )}
                                    type="submit"
                                    onClick={() =>
                                        console.log(
                                            "Meeting schedule blocks selected: "
                                        )
                                    }
                                >
                                    <span className="hidden text-green-500 group-hover:text-white md:flex">
                                        Save
                                    </span>
                                    <CircleCheckIcon className="text-green-500 group-hover:text-white" />
                                </Button>
                            </div>
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
                meetingId={meetingData.id}
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
