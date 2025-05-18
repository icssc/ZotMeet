import React, { useState } from "react";
import { Calendar } from "@/components/creation/calendar/calendar";
import { MeetingNameField } from "@/components/creation/fields/meeting-name-field";
import { MeetingTimeField } from "@/components/creation/fields/meeting-time-field";
import { Button } from "@/components/ui/button";
import { SelectMeeting } from "@/db/schema";
import { HourMinuteString } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";
import { editMeeting } from "@actions/meeting/edit/action";
import { toast } from "sonner";

interface EditingModalProps {
    meetingId: string;
    meetingData: SelectMeeting;
    isOpen: boolean;
    onClose: () => void;

    children?: React.ReactNode;
}
const EditingModal: React.FC<EditingModalProps> = ({
    meetingId,
    meetingData,
    isOpen,
    onClose,
}) => {
    const [selectedDays, setSelectedDays] = useState<ZotDate[]>([]);

    const [startTime, setStartTime] = useState<HourMinuteString>("09:00:00");
    const [endTime, setEndTime] = useState<HourMinuteString>("13:00:00");
    const [meetingName, setMeetingName] = useState("");

    if (!isOpen) {
        return null;
    }

    const handleEditClick = async () => {
        console.log("in handleEditClick");
        const title = meetingName;
        const fromTime = startTime;
        const toTime = endTime;

        const newMeetingDates = selectedDays;

        const newMeeting = {
            title,
            description: "",
            fromTime,
            toTime,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            meetingDates: newMeetingDates.map((zotDate) =>
                zotDate.day.toISOString()
            ),
        };

        try {
            await editMeeting(meetingId, meetingData, newMeeting);
            toast.success("Meeting updated successfully!");
            onClose();
        } catch (error) {
            alert("Failed to save the meeting. Please try again.");
        }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-lg rounded bg-white p-6 shadow-lg md:max-w-2xl lg:max-w-4xl">
                <div className="relative max-h-[60vh] w-full overflow-y-auto rounded-xl border bg-white px-8 py-6 md:px-14">
                    <div className="flex flex-col gap-6">
                        <h2 className="font-bold-montserrat mb-4 text-xl">
                            Edit Meeting
                        </h2>
                        <MeetingNameField
                            meetingName={meetingName}
                            setMeetingName={setMeetingName}
                        />

                        <MeetingTimeField
                            setStartTime={setStartTime}
                            setEndTime={setEndTime}
                        />

                        <Calendar
                            selectedDays={selectedDays}
                            setSelectedDays={setSelectedDays}
                        />
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="absolute right-2 top-2 text-gray-500 hover:text-black"
                >
                    &times;
                </button>
                <div className="flex justify-end gap-2">
                    <Button
                        onClick={onClose}
                        className="mt-4 rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleEditClick}
                        className="mt-4 justify-end rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditingModal;
