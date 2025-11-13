"use client";

// import { MeetingCardStatus } from "@/components/summary/meeting-card-status";
import { SelectMeeting } from "@/db/schema";
import { Calendar, Clock, UsersIcon } from "lucide-react";

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

const DateRange = ({ dates }: { dates: string[] | null }) => {
    if (!dates || dates.length === 0) return <>No dates specified</>;

    if (dates.length === 1) {
        return (
            <>
                {new Date(dates[0]).toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                })}
            </>
        );
    }

    const sortedDates = [...dates].sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const first = new Date(sortedDates[0]).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
    });
    const last = new Date(
        sortedDates[sortedDates.length - 1]
    ).toLocaleDateString("en-US", { month: "numeric", day: "numeric" });

    return <>{`${first} - ${last}`}</>;
};

export const MeetingCard = ({ meeting }: MeetingCardProps) => {
    const { title, fromTime, toTime, dates } = meeting;

    return (
        <div className="flex items-center gap-4 rounded-xl border-2 border-gray-200 bg-[#F9FAFB] bg-opacity-50 p-6 pr-8">
            <UsersIcon className="size-10 shrink-0 rounded-full border-2 border-gray-200 p-2 text-gray-500" />

            <div className="flex-grow space-y-1">
                <h3 className="truncate font-dm-sans text-xl font-medium text-gray-800">
                    {title}
                </h3>

                <div className="flex flex-row flex-wrap items-center gap-x-4 font-dm-sans text-sm font-semibold text-gray-500">
                    <div className="flex flex-nowrap items-center gap-x-1">
                        <Calendar className="size-4" />
                        <span className="p text-nowrap">
                            <DateRange dates={dates} />
                        </span>
                    </div>

                    <div className="flex flex-nowrap items-center gap-x-1">
                        <Clock className="size-4" />
                        <span className="text-nowrap">
                            {formatTime(fromTime)} - {formatTime(toTime)}
                        </span>
                    </div>

                    {/* <Dot className="size-4" />

                    <div className="flex flex-nowrap items-center gap-x-1">
                        <MapPin className="size-4" />
                        <span className="text-nowrap">
                            {location ?? "Not specified"}
                        </span>
                    </div> */}
                </div>
            </div>

            {/* <MeetingCardStatus /> */}
        </div>
    );
};
