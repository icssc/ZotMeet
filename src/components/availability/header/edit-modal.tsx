import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
    handleOpenChange: (open: boolean) => void;
}

export const EditModal = ({
    meetingData,
    isOpen,
    handleOpenChange,
}: EditModalProps) => {
    const router = useRouter();

    const [selectedDays, setSelectedDays] = useState<ZotDate[]>(
        meetingData.dates.map((date) => new ZotDate(new Date(date)))
    );
    const [startTime, setStartTime] = useState<HourMinuteString>(
        meetingData.fromTime as HourMinuteString
    );
    const [endTime, setEndTime] = useState<HourMinuteString>(
        meetingData.toTime as HourMinuteString
    );
    const [meetingName, setMeetingName] = useState(meetingData.title);

    const handleEditClick = async () => {
        const updatedMeetingData = {
            title: meetingName,
            description: meetingData.description || "",
            fromTime: startTime,
            toTime: endTime,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            dates: selectedDays.map((zotDate) => zotDate.day.toISOString()),
        };

        const updatedMeeting = {
            ...meetingData,
            ...updatedMeetingData,
        };

        const { success, error } = await editMeeting(updatedMeeting);

        if (success) {
            toast.success("Meeting updated successfully!");
            window.location.reload();
        } else {
            toast.error(error);
        }

        handleOpenChange(false);
    };

    const hasValidInputs = useMemo(() => {
        return (
            selectedDays.length > 0 &&
            startTime &&
            endTime &&
            startTime < endTime &&
            meetingName
        );
    }, [selectedDays.length, startTime, endTime, meetingName]);

    if (!isOpen) {
        return null;
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={handleOpenChange}
        >
            <DialogContent className="max-w-6xl">
                <DialogHeader>
                    <DialogTitle>Edit Meeting</DialogTitle>
                </DialogHeader>

                <DialogDescription className="flex flex-col space-y-6 px-4 pb-6">
                    <MeetingNameField
                        meetingName={meetingName}
                        setMeetingName={setMeetingName}
                    />

                    <MeetingTimeField
                        startTime={startTime}
                        setStartTime={setStartTime}
                        endTime={endTime}
                        setEndTime={setEndTime}
                    />

                    <Calendar
                        selectedDays={selectedDays}
                        setSelectedDays={setSelectedDays}
                    />
                </DialogDescription>

                <DialogFooter>
                    <Button
                        onClick={() => handleOpenChange(false)}
                        variant={"outline"}
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleEditClick}
                        disabled={!hasValidInputs}
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
