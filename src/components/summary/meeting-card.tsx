"use client";

// import { MeetingCardStatus } from "@/components/summary/meeting-card-status";
import { SelectMeeting } from "@/db/schema";
import { Clock, MapPin, UsersIcon } from "lucide-react";

const formatTime = (time: string): string => {
    const [hourStr] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour} ${ampm}`;
};

interface MeetingCardProps {
    meeting: SelectMeeting;
}

export const MeetingCard = ({ meeting }: MeetingCardProps) => {
    const { title, fromTime, toTime, location } = meeting;

    return (
        <div className="flex items-center gap-4 rounded-xl border-2 border-gray-200 bg-[#F9FAFB] bg-opacity-50 p-6 pr-8">
            <UsersIcon className="size-10 rounded-full border-2 border-gray-200 p-2 text-gray-500" />

            <div className="flex-grow space-y-1">
                <h3 className="truncate font-dm-sans text-xl font-medium text-gray-800">
                    {title}
                </h3>

                <div className="flex flex-col gap-x-2 font-dm-sans text-sm font-semibold text-gray-500 md:flex-row">
                    <div className="flex items-center gap-x-1">
                        <Clock className="size-4" />
                        <span>
                            {formatTime(fromTime)} - {formatTime(toTime)}
                        </span>
                    </div>

                    <div className="flex items-center gap-x-1">
                        <MapPin className="size-4" />
                        <span>{location ?? "Not specified"}</span>
                    </div>
                </div>
            </div>

            {/* <MeetingCardStatus /> */}
        </div>
    );
};
