import React, { useState } from "react";
import { HourMinuteString } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";

import { Calendar } from "../creation/calendar/calendar";
import { MeetingNameField } from "../creation/fields/meeting-name-field";
import { MeetingTimeField } from "../creation/fields/meeting-time-field";

type ModalProps = {
    isOpen: boolean;
    onClose: (meeting: any) => void;
    onSave: (meeting: {
        title: string;
        description: string;
        fromTime: HourMinuteString;
        toTime: HourMinuteString;
        timezone: string;
        meetingDates: string[];
    }) => void;
    children: React.ReactNode;
};

const EditingModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
    if (!isOpen) return null;
    const [selectedDays, setSelectedDays] = useState<ZotDate[]>([]);

    const [startTime, setStartTime] = useState<HourMinuteString>("09:00:00");
    const [endTime, setEndTime] = useState<HourMinuteString>("13:00:00");
    const [meetingName, setMeetingName] = useState("");

    const handleEditClick = async () => {
        const newName = meetingName;
        const newStartTime = startTime as HourMinuteString;
        const newEndTime = endTime as HourMinuteString;

        const newMeetingDates = selectedDays;

        // You can add actual logic here, e.g. API call or state update
        const newMeeting = {
            title: newName,
            description: "",
            fromTime: newStartTime,
            toTime: newEndTime,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            meetingDates: newMeetingDates.map((zotDate) =>
                zotDate.day.toISOString()
            ),
        };

        onSave(newMeeting);
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
                    <button
                        onClick={onClose}
                        className="mt-4 rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleEditClick}
                        className="mt-4 justify-end rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditingModal;
