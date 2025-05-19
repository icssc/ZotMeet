import React, { useState } from "react";
import { Calendar } from "@/components/creation/calendar/calendar";
import { MeetingNameField } from "@/components/creation/fields/meeting-name-field";
import { MeetingTimeField } from "@/components/creation/fields/meeting-time-field";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { SelectMeeting } from "@/db/schema";
import { HourMinuteString } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";
import { editMeeting } from "@actions/meeting/edit/action";
import { toast } from "sonner";

interface EditModalProps {
    meetingData: SelectMeeting;
    isOpen: boolean;
    onClose: () => void;
}
const EditModal = ({ meetingData, isOpen, onClose }: EditModalProps) => {
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
            await editMeeting(meetingData, newMeeting);
            toast.success("Meeting updated successfully!");
            onClose();
        } catch (error) {
            alert("Failed to save the meeting. Please try again.");
        }
    };
    return (
        <Dialog open={isOpen}>
            <DialogContent className="md:max-w-1xl lg:max-h-lg overflow-y-auto rounded bg-white p-6 shadow-lg lg:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Meeting</DialogTitle>
                </DialogHeader>
                <DialogDescription className="relative flex max-h-[60vh] w-full flex-col gap-6 overflow-y-auto rounded-xl border bg-white px-8 py-6 md:px-14">
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
                </DialogDescription>
                <DialogFooter>
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
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export { EditModal };
